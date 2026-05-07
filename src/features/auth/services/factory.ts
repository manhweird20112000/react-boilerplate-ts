import { AuthRepository } from './repository'
import { HttpAuthRepository } from './http-auth-repository'
import { MockAuthRepository } from './mock-auth-repository'

class AuthRepositoryFactory {
  private instance: AuthRepository | null = null

  public getRepository(): AuthRepository {
    if (this.instance) return this.instance

    const isMock = import.meta.env.VITE_USE_MOCK === 'true'
    const isMSW = import.meta.env.VITE_USE_MSW === 'true'
    
    // If using MSW, we want to use the HttpAuthRepository because MSW intercepts HTTP calls
    this.instance = (isMSW || !isMock) ? new HttpAuthRepository() : new MockAuthRepository()

    return this.instance
  }
}

export const authRepositoryFactory = new AuthRepositoryFactory()
export const authRepo = authRepositoryFactory.getRepository()
