import { invoke } from '@tauri-apps/api/core'

import type { ApiWorkbenchRequest, ApiWorkbenchResponse } from '../types'
import { prepareApiWorkbenchNativeRequest } from '../utils/api-workbench-request-builder'
import { ApiWorkbenchSendEngine, type ApiWorkbenchSendOptions } from './api-workbench-send-engine'

type TauriNativeHttpHeader = {
  readonly key: string
  readonly value: string
}

type TauriNativeHttpRequest = {
  readonly url: string
  readonly method: string
  readonly headers: readonly TauriNativeHttpHeader[]
  readonly body?: string
  readonly timeout_ms?: number
}

type TauriNativeHttpResponse = {
  readonly status: number
  readonly status_text: string
  readonly headers: readonly TauriNativeHttpHeader[]
  readonly body: string
  readonly duration_ms: number
}

function nowIso(): string {
  return new Date().toISOString()
}

function getBodySizeBytes(body: string): number {
  return new TextEncoder().encode(body).byteLength
}

function getErrorMessage(error: unknown): string {
  if (typeof error === 'string' && error) {
    return error
  }

  if (error instanceof Error && error.message) {
    return error.message
  }

  return 'Request failed.'
}

function getNativeErrorType(
  message: string
): 'network' | 'timeout' | 'cancelled' | 'invalid-request' | 'unknown' {
  const normalizedMessage = message.toLowerCase()

  if (normalizedMessage.includes('invalid')) {
    return 'invalid-request'
  }

  if (normalizedMessage.includes('timeout') || normalizedMessage.includes('timed out')) {
    return 'timeout'
  }

  return 'network'
}

export class TauriNativeSendEngine extends ApiWorkbenchSendEngine {
  public async send(
    request: ApiWorkbenchRequest,
    options?: ApiWorkbenchSendOptions
  ): Promise<ApiWorkbenchResponse> {
    if (options?.signal?.aborted) {
      return {
        type: 'failure',
        url: request.url,
        method: request.method,
        errorType: 'cancelled',
        message: 'Request was cancelled.',
        receivedAt: nowIso()
      }
    }

    let nativeRequest: TauriNativeHttpRequest

    try {
      const preparedRequest = prepareApiWorkbenchNativeRequest(request)
      nativeRequest = {
        url: preparedRequest.url,
        method: preparedRequest.method,
        headers: preparedRequest.headers,
        body: preparedRequest.body,
        timeout_ms: preparedRequest.timeoutMs
      }
    } catch (error: unknown) {
      return {
        type: 'failure',
        url: request.url,
        method: request.method,
        errorType: 'invalid-request',
        message: getErrorMessage(error),
        receivedAt: nowIso()
      }
    }

    try {
      const response = await invoke<TauriNativeHttpResponse>('api_workbench_http_send', {
        request: nativeRequest
      })

      return {
        type: 'success',
        url: nativeRequest.url,
        method: request.method,
        status: response.status,
        statusText: response.status_text,
        headers: response.headers,
        body: response.body,
        bodySizeBytes: getBodySizeBytes(response.body),
        durationMs: response.duration_ms,
        receivedAt: nowIso()
      }
    } catch (error: unknown) {
      const message = getErrorMessage(error)

      return {
        type: 'failure',
        url: nativeRequest.url,
        method: request.method,
        errorType: getNativeErrorType(message),
        message,
        receivedAt: nowIso()
      }
    }
  }
}
