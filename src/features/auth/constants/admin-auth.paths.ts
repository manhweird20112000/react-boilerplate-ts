/** Admin auth API paths (Noice API swagger: admin-auth). */
export const ADMIN_AUTH_PATHS = {
  googleUrl: '/admin/auth/google/url',
  googleLogin: '/admin/auth/google/login',
  googleCallback: '/admin/auth/google/callback',
  logout: '/admin/auth/logout',
  me: '/admin/me'
} as const

/** Admin session cookies set by the API. */
export const ADMIN_AUTH_COOKIES = {
  oauthState: 'noice_admin_oauth_state',
  session: 'noice_admin_session'
} as const

/** SPA route Google redirects to after consent. */
export const GOOGLE_CALLBACK_ROUTE = '/auth/google/callback'
