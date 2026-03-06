import type { AxiosResponse } from "axios";

import { HttpService } from "~/core/utils/api";
import type { CreatePostPayload, Post } from "~/features/posts/types";

const POSTS_ENDPOINT = "/posts";

/**
 * Service for managing post-related API calls
 */
export const PostService = {
  fetchPosts(): Promise<AxiosResponse<Post[]>> {
    return HttpService.get<undefined, AxiosResponse<Post[]>>(POSTS_ENDPOINT);
  },

  fetchPostById(id: number): Promise<AxiosResponse<Post>> {
    return HttpService.get<undefined, AxiosResponse<Post>>(
      `${POSTS_ENDPOINT}/${id}`
    );
  },

  createPost(payload: CreatePostPayload): Promise<AxiosResponse<Post>> {
    return HttpService.post<CreatePostPayload, AxiosResponse<Post>>(
      POSTS_ENDPOINT,
      payload
    );
  },

  deletePost(id: number): Promise<AxiosResponse<void>> {
    return HttpService.delete<AxiosResponse<void>>(
      `${POSTS_ENDPOINT}/${id}`
    );
  },
};
