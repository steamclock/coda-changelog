
import * as core from '@actions/core'
import * as github from '@actions/github'
import { Commit } from './model/commit'
import moment from 'moment'

export async function getCommitHistory(
    token: string,
    owner: string,
    repo: string,
    base: string,
    head: string
)  {
    const octokit = github.getOctokit(token)
    await octokit.rest.repos.compareCommits({
        owner: owner,
        repo: repo,
        base: base,
        head: head,
    }).then((response) => {
    const commits = response.data.commits.map(c => {
        return {
            author: {
                email: c.commit.author?.email ,
                name: c.commit.author?.name,
                username: c.author?.login
            },
            message: c.commit.message,
            timestamp: c.commit.author?.date,
            url: c.commit.url
        } as Commit
    })
        for (const c of commits) {
            console.log(c)
        }
        return commits
    }).catch(error => {
        console.error("Failed to retrieve commits", error);
        return error
    });
}
  
function sortCommits(commits: Commit[]): Commit[] {
    return commits.sort((a, b) => {
    var firstDate = moment(a.timestamp)
    var secondDate = moment(b.timestamp)
    if (firstDate.isBefore(secondDate)) {
        return -1
    } else if (secondDate.isBefore(firstDate)) {
        return 1
    }
    return 0
    })
}

// octokit.rest.repos.tag
// const { data: commits } = await octokit.rest.repos.listCommits({
//   owner: owner,
//   repo: repo,
// });
    
  