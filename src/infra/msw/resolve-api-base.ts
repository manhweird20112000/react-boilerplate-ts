/**
 * Same logical API base as {@link ~/infra/api/http-service} for MSW handler URLs.
 */
export function resolveMswApiBase(): string {
  const raw = import.meta.env['VITE_API_URL']
  if (!raw || typeof raw !== 'string' || raw.trim() === '') {
    return ''
  }
  try {
    const parsed = new URL(raw)
    const path = parsed.pathname.replace(/\/+$/u, '')
    return `${parsed.origin}${path}`
  } catch {
    return raw.replace(/\/+$/u, '')
  }
}
