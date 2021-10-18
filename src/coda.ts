const axios = require('axios').default;
import * as core from '@actions/core'
import { Rows, Column } from './model/table'

axios.defaults.baseURL = "https://coda.io/apis/v1/"
axios.defaults.headers.common['Authorization'] = `Bearer ${core.getInput('coda-token')}`;

async function getTables(docId: string) {
    return axios 
        .get(`docs/${docId}/tables`)
        .then(async (response: any) => {
            console.log(response.data.items)
        })
        .catch((error: any) => {
            console.log(error);
        });
}

export async function getColumnsForTable(docId: string, tableName: string) {
    return axios 
        .get(`docs/${docId}/tables/${tableName}/columns`)
        .then(async (response: any) => {
            var columns = response.data.items as Column[]
            return columns
        })
        .catch((error: any) => {
            console.log(error);
        });
}

export async function insertRows(docId: string, tableName: string, rows: Rows) {
    return axios 
        .post(`docs/${docId}/tables/${tableName}/rows`, rows)
        .then(async (response: any) => {
            console.log(response)
        })
        .catch((error: any) => {
            console.log(error);
        });
}