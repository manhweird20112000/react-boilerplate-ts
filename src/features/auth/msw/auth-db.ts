import { createUser } from './auth-factory'

export const authDb = {
  users: Array.from({ length: 50 }, createUser)
}

export const findUserByEmail = (email: string) => authDb.users.find((user) => user.email === email)

export const addUser = (user: ReturnType<typeof createUser>) => {
  authDb.users.push(user)

  return user
}
