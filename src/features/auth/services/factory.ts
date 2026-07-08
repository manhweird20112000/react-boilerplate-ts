import { HttpAuthRepository } from './http-auth-repository'
import type { AuthRepository } from './repository'

class AuthRepositoryFactory {
  private instance: AuthRepository | null = null

  public getRepository(): AuthRepository {
    if (this.instance) return this.instance

    this.instance = new HttpAuthRepository()

    return this.instance
  }
}

export const authRepositoryFactory = new AuthRepositoryFactory()
export const authRepo = authRepositoryFactory.getRepository()
