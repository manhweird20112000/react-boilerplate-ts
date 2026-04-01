import { combineReducers } from "@reduxjs/toolkit";

import authReducer from "~/features/auth/store/slice";
import postsReducer from "~/features/posts/store/slice";

/**
 * Root Redux reducer composed from feature module reducers.
 */
export const rootReducer = combineReducers({
  posts: postsReducer,
  auth: authReducer,
});

export type RootReducerState = ReturnType<typeof rootReducer>;
