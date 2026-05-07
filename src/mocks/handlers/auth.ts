import { http, HttpResponse } from 'msw'
import { createAuthResponse } from '../factories'
import { findUserByEmail } from '../db'

export const authHandlers = [
  http.post('*/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as any
    
    const user = findUserByEmail(email)
    
    if (user && password === 'password123') {
      return HttpResponse.json(createAuthResponse(user))
    }
    
    return new HttpResponse(null, { status: 401 })
  }),

  http.post('*/api/auth/logout', () => {
    return new HttpResponse(null, { status: 200 })
  }),

  http.get('*/api/auth/me', () => {
    // Return a random user from DB for "me" endpoint
    return HttpResponse.json(createAuthResponse())
  })
]
