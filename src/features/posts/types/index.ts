export interface Post {
  readonly id: number;
  readonly userId: number;
  readonly title: string;
  readonly body: string;
}

export interface CreatePostPayload {
  readonly title: string;
  readonly body: string;
  readonly userId: number;
}
