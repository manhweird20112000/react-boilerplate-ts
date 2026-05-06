export type RetryOptions = {
  readonly maxAttempts?: number
  readonly baseDelayMs?: number
  readonly maxDelayMs?: number
  readonly jitterRatio?: number
}

export type RetryDecision = {
  readonly shouldRetry: boolean
  readonly delayMs: number
}
