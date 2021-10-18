import { Commit, Author } from './commits'
import { Row, Column, TableCell } from './coda'
const moment = require('moment')

export function buildRow(columns: Column[], commit: Commit) {
    var cells: TableCell[] = []
    for(var key in columns) {
        var column = columns[key]
        var cell = {
            column: column.id,
            value: valueForColumn(column.name, commit)
        } as TableCell
        cells.push(cell)
    }

    var row = {
        cells: cells
    } as Row

    return {
        rows: [row]
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
            return moment(commit.timestamp).format("YYYY-MM-DD HH:mm:ss")
    }
    return ""
}


// var secondTableRequestData = {
//     "rows": [
//         {
//             "cells": [
//                 {
//                     "column": "c-bqKCVIJKVR",
//                     "value": "Bug fixes"
//                 },
//                 {
//                     "column": "c-EKPQx6MCgy",
//                     "value": "AZielinsky"
//                 },
//                 {
//                     "column": "c-8bhw8a6CFr",
//                     "value": "www.github.com"
//                 },
//                 {
//                     "column": "c-DEUVCy9iqS",
//                     "value": "4/10/2021"
//                 }
//             ]
//         }
//     ]
// }
