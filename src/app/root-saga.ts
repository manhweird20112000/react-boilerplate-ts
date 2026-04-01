import { all, fork } from "redux-saga/effects";

import postsSaga from "~/features/posts/store/saga";

export default function* rootSaga() {
  yield all([fork(postsSaga)]);
}