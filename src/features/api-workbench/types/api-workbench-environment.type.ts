import type { ApiWorkbenchId } from './api-workbench-id.type'

export interface ApiWorkbenchVariable {
  readonly id: ApiWorkbenchId
  readonly key: string
  readonly value: string
  readonly enabled: boolean
  readonly secret: boolean
  readonly description?: string
}

export interface ApiWorkbenchEnvironment {
  readonly id: ApiWorkbenchId
  readonly name: string
  readonly variables: readonly ApiWorkbenchVariable[]
  readonly createdAt: string
  readonly updatedAt: string
}

export interface ApiWorkbenchVariableResolution {
  readonly values: Readonly<Record<string, string>>
  readonly missingVariables: readonly string[]
}

