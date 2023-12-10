import { all } from 'redux-saga/effects'

import example from './example'


const sagas = [...example()]

export default function * root () {
  yield all(sagas)
}
