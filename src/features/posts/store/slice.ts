import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Post } from "~/features/posts/types";

interface PostsState {
  readonly items: Post[];
  readonly isLoading: boolean;
  readonly hasError: boolean;
  readonly errorMessage: string;
}

const initialState: PostsState = {
  items: [],
  isLoading: false,
  hasError: false,
  errorMessage: "",
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    fetchPostsRequest(state) {
      state.isLoading = true;
      state.hasError = false;
      state.errorMessage = "";
    },
    fetchPostsSuccess(state, action: PayloadAction<Post[]>) {
      state.items = action.payload;
      state.isLoading = false;
    },
    fetchPostsFailure(state, action: PayloadAction<string>) {
      state.isLoading = false;
      state.hasError = true;
      state.errorMessage = action.payload;
    },
  },
});

export const postsActions = postsSlice.actions;
export default postsSlice.reducer;
