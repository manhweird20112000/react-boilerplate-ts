import { combineReducers } from "@reduxjs/toolkit";

import postsReducer from "~/features/posts/store/slice";

/**
 * Root Redux reducer composed from feature module reducers.
 */
export const rootReducer = combineReducers({
  posts: postsReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
