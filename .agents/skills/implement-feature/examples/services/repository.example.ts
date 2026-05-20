import type { Future, PaginatedData } from '@/shared/types/common';
import { CreateFormDto } from "../types/create-post-dto.type.example";
import { Post } from '../types/post.type.example';

export abstract class PostRepository {
  abstract create(post: CreateFormDto): Future<boolean>;
  abstract list(query: Record<string, any>): Future<PaginatedData<Post>>;
  abstract getById(id: number): Future<Post | null>;
  abstract update(id: number, post: CreateFormDto): Future<boolean>;
  abstract delete(id: number): Future<boolean>;
}