import * as core from '@actions/core'
import * as api from './coda'
import * as rowBuilder from './row-builder'
import { Commit } from './model/commit'

async function run(): Promise<void> {
  try {
    const commits = JSON.parse(core.getInput('commits')) as Commit[]
    const docId = core.getInput('doc-id')
    var columns = await api.getColumnsForTable(docId, 'Release 2.0')
    await api.insertRows(docId, 'Release 2.0', rowBuilder.buildRow(columns, commits[0]))
 
    console.log(`List of column ids: ${columns}`)
    commits.forEach((commit) => {
        console.log(`Posting commit : ${commit}`)
    });

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()