export type ApiWorkbenchStorageErrorReason =
  | 'unavailable'
  | 'invalid-json'
  | 'invalid-schema'
  | 'write-failed'

export class ApiWorkbenchStorageError extends Error {
  public readonly reason: ApiWorkbenchStorageErrorReason
  public readonly cause?: unknown

  public constructor(input: {
    readonly reason: ApiWorkbenchStorageErrorReason
    readonly message: string
    readonly cause?: unknown
  }) {
    super(input.message)
    this.name = 'ApiWorkbenchStorageError'
    this.reason = input.reason
    this.cause = input.cause
  }
}

