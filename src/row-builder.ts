import { Commit } from './model/commit'
import { Row, Column, TableCell } from './model/table'

export function buildRows(columns: Column[], commits: Commit[]) {
    
    var rows: Row[] = []
    commits.forEach((commit) => {
        const cells = columns.map(column => {
            return {
                column: column.id,
                value: valueForColumn(column.name, commit)
            } as TableCell
        })
        const row = { cells: cells } as Row
        rows.push(row)
    })
    console.log(`Rows: ${rows}`)
    return {
        rows: rows
    }
}

function valueForColumn(name: string, commit: Commit): string {
    switch (name) {
        case "Commit":
            return commit.message
        case "Author":
            return commit.author.username
        case "Url":
            return commit.url
        case "Date":
            return commit.timestamp
    }
    return ""
}
