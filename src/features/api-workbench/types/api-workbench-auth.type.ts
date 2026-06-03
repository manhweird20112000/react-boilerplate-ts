export type ApiWorkbenchAuthType = 'none' | 'bearer' | 'basic' | 'api-key'

export type ApiWorkbenchAuth =
  | {
      readonly type: 'none'
    }
  | {
      readonly type: 'bearer'
      readonly token: string
    }
  | {
      readonly type: 'basic'
      readonly username: string
      readonly password: string
    }
  | {
      readonly type: 'api-key'
      readonly key: string
      readonly value: string
      readonly target: 'header' | 'query'
    }

