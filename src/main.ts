import * as core from '@actions/core'
import { wait } from './wait'

async function run(): Promise<void> {
  try {
    const ms: string = core.getInput('milliseconds')
    const commits = core.getInput('commits')
    console.log(`Waiting ${ms} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_STEP_DEBUG` to true

    console.log(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    console.log(new Date().toTimeString())

    console.log(`List of commits: ${commits}`)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
