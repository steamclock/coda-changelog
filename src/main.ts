/* eslint-disable sort-imports */
import * as core from '@actions/core'
import * as api from './api/coda'
import * as rowBuilder from './row-builder'
import * as github from '@actions/github'
import * as commits from './api/commits'
import {Commit} from './model/commit'

async function run(): Promise<void> {
  try {
    core.startGroup('📘 Reading input values!')
    const token = core.getInput('token')
    const owner = core.getInput('owner') || github.context.repo.owner
    const repo = core.getInput('repo') || github.context.repo.repo
    const commitEvent = JSON.parse(core.getInput('commits')) as Commit[]
    const branch = core.getInput('branch')
    const fromTag = core.getInput('fromTag')
    const tableName = core.getInput('table')
    const docId = core.getInput('doc-id')

    core.info(`fromTag: ${fromTag}`)
    core.info(`branch: ${branch}`)
    core.info(`owner: ${owner}`)
    core.info(`repo: ${repo}`)
    core.info(`tableName: ${tableName}`)
    core.info(`docId: ${docId}`)

    core.endGroup()

    core.startGroup('🎣 Fetching Commits...')
    //Check latest commit written to table
    const lastCommitDate = await api.getLatestCommitDate(docId, tableName)
    core.info(`lastCommitDate: ${lastCommitDate}`)

    let commitsToUpload: Commit[] = commitEvent
    //If nil the table is empty and we want to fetch all commits since tag
    if (!lastCommitDate) {
      core.info(`Fetching Commit History since tag: ${fromTag}`)
      const commitsSinceTag = await commits.getCommitHistory(
        token,
        owner,
        repo,
        fromTag,
        branch
      )
      if (commitsSinceTag !== undefined && commitsSinceTag.length > 0) {
        commitsToUpload = commitsSinceTag
      }
    } else {
      //If we have a lastCommit date value get all commits since the date
      core.info(`Fetching Commit History since date: ${lastCommitDate}`)
      const commitsSinceDate = await commits.getCommitsSinceDate(
        token,
        owner,
        repo,
        lastCommitDate
      )
      core.info(`# of commits found since date: ${commitsSinceDate.length}`)
      if (commitsSinceDate !== undefined && commitsSinceDate.length > 0) {
        commitsToUpload = commitsSinceDate
      }
    }
    core.info(`# of commits found: ${commitsToUpload.length}`)

    //Look through commit messages for any [{Github Issue #}] and try fetching that issues title to replace the # in the commit message
    core.info(`Looking for github issues to link...`)
    for await (const commit of commitsToUpload) {
      const updatedMessage = await replaceAsync(
        commit.message,
        /\[#?(?<issue>\d*?)]/gi,
        async issueNumber => {
          const title = await commits.getIssueTitle(
            token,
            owner,
            repo,
            issueNumber
          )
          return `[${title}]`
        }
      )
      commit.message = updatedMessage
    }
    core.endGroup()

    core.startGroup('💪 Writing to Coda!')
    if (commitsToUpload === undefined || commitsToUpload.length === 0) {
      core.warning('No Commits found / uploaded')
    } else {
      const columns = await api.getColumnsForTable(docId, tableName)
      await api.insertRows(
        docId,
        tableName,
        rowBuilder.buildRows(columns, commitsToUpload)
      )
    }
    core.endGroup()

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

async function replaceAsync(str, regex, asyncFn) {
  const promises = [] as any
  str.replace(regex, (match, ...args) => {
    const promise = asyncFn(args[0])
    promises.push(promise)
  })
  const data = await Promise.all(promises)
  return str.replace(regex, () => data.shift())
}

run()
