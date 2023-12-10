import { delay, takeLatest } from "redux-saga/effects"

import { EExampleType } from "./types"

function * getPosts () {
  yield delay(1)
  console.log('get Posts')
}

const example = () => [
  takeLatest(EExampleType.GET_POST, getPosts)
]

export default example
