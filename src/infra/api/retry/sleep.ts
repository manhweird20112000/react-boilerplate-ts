/**
 * Sleep helper used by retry policies.
 */
export async function sleep(delayMs: number): Promise<void> {
  const safeDelayMs: number = Math.max(0, Math.round(delayMs))
  await new Promise<void>((resolve) => {
    setTimeout(resolve, safeDelayMs)
  })
}
