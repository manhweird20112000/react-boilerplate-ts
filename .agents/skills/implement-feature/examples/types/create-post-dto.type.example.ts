import { PostStatus } from './post.type.example'

export interface CreatePostDto {
  title: string
  content: string
  thumbnailUrl: string
  status: PostStatus
  images?: string[]
}
