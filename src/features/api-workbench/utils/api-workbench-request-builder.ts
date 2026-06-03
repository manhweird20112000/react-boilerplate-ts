import type { ApiWorkbenchAuth } from '../types/api-workbench-auth.type'
import type { ApiWorkbenchKeyValue } from '../types/api-workbench-key-value.type'
import type {
  ApiWorkbenchHttpMethod,
  ApiWorkbenchRequest,
  ApiWorkbenchRequestBody,
  ApiWorkbenchRawBodyLanguage
} from '../types/api-workbench-request.type'

export interface ApiWorkbenchPreparedRequest {
  readonly url: string
  readonly method: ApiWorkbenchHttpMethod
  readonly headers: Headers
  readonly body?: BodyInit
}

export interface ApiWorkbenchNativePreparedRequest {
  readonly url: string
  readonly method: ApiWorkbenchHttpMethod
  readonly headers: readonly { readonly key: string; readonly value: string }[]
  readonly body?: string
  readonly timeoutMs?: number
}

function isBodyAllowed(method: ApiWorkbenchHttpMethod): boolean {
  return method !== 'GET' && method !== 'HEAD'
}

function getEnabledItems(items: readonly ApiWorkbenchKeyValue[]): readonly ApiWorkbenchKeyValue[] {
  return items.filter((item) => item.enabled && item.key.trim())
}

function appendQueryParam(url: URL, key: string, value: string): void {
  url.searchParams.append(key, value)
}

function appendApiKeyAuthToQuery(url: URL, auth: ApiWorkbenchAuth): void {
  if (auth.type !== 'api-key' || auth.target !== 'query' || !auth.key.trim()) {
    return
  }

  appendQueryParam(url, auth.key, auth.value)
}

function encodeBasicAuth(input: { readonly username: string; readonly password: string }): string {
  const value = `${input.username}:${input.password}`

  return btoa(value)
}

function applyAuthHeaders(headers: Headers, auth: ApiWorkbenchAuth): void {
  // Auth is normalized at the request-builder boundary so every send engine
  // receives the same final transport shape. Bearer/Basic become the standard
  // Authorization header, while API Key can target either header or query.
  if (auth.type === 'bearer' && auth.token.trim()) {
    headers.set('Authorization', `Bearer ${auth.token}`)
    return
  }

  if (auth.type === 'basic') {
    headers.set('Authorization', `Basic ${encodeBasicAuth(auth)}`)
    return
  }

  if (auth.type === 'api-key' && auth.target === 'header' && auth.key.trim()) {
    headers.set(auth.key, auth.value)
  }
}

function getRawContentType(language: ApiWorkbenchRawBodyLanguage): string {
  switch (language) {
    case 'json':
      return 'application/json'
    case 'xml':
      return 'application/xml'
    case 'html':
      return 'text/html'
    case 'text':
      return 'text/plain'
  }
}

function prepareBody(input: {
  readonly method: ApiWorkbenchHttpMethod
  readonly headers: Headers
  readonly body: ApiWorkbenchRequestBody
}): BodyInit | undefined {
  if (!isBodyAllowed(input.method) || input.body.mode === 'none') {
    return undefined
  }

  if (input.body.mode === 'raw') {
    if (!input.headers.has('Content-Type')) {
      input.headers.set('Content-Type', getRawContentType(input.body.language))
    }

    return input.body.raw
  }

  if (input.body.mode === 'form-data') {
    const formData = new FormData()

    getEnabledItems(input.body.items).forEach((item) => {
      formData.append(item.key, item.value)
    })

    return formData
  }

  const searchParams = new URLSearchParams()

  getEnabledItems(input.body.items).forEach((item) => {
    searchParams.append(item.key, item.value)
  })

  if (!input.headers.has('Content-Type')) {
    input.headers.set('Content-Type', 'application/x-www-form-urlencoded')
  }

  return searchParams
}

function createMultipartBody(items: readonly ApiWorkbenchKeyValue[]): {
  readonly contentType: string
  readonly body: string
} {
  const boundary = `api-workbench-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2)}`
  const body = getEnabledItems(items)
    .map(
      (item) =>
        `--${boundary}\r\nContent-Disposition: form-data; name="${item.key}"\r\n\r\n${item.value}\r\n`
    )
    .join('')

  return {
    contentType: `multipart/form-data; boundary=${boundary}`,
    body: `${body}--${boundary}--\r\n`
  }
}

function prepareNativeBody(input: {
  readonly method: ApiWorkbenchHttpMethod
  readonly headers: Headers
  readonly body: ApiWorkbenchRequestBody
}): string | undefined {
  if (!isBodyAllowed(input.method) || input.body.mode === 'none') {
    return undefined
  }

  if (input.body.mode === 'raw') {
    if (!input.headers.has('Content-Type')) {
      input.headers.set('Content-Type', getRawContentType(input.body.language))
    }

    return input.body.raw
  }

  if (input.body.mode === 'form-data') {
    const multipart = createMultipartBody(input.body.items)
    if (!input.headers.has('Content-Type')) {
      input.headers.set('Content-Type', multipart.contentType)
    }

    return multipart.body
  }

  const searchParams = new URLSearchParams()

  getEnabledItems(input.body.items).forEach((item) => {
    searchParams.append(item.key, item.value)
  })

  if (!input.headers.has('Content-Type')) {
    input.headers.set('Content-Type', 'application/x-www-form-urlencoded')
  }

  return searchParams.toString()
}

export function prepareApiWorkbenchRequest(request: ApiWorkbenchRequest): ApiWorkbenchPreparedRequest {
  let url: URL

  try {
    url = new URL(request.url)
  } catch (error: unknown) {
    throw new TypeError('Request URL must be a valid absolute URL.', { cause: error })
  }

  getEnabledItems(request.params).forEach((item) => {
    appendQueryParam(url, item.key, item.value)
  })
  // API-key auth can be configured as a query credential. It is appended after
  // normal params so users can see the exact final URL before send.
  appendApiKeyAuthToQuery(url, request.auth)

  const headers = new Headers()
  getEnabledItems(request.headers).forEach((item) => {
    headers.set(item.key, item.value)
  })
  applyAuthHeaders(headers, request.auth)

  return {
    url: url.toString(),
    method: request.method,
    headers,
    body: prepareBody({ method: request.method, headers, body: request.body })
  }
}

export function prepareApiWorkbenchNativeRequest(
  request: ApiWorkbenchRequest
): ApiWorkbenchNativePreparedRequest {
  let url: URL

  try {
    url = new URL(request.url)
  } catch (error: unknown) {
    throw new TypeError('Request URL must be a valid absolute URL.', { cause: error })
  }

  getEnabledItems(request.params).forEach((item) => {
    appendQueryParam(url, item.key, item.value)
  })
  appendApiKeyAuthToQuery(url, request.auth)

  const headers = new Headers()
  getEnabledItems(request.headers).forEach((item) => {
    headers.set(item.key, item.value)
  })
  applyAuthHeaders(headers, request.auth)

  const body = prepareNativeBody({ method: request.method, headers, body: request.body })

  return {
    url: url.toString(),
    method: request.method,
    headers: Array.from(headers.entries()).map(([key, value]) => ({ key, value })),
    body,
    timeoutMs: request.timeoutMs
  }
}
