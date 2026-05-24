/** handler.SwaggerErrorDetails */
export interface ApiErrorDetail {
  code: string
  message: string
  field?: string
}

/** handler.ErrorEnvelope */
export interface ErrorEnvelope {
  errors: ApiErrorDetail[]
}

/** handler.AdminMeEnvelope / handler.OAuthLoginURLEnvelope data wrapper */
export interface ApiEnvelope<T> {
  data?: T
  errors?: ApiErrorDetail[]
}

/** handler.adminMeResponse */
export interface AdminMeApiResponse {
  id: string
  email: string
  name?: string
  avatar_url?: string
  role: string
  status: string
}

/** handler.oauthLoginURLResponse */
export interface OAuthLoginUrlApiResponse {
  url: string
}

export interface GoogleCallbackParams {
  code: string
  state: string
}

/** Response body for GET /admin/auth/google/callback */
export interface GoogleCallbackApiResponse {
  verified: boolean
  redirect_url: string
}
