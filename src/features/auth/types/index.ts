export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
  role: string
  permissions: string[]
}

export interface AuthResponse {
  user: AuthUser
  token?: string // Optional if using purely cookies
}
