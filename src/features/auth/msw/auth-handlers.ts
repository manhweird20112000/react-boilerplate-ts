import { http, HttpResponse } from 'msw'

import { addUser, findUserByEmail } from './auth-db'
import { createAuthResponse, createUser } from './auth-factory'

const authPath = (path: string): RegExp => new RegExp(`/(?:api/)?auth/${path}(?:[?#].*)?$`)

const ok = <T>(message: string, data: T) =>
  HttpResponse.json({
    success: true,
    message,
    data
  })

export const authHandlers = [
  http.post(authPath('login'), async ({ request }) => {
    const { email, password } = (await request.json()) as { email: string; password: string }
    const user = findUserByEmail(email)

    if (
      (email === 'admin@example.com' && password === 'password') ||
      (user && password === 'password123')
    ) {
      return ok(
        'Login successful',
        createAuthResponse(
          user ?? {
            id: '1',
            email: 'admin@example.com',
            username: 'admin',
            role: 'admin',
            createdAt: new Date().toISOString()
          }
        )
      )
    }

    return HttpResponse.json(
      {
        success: false,
        message: 'Invalid email or password',
        data: null
      },
      { status: 401 }
    )
  }),

  http.post(authPath('register'), async ({ request }) => {
    const data = (await request.json()) as { email: string; name?: string; username?: string }
    const newUser = {
      ...createUser(),
      email: data.email,
      username: data.username ?? data.name ?? data.email
    }

    addUser(newUser)

    return ok('Registration successful', createAuthResponse(newUser))
  }),

  http.post(authPath('logout'), () => ok('Logged out successfully', null)),

  http.get(authPath('me'), () => ok('User profile fetched', createAuthResponse())),

  http.post(authPath('forgot-password'), () => ok('Recovery email sent', null)),

  http.post(authPath('token-refresh'), () => ok('Token refreshed', createAuthResponse()))
]
