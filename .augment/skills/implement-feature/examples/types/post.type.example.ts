export type PostStatus = 'published' | 'draft' | 'archived';
export interface Post {
  id: number;
  title: string;
  content: string;
  thumbnailUrl: string
  status: PostStatus;
}