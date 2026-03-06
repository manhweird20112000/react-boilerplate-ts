import { call, put, takeLatest } from "redux-saga/effects";
import type { AxiosResponse } from "axios";

import { PostService } from "~/features/posts/services";
import { postsActions } from "~/features/posts/store/slice";
import type { Post } from "~/features/posts/types";

function* handleFetchPosts() {
  try {
    const response: AxiosResponse<Post[]> = yield call(
      PostService.fetchPosts
    );
    yield put(postsActions.fetchPostsSuccess(response.data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to fetch posts";
    yield put(postsActions.fetchPostsFailure(message));
  }
}

export default function* postsSaga() {
  yield takeLatest(postsActions.fetchPostsRequest.type, handleFetchPosts);
}
