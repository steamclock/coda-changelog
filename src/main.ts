import * as core from '@actions/core'
import * as api from './coda'
import * as rowBuilder from './row-builder'
import * as github from '@actions/github'
import { Commit } from './model/commit'
import * as commits from './commits'

async function run(): Promise<void> {
  try {
    
    const token = core.getInput('token')
    const owner = core.getInput('owner') || github.context.repo.owner
    const repo = core.getInput('repo') || github.context.repo.repo

    console.log(`owner: ${owner}`)
    console.log(`repo: ${repo}`)

    const branch = core.getInput('branch')
    const fromTag = core.getInput('fromTag')

    console.log(`fromTag: ${fromTag}`)
    console.log(`branch: ${branch}`)
    
    const tableName = core.getInput('table')
    const docId = core.getInput('doc-id')

    console.log(`tableName: ${tableName}`)
    console.log(`docId: ${docId}`)

    //TODO: if fromTag is empty or Coda table has rows skip this step
    const commitSinceTag = await commits.getCommitHistory(token, owner, repo, fromTag, branch)

    var columns = await api.getColumnsForTable(docId, tableName)
    
    if (commitSinceTag === undefined || commitSinceTag.length == 0) {
      console.log("No commits found")
    } else {
      await api.insertRows(docId, tableName, rowBuilder.buildRow(columns, commitSinceTag))
    }
    
    console.log(`Commits since last tag: ${commitSinceTag}`)
    //console.log(`Posting commit : ${commits}`)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
// var commitsSinceLastTag = JSON.parse(core.getInput('all-commits')) as Commit[]
//     const commits = JSON.parse(core.getInput('commits')) as Commit[]

//     const tableName = core.getInput('table')
//     const docId = core.getInput('doc-id')

//     var columns = await api.getColumnsForTable(docId, tableName)
    
//     if (commitsSinceLastTag === undefined || commitsSinceLastTag.length == 0) {
//         await api.insertRows(docId, tableName, rowBuilder.buildRow(columns, [commits[0]]))
//     } else {
//         commitsSinceLastTag.push(commits[0])
//         await api.insertRows(docId, tableName, rowBuilder.buildRow(columns, commitsSinceLastTag))
//     }
 
//     console.log(`Commits since last tag: ${commitsSinceLastTag}`)
//     console.log(`Posting commit : ${commits}`)

run()