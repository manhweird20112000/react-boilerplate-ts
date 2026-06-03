import { http, HttpResponse } from 'msw'
import { createAuthResponse } from '../factories'
import { ADMIN_AUTH_COOKIES } from '@/features/auth/constants/admin-auth.paths'

const adminAuthPath = (path: string): RegExp =>
  new RegExp(`/(?:api/)?admin/auth/${path}(?:[?#].*)?$`)

const adminPath = (path: string): RegExp => new RegExp(`/(?:api/)?admin/${path}(?:[?#].*)?$`)

const mockAdmin = {
  id: '1',
  email: 'admin@example.com',
  username: 'Admin User',
  role: 'admin',
  createdAt: new Date().toISOString()
} as const

export const authHandlers = [
  http.get(adminAuthPath('google/url'), () => {
    return HttpResponse.json(
      {
        data: {
          url: 'https://accounts.google.com/o/oauth2/v2/auth?client_id=mock'
        }
      },
      {
        headers: {
          'Set-Cookie': `${ADMIN_AUTH_COOKIES.oauthState}=mock-state; Path=/; HttpOnly`
        }
      }
    )
  }),

  http.get(adminAuthPath('google/callback'), ({ request, cookies }) => {
    const url = new URL(request.url)
    const code = url.searchParams.get('code')
    const state = url.searchParams.get('state')

    if (!code || !state) {
      return HttpResponse.json(
        {
          errors: [{ code: 'BAD_REQUEST', message: 'missing OAuth callback parameters' }]
        },
        { status: 400 }
      )
    }

    if (!cookies[ADMIN_AUTH_COOKIES.oauthState]) {
      return HttpResponse.json(
        {
          errors: [{ code: 'UNAUTHORIZED', message: 'invalid OAuth state' }]
        },
        { status: 401 }
      )
    }

    return HttpResponse.json(
      {
        data: {
          verified: true,
          redirect_url: '/dashboard'
        }
      },
      {
        status: 200,
        headers: {
          'Set-Cookie': `${ADMIN_AUTH_COOKIES.session}=mock-session; Path=/; HttpOnly`
        }
      }
    )
  }),

  http.post(adminAuthPath('logout'), () => {
    return new HttpResponse(null, {
      status: 204,
      headers: {
        'Set-Cookie': `${ADMIN_AUTH_COOKIES.session}=; Path=/; Max-Age=0`
      }
    })
  }),

  http.get(adminPath('me'), ({ cookies }) => {
    if (!cookies[ADMIN_AUTH_COOKIES.session]) {
      return HttpResponse.json(
        {
          errors: [{ code: 'UNAUTHORIZED', message: 'unauthorized' }]
        },
        { status: 401 }
      )
    }

    const authData = createAuthResponse(mockAdmin)

    return HttpResponse.json({
      data: {
        id: authData.user.id,
        email: authData.user.email,
        name: authData.user.username,
        avatar_url: undefined,
        role: authData.user.role,
        status: 'active'
      }
    })
  })
]
