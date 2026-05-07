import { AuthRepository } from './repository'
import { HttpAuthRepository } from './http-auth-repository'
import { MockAuthRepository } from './mock-auth-repository'

class AuthRepositoryFactory {
  private instance: AuthRepository | null = null

  public getRepository(): AuthRepository {
    if (this.instance) return this.instance

    const isMock = import.meta.env.VITE_USE_MOCK === 'true'
    this.instance = isMock ? new MockAuthRepository() : new HttpAuthRepository()

    return this.instance
  }
}

export const authRepositoryFactory = new AuthRepositoryFactory()
export const authRepo = authRepositoryFactory.getRepository()
