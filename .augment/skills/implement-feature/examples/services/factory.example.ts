import { MockPostRepositoryImpl } from './mock-post.repository.impl'
import { PostRepositoryImpl } from './post.repository.impl.exmaple'
import { PostRepository } from './repository.example'

class PostRepositoryFactory {
  private static instance: PostRepository

  public getRepository(): PostRepository {
    if (this.instance) return this.instance

    const isMock = import.meta.env.VITE_USE_MOCK === 'true'
    const isMSW = import.meta.env.VITE_USE_MSW === 'true'

    // If using MSW, we want to use the HttpAuthRepository because MSW intercepts HTTP calls
    this.instance = isMSW || !isMock ? new PostRepositoryImpl() : new MockPostRepositoryImpl()

    return this.instance
  }
}


export const postRepositoryFactory = new PostRepositoryFactory()
export const postRepo = postRepositoryFactory.getRepository()