import { describe, it, expect } from 'vitest'
import type { AxiosError } from 'axios'
import { NetworkRetryPolicy } from './network-retry-policy'

describe('NetworkRetryPolicy', () => {
  const policy = new NetworkRetryPolicy()

  it('should not retry if maxAttempts is 0', () => {
    const err = { isAxiosError: true, response: null } as unknown as AxiosError
    const decision = policy.decide({
      attempt: 1,
      err,
      options: { maxAttempts: 0 }
    })
    expect(decision.shouldRetry).toBe(false)
  })

  it('should not retry if maxAttempts is 1', () => {
    const err = { isAxiosError: true, response: null } as unknown as AxiosError
    const decision = policy.decide({
      attempt: 1,
      err,
      options: { maxAttempts: 1 }
    })
    expect(decision.shouldRetry).toBe(false)
  })

  it('should retry if attempt is less than maxAttempts and it is a network error', () => {
    const err = { isAxiosError: true, response: null } as unknown as AxiosError
    const decision = policy.decide({
      attempt: 1,
      err,
      options: { maxAttempts: 3 }
    })
    expect(decision.shouldRetry).toBe(true)
    expect(decision.delayMs).toBeGreaterThanOrEqual(0)
  })

  it('should not retry if it is not an axios error', () => {
    const err = new Error('Regular error')
    const decision = policy.decide({
      attempt: 1,
      err,
      options: { maxAttempts: 3 }
    })
    expect(decision.shouldRetry).toBe(false)
  })

  it('should not retry if it is an axios error with a response', () => {
    const err = { isAxiosError: true, response: { status: 500 } } as unknown as AxiosError
    const decision = policy.decide({
      attempt: 1,
      err,
      options: { maxAttempts: 3 }
    })
    expect(decision.shouldRetry).toBe(false)
  })

  it('should stop retrying when attempt reaches maxAttempts', () => {
    const err = { isAxiosError: true, response: null } as unknown as AxiosError
    const decision = policy.decide({
      attempt: 3,
      err,
      options: { maxAttempts: 3 }
    })
    expect(decision.shouldRetry).toBe(false)
  })

  it('should calculate exponential backoff delay correctly', () => {
    const err = { isAxiosError: true, response: null } as unknown as AxiosError
    
    // Attempt 1: 250ms (baseDelayMs * 2^(1-1) = 250 * 1)
    const decision1 = policy.decide({
      attempt: 1,
      err,
      options: { maxAttempts: 5, baseDelayMs: 250, jitterRatio: 0 }
    })
    expect(decision1.delayMs).toBe(250)

    // Attempt 2: 500ms (250 * 2^(2-1) = 250 * 2)
    const decision2 = policy.decide({
      attempt: 2,
      err,
      options: { maxAttempts: 5, baseDelayMs: 250, jitterRatio: 0 }
    })
    expect(decision2.delayMs).toBe(500)

    // Attempt 3: 1000ms (250 * 2^(3-1) = 250 * 4)
    const decision3 = policy.decide({
      attempt: 3,
      err,
      options: { maxAttempts: 5, baseDelayMs: 250, jitterRatio: 0 }
    })
    expect(decision3.delayMs).toBe(1000)
  })

  it('should clamp delay to maxDelayMs', () => {
    const err = { isAxiosError: true, response: null } as unknown as AxiosError
    const decision = policy.decide({
      attempt: 10,
      err,
      options: { maxAttempts: 20, baseDelayMs: 1000, maxDelayMs: 3000, jitterRatio: 0 }
    })
    expect(decision.delayMs).toBe(3000)
  })
})
