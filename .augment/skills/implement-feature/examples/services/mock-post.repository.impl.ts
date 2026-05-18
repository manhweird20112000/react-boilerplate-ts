import { CreateFormDto } from '../types/create-post-dto.type.example'
import type { Future, PaginatedData } from '@/shared/types/common'
import { HttpService } from '@/infra/http/http.service'
import { PostRepository } from './repository.example'
import { Post } from '../types/post.type.example'

export class MockPostRepositoryImpl implements PostRepository {
  private endpoint = '/posts'

  public create(post: CreateFormDto): Future<boolean> {
    return HttpService.post(this.endpoint, post)
  }
  public list(query: Record<string, any>): Future<PaginatedData<Post>> {
    return HttpService.get(this.endpoint, { params: query })
  }
  public getById(id: number): Future<any> {
    return HttpService.get(`${this.endpoint}/${id}/detail`)
  }
  update(id: number, post: CreateFormDto): Future<boolean> {
    return HttpService.put(`${this.endpoint}/${id}/update`, post)
  }
  public delete(id: number): Future<boolean> {
    return HttpService.delete(`${this.endpoint}/${id}/delete`)
  }
}
