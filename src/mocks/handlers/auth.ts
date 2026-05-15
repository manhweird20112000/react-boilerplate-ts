import { http, HttpResponse } from 'msw'
import { createAuthResponse, createUser } from '../factories'
import { findUserByEmail, addUser } from '../db'

const authPath = (path: string): RegExp => new RegExp(`/(?:api/)?auth/${path}(?:[?#].*)?$`)

export const authHandlers = [
  http.post(authPath('login'), async ({ request }) => {
    const { email, password } = (await request.json()) as any
    
    const user = findUserByEmail(email)
    
    // Check for mock admin or users in DB
    if ((email === 'admin@example.com' && password === 'password') || (user && password === 'password123')) {
      const authData = createAuthResponse(user || {
        id: '1',
        email: 'admin@example.com',
        username: 'admin',
        role: 'admin',
        createdAt: new Date().toISOString()
      })
      
      return HttpResponse.json({
        success: true,
        message: 'Login successful',
        data: authData
      })
    }
    
    return HttpResponse.json({
      success: false,
      message: 'Invalid email or password',
      data: null
    }, { status: 401 })
  }),

  http.post(authPath('register'), async ({ request }) => {
    const data = (await request.json()) as any
    const newUser = {
      ...createUser(),
      email: data.email,
      username: data.username || data.name,
    }
    addUser(newUser)
    
    return HttpResponse.json({
      success: true,
      message: 'Registration successful',
      data: createAuthResponse(newUser)
    })
  }),

  http.post(authPath('logout'), () => {
    return HttpResponse.json({
      success: true,
      message: 'Logged out successfully',
      data: null
    })
  }),

  http.get(authPath('me'), () => {
    return HttpResponse.json({
      success: true,
      message: 'User profile fetched',
      data: createAuthResponse()
    })
  }),

  http.post(authPath('forgot-password'), () => {
    return HttpResponse.json({
      success: true,
      message: 'Recovery email sent',
      data: null
    })
  }),

  http.post(authPath('token-refresh'), () => {
    return HttpResponse.json({
      success: true,
      message: 'Token refreshed',
      data: createAuthResponse()
    })
  })
]

