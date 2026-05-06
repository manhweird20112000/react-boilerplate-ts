import type { RetryDecision, RetryOptions } from './retry.types'

export interface RetryPolicy {
  decide(input: {
    readonly attempt: number
    readonly err: unknown
    readonly options: RetryOptions
  }): RetryDecision
}
