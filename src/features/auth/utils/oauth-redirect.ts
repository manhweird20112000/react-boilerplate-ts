const DEFAULT_SUCCESS_PATH = '/dashboard'

export function resolveOAuthRedirectPath(redirectTarget: string | undefined): string {
  if (!redirectTarget) {
    return DEFAULT_SUCCESS_PATH
  }
  try {
    const url = new URL(redirectTarget, window.location.origin)
    if (url.origin !== window.location.origin) {
      return url.toString()
    }
    const path = `${url.pathname}${url.search}${url.hash}`
    return path || DEFAULT_SUCCESS_PATH
  } catch {
    return redirectTarget.startsWith('/') ? redirectTarget : DEFAULT_SUCCESS_PATH
  }
}

export function isAbsoluteRedirectUrl(path: string): boolean {
  return path.startsWith('http://') || path.startsWith('https://')
}
