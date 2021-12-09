/* eslint-disable object-shorthand */
/* eslint-disable sort-imports */
import {Commit} from './model/commit'
import {Column, Row, TableCell} from './model/table'

export function buildRows(columns: Column[], commits: Commit[]) {
  return commits.map(commit => {
    const cells = columns.map(column => {
      return {
        column: column.id,
        value: valueForColumn(column.name, commit)
      } as TableCell
    })
    return {cells: cells} as Row
  })
}

function valueForColumn(name: string, commit: Commit): string {
  switch (name) {
    case 'Commit':
      return commit.message
    case 'Author':
      return commit.author.username
    case 'Url':
      return commit.url
    case 'Date':
      return commit.timestamp
  }
  return ''
}
