import { createUser } from './factories'

// Simple in-memory DB
export const db = {
  users: Array.from({ length: 50 }, createUser),
  sessions: [],
}

export const findUserByEmail = (email: string) => 
  db.users.find(u => u.email === email)

export const addUser = (user: any) => {
  db.users.push(user)
  return user
}
