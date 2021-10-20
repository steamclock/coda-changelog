import * as core from '@actions/core'
import * as api from './api/coda'
import * as rowBuilder from './row-builder'
import * as github from '@actions/github'
import * as commits from './api/commits'
import { Commit } from './model/commit'

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

    console.log(`fromTag: ${fromTag}`)
    console.log(`branch: ${branch}`)
    console.log(`owner: ${owner}`)
    console.log(`repo: ${repo}`)
    console.log(`tableName: ${tableName}`)
    console.log(`docId: ${docId}`)
    core.endGroup()

    core.startGroup('🎣 Fetching Commits...')
    //Check latest commit written to table
    const lastCommitDate = await api.getLatestCommitDate(docId, tableName)
    console.log(`lastCommitDate: ${lastCommitDate}`)

    var commitsToUpload: Commit[]
    //If nil the table is empty and we want to fetch all commits since tag
    if(lastCommitDate == undefined) {
      console.log(`Fetching Commit History since tag: ${fromTag}`)
      commitsToUpload = await commits.getCommitHistory(token, owner, repo, fromTag, branch)
    } else if(fromTag === undefined || fromTag.length == 0) {
      //If no fromTag just write the single commit event
      commitsToUpload = commitEvent
    } else {
      //If we have a lastCommit date value get all commits since the date 
      console.log(`Fetching Commit History since date: ${lastCommitDate}`)
      commitsToUpload = await commits.getCommitsSinceDate(token,owner,repo, lastCommitDate)
    }
    console.log(`# of commits found: ${commitsToUpload.length}`)
    core.endGroup()

    var columns = await api.getColumnsForTable(docId, tableName)
    core.startGroup('💪 Writing to Coda!')
    if (commitsToUpload === undefined || commitsToUpload.length == 0) {
      core.warning('No Commits found / uploaded')
    } else {
      await api.insertRows(docId, tableName, rowBuilder.buildRow(columns, commitsToUpload))
    }
    core.endGroup()
    
  
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()