import { type AxiosResponse } from 'axios'
import { call, takeLatest } from "redux-saga/effects"

import { getPostExample } from '@/services/example'

import { EExampleType } from "./types"

function * getPosts () {
  try {
    const response : AxiosResponse = yield call(getPostExample)
    console.log(response)
  }catch (error) {
    console.log(error)
  }
}

const example = () => [
  takeLatest(EExampleType.GET_POST, getPosts)
]

export default example
