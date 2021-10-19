import * as core from '@actions/core'
import * as api from './coda'
import * as rowBuilder from './row-builder'
import { Commit } from './model/commit'

async function run(): Promise<void> {
  try {
    
    var commitsSinceLastTag = JSON.parse(core.getInput('all-commits')) as Commit[]
    const commits = JSON.parse(core.getInput('commits')) as Commit[]

    const tableName = core.getInput('table')
    const docId = core.getInput('doc-id')

    var columns = await api.getColumnsForTable(docId, tableName)
    
    if (commitsSinceLastTag === undefined || commitsSinceLastTag.length == 0) {
        await api.insertRows(docId, tableName, rowBuilder.buildRow(columns, [commits[0]]))
    } else {
        commitsSinceLastTag.push(commits[0])
        await api.insertRows(docId, tableName, rowBuilder.buildRow(columns, commitsSinceLastTag))
    }
 
    console.log(`Commits since last tag: ${commitsSinceLastTag}`)
    console.log(`Posting commit : ${commits}`)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()