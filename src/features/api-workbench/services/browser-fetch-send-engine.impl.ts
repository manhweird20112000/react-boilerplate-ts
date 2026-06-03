import type { ApiWorkbenchRequest, ApiWorkbenchResponse } from '../types'
import { prepareApiWorkbenchRequest } from '../utils/api-workbench-request-builder'
import { ApiWorkbenchSendEngine, type ApiWorkbenchSendOptions } from './api-workbench-send-engine'

function nowIso(): string {
  return new Date().toISOString()
}

function getDurationMs(startedAt: number): number {
  return Math.max(0, Math.round(performance.now() - startedAt))
}

function getBodySizeBytes(body: string): number {
  return new TextEncoder().encode(body).byteLength
}

function toResponseHeaders(headers: Headers): readonly { key: string; value: string }[] {
  return Array.from(headers.entries()).map(([key, value]) => ({ key, value }))
}

function getErrorType(
  error: unknown
): 'network' | 'timeout' | 'cancelled' | 'invalid-request' | 'unknown' {
  if (error instanceof TypeError) {
    return 'invalid-request'
  }

  if (error instanceof DOMException && error.name === 'AbortError') {
    return 'cancelled'
  }

  return 'network'
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Request failed.'
}

function createTimeoutController(input: {
  readonly timeoutMs: number | undefined
  readonly externalSignal: AbortSignal | undefined
}): { readonly signal?: AbortSignal; readonly cleanup: () => void } {
  if (!input.timeoutMs && !input.externalSignal) {
    return { cleanup: () => undefined }
  }

  const controller = new AbortController()
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  const abortFromExternalSignal = () => controller.abort()

  if (input.externalSignal) {
    if (input.externalSignal.aborted) {
      controller.abort()
    } else {
      input.externalSignal.addEventListener('abort', abortFromExternalSignal, { once: true })
    }
  }

  if (input.timeoutMs) {
    timeoutId = setTimeout(() => {
      controller.abort(new DOMException('Request timed out.', 'TimeoutError'))
    }, input.timeoutMs)
  }

  return {
    signal: controller.signal,
    cleanup: () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      input.externalSignal?.removeEventListener('abort', abortFromExternalSignal)
    }
  }
}

export class BrowserFetchSendEngine extends ApiWorkbenchSendEngine {
  public async send(
    request: ApiWorkbenchRequest,
    options?: ApiWorkbenchSendOptions
  ): Promise<ApiWorkbenchResponse> {
    const startedAt = performance.now()
    let preparedRequest: ReturnType<typeof prepareApiWorkbenchRequest>

    try {
      preparedRequest = prepareApiWorkbenchRequest(request)
    } catch (error: unknown) {
      return {
        type: 'failure',
        url: request.url,
        method: request.method,
        errorType: 'invalid-request',
        message: getErrorMessage(error),
        durationMs: getDurationMs(startedAt),
        receivedAt: nowIso()
      }
    }

    const timeout = createTimeoutController({
      timeoutMs: request.timeoutMs,
      externalSignal: options?.signal
    })

    try {
      const response = await fetch(preparedRequest.url, {
        method: preparedRequest.method,
        headers: preparedRequest.headers,
        body: preparedRequest.body,
        signal: timeout.signal
      })
      const body = await response.text()

      return {
        type: 'success',
        url: preparedRequest.url,
        method: request.method,
        status: response.status,
        statusText: response.statusText,
        headers: toResponseHeaders(response.headers),
        body,
        bodySizeBytes: getBodySizeBytes(body),
        durationMs: getDurationMs(startedAt),
        receivedAt: nowIso()
      }
    } catch (error: unknown) {
      const timeoutReason = timeout.signal?.reason
      const isTimeout =
        timeoutReason instanceof DOMException && timeoutReason.name === 'TimeoutError'

      return {
        type: 'failure',
        url: preparedRequest.url,
        method: request.method,
        errorType: isTimeout ? 'timeout' : getErrorType(error),
        message: isTimeout ? 'Request timed out.' : getErrorMessage(error),
        durationMs: getDurationMs(startedAt),
        receivedAt: nowIso()
      }
    } finally {
      timeout.cleanup()
    }
  }
}
