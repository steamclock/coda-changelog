/* eslint-disable camelcase */
/* eslint-disable github/no-then */
import * as core from '@actions/core'
import * as github from '@actions/github'
import {Commit} from '../model/commit'
import moment from 'moment'

export async function getCommitHistory(
  token: string,
  owner: string,
  repo: string,
  base: string,
  head: string
): Promise<Commit[]> {
  return new Promise(async (resolve, reject) => {
    const octokit = github.getOctokit(token)
    await octokit.rest.repos
      .compareCommits({
        owner,
        repo,
        base,
        head
      })
      .then(response => {
        const commits = response.data.commits.map(item => {
          return dataItemToCommit(item)
        })
        // Removing first element to not include tagged commit
        const sortedCommits = sortCommits(commits).slice(1)
        resolve(sortedCommits)
      })
      .catch(error => {
        core.warning('Failed to retrieve commits', error)
        reject(error)
      })
  })
}

export async function getCommitsSinceDate(
  token: string,
  owner: string,
  repo: string,
  date: string
): Promise<Commit[]> {
  return new Promise(async (resolve, reject) => {
    const octokit = github.getOctokit(token)
    await octokit.rest.repos
      .listCommits({
        owner,
        repo,
        since: date
      })
      .then(response => {
        const commits = response.data.map(item => {
          return dataItemToCommit(item)
        })
        const sortedCommits = sortCommits(commits).slice(1)
        resolve(sortedCommits)
      })
      .catch(error => {
        core.warning('Failed to retrieve commits', error)
        reject(error)
      })
  })
}

function dataItemToCommit(item: any): Commit {
  return {
    author: {
      email: item.commit.author?.email,
      name: item.commit.author?.name,
      username: item.author?.login
    },
    message:
      item.commit.message.split('*').shift()?.trim() ?? item.commit.message,
    timestamp: item.commit.author?.date,
    url: item.html_url
  } as Commit
}

export async function getIssueTitle(
  token: string,
  owner: string,
  repo: string,
  issue_number: number
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    const octokit = github.getOctokit(token)
    await octokit.rest.issues
      .get({
        owner,
        repo,
        issue_number
      })
      .then(response => {
        const title = response.data.title
        core.info(`Found title! ${title}`)
        resolve(title)
      })
      .catch(error => {
        core.warning('Failed to retrieve issue', error)
        reject(error)
      })
  })
}

function sortCommits(commits: Commit[]): Commit[] {
  return commits.sort(
    (a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix()
  )
}
