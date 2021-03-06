/* eslint-disable github/no-then */
/* eslint-disable import/no-commonjs */
import * as core from '@actions/core'
import {Column, Row} from '../model/table'
const axios = require('axios').default

axios.defaults.baseURL = 'https://coda.io/apis/v1/'
axios.defaults.headers.common['Authorization'] = `Bearer ${core.getInput(
  'coda-token'
)}`

export async function getColumnsForTable(docId: string, tableName: string) {
  return axios
    .get(`docs/${docId}/tables/${tableName}/columns`)
    .then(async (response: any) => {
      return response.data.items as Column[]
    })
    .catch((error: any) => {
      core.warning(error)
    })
}

export async function insertRows(
  docId: string,
  tableName: string,
  rows: Row[]
) {
  return axios
    .post(`docs/${docId}/tables/${tableName}/rows`, {
      rows,
      keyColumns: ['Url']
    })
    .catch((error: any) => {
      core.warning(error)
    })
}

export async function getLatestCommitDate(docId: string, tableName: string) {
  return axios
    .get(`docs/${docId}/tables/${tableName}/rows`, {
      params: {
        useColumnNames: 'true'
      }
    })
    .then(async (response: any) => {
      const dates: string[] = response.data.items.map((item: any) => {
        return item.values.Date
      })
      return dates.sort().pop()
    })
    .catch((error: any) => {
      core.warning(error)
    })
}
