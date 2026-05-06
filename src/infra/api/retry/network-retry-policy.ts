import type { AxiosError } from 'axios'

import type { RetryDecision, RetryOptions } from './retry.types'
import type { RetryPolicy } from './retry-policy'

const DEFAULT_MAX_ATTEMPTS = 3
const DEFAULT_BASE_DELAY_MS = 250
const DEFAULT_MAX_DELAY_MS = 3000
const DEFAULT_JITTER_RATIO = 0.2

function getClampedJitterRatio(jitterRatio: number): number {
  if (Number.isNaN(jitterRatio)) {
    return 0
  }
  if (jitterRatio <= 0) {
    return 0
  }
  if (jitterRatio >= 1) {
    return 1
  }
  return jitterRatio
}

function getAttemptDelayMs(input: {
  readonly attempt: number
  readonly baseDelayMs: number
  readonly maxDelayMs: number
}): number {
  const exponent: number = Math.max(0, input.attempt - 1)
  const rawDelayMs: number = input.baseDelayMs * Math.pow(2, exponent)
  return Math.min(rawDelayMs, input.maxDelayMs)
}

function getJitteredDelayMs(input: {
  readonly delayMs: number
  readonly jitterRatio: number
}): number {
  const jitterRatio: number = getClampedJitterRatio(input.jitterRatio)
  if (jitterRatio === 0) {
    return Math.max(0, Math.round(input.delayMs))
  }
  const jitterAmount: number = input.delayMs * jitterRatio
  const minDelayMs: number = input.delayMs - jitterAmount
  const maxDelayMs: number = input.delayMs + jitterAmount
  const randomized: number = minDelayMs + Math.random() * (maxDelayMs - minDelayMs)
  return Math.max(0, Math.round(randomized))
}

function isNetworkOrTimeoutError(err: unknown): err is AxiosError {
  if (!err || typeof err !== 'object') {
    return false
  }
  const maybeAxiosError: Partial<AxiosError> = err as Partial<AxiosError>
  return Boolean(maybeAxiosError.isAxiosError) && maybeAxiosError.response == null
}

export class NetworkRetryPolicy implements RetryPolicy {
  decide(input: {
    readonly attempt: number
    readonly err: unknown
    readonly options: RetryOptions
  }): RetryDecision {
    const maxAttempts: number = input.options.maxAttempts ?? DEFAULT_MAX_ATTEMPTS
    if (maxAttempts <= 1) {
      return { shouldRetry: false, delayMs: 0 }
    }
    if (!isNetworkOrTimeoutError(input.err)) {
      return { shouldRetry: false, delayMs: 0 }
    }
    if (input.attempt >= maxAttempts) {
      return { shouldRetry: false, delayMs: 0 }
    }
    const baseDelayMs: number = input.options.baseDelayMs ?? DEFAULT_BASE_DELAY_MS
    const maxDelayMs: number = input.options.maxDelayMs ?? DEFAULT_MAX_DELAY_MS
    const jitterRatio: number = input.options.jitterRatio ?? DEFAULT_JITTER_RATIO
    const delayMs: number = getAttemptDelayMs({ attempt: input.attempt, baseDelayMs, maxDelayMs })
    return { shouldRetry: true, delayMs: getJitteredDelayMs({ delayMs, jitterRatio }) }
  }
}
