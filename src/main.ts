import * as core from '@actions/core'

async function run(): Promise<void> {
  try {
    const commits = core.getInput('commits')
    const token = core.getInput('coda-token')
    const docId = core.getInput('doc-id')
    console.log(`List of commits: ${commits}`)
    console.log(`token: ${token}`)
    console.log(`docId: ${docId}`)
    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
