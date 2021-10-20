const axios = require('axios').default;
import * as core from '@actions/core'
import { Rows, Column } from '../model/table'

axios.defaults.baseURL = "https://coda.io/apis/v1/"
axios.defaults.headers.common['Authorization'] = `Bearer ${core.getInput('coda-token')}`;

export async function getColumnsForTable(docId: string, tableName: string) {
    return axios 
        .get(`docs/${docId}/tables/${tableName}/columns`)
        .then(async (response: any) => {
            var columns = response.data.items as Column[]
            return columns
        })
        .catch((error: any) => {
            core.warning(error);
        });
}

export async function insertRows(docId: string, tableName: string, rows: Rows) {
    return axios 
        .post(`docs/${docId}/tables/${tableName}/rows`, rows)
        .then(async (response: any) => {
            console.log(response)
        })
        .catch((error: any) => {
            core.warning(error);
        });
}

export async function getLatestCommitDate(docId: string, tableName: string) {
    return axios 
        .get(`docs/${docId}/tables/${tableName}/rows`, { 
            params: {
               'useColumnNames': 'true',
            }
        })
        .then(async (response: any) => {
            var items = response.data.items
            console.log(items)
            var dates: string[] = [] 
            for(const item of items) {
                const date = item.values.Date
                dates.push(date)
            }
            var latest = dates.sort().pop()
            console.log(latest)
            return latest
        })
        .catch((error: any) => {
            core.warning(error);
        });
}