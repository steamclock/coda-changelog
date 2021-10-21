import * as core from '@actions/core'
import * as github from '@actions/github'
import { Commit } from '../model/commit'
import moment from 'moment'

export async function getCommitHistory(
    token: string,
    owner: string,
    repo: string,
    base: string,
    head: string): Promise<Commit[]> {
   return new Promise(async (resolve, reject) => {
        const octokit = github.getOctokit(token)
        await octokit.rest.repos.compareCommits({
            owner: owner,
            repo: repo,
            base: base,
            head: head,
        }).then((response) => {
            const commits = response.data.commits.map(item => {
                return dataItemToCommit(item)
            })
            // Removing first element to not include tagged commit
            const sortedCommits = sortCommits(commits).slice(1)
            resolve(sortedCommits)
            }).catch(error => {
                core.warning("Failed to retrieve commits", error);
                reject(error)
            });
    })
}

export async function getCommitsSinceDate(
    token: string, 
    owner: string, 
    repo: string, 
    date: string): Promise<Commit[]> {
    return new Promise(async (resolve, reject) => {
        const octokit = github.getOctokit(token)
        await octokit.rest.repos.listCommits({
            owner: owner,
            repo: repo,
            since: date
        }).then((response) => {
            const commits = response.data.map(item => {
                return dataItemToCommit(item)
            })
            const sortedCommits = sortCommits(commits)
            resolve(sortedCommits)
        }).catch(error => {
            console.log(error)
            core.warning("Failed to retrieve commits", error);
            reject(error)
        });
    })
}

function dataItemToCommit(item: any) {
    return {
        author: {
            email: item.commit.author?.email ,
            name: item.commit.author?.name,
            username: item.author?.login
        },
        message: item.commit.message,
        timestamp: item.commit.author?.date,
        url: item.commit.url
    } as Commit
}

function sortCommits(commits: Commit[]): Commit[] {
    return commits.sort((a, b) => moment(a.timestamp).unix() - moment(b.timestamp).unix())
}
  