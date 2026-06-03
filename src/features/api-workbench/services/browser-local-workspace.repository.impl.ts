import { z } from 'zod'

import { API_WORKBENCH_STORAGE_KEY } from '../constants/api-workbench-storage'
import { apiWorkbenchWorkspaceSchema } from '../schemas/api-workbench-workspace.schema'
import type { ApiWorkbenchWorkspace } from '../types'
import { createEmptyApiWorkbenchWorkspace } from '../utils/create-empty-workspace'
import { ApiWorkbenchStorageError } from './api-workbench-storage-error'
import { ApiWorkbenchWorkspaceRepository } from './api-workbench-workspace.repository'

type ApiWorkbenchStorage = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function parseWorkspace(serializedWorkspace: string): ApiWorkbenchWorkspace {
  let parsed: unknown

  try {
    parsed = JSON.parse(serializedWorkspace)
  } catch (error: unknown) {
    throw new ApiWorkbenchStorageError({
      reason: 'invalid-json',
      message: 'Stored API workbench data is not valid JSON.',
      cause: error
    })
  }

  try {
    return apiWorkbenchWorkspaceSchema.parse(parsed)
  } catch (error: unknown) {
    const message =
      error instanceof z.ZodError
        ? `Stored API workbench data is invalid: ${error.issues[0]?.message ?? 'schema mismatch'}.`
        : 'Stored API workbench data is invalid.'

    throw new ApiWorkbenchStorageError({
      reason: 'invalid-schema',
      message,
      cause: error
    })
  }
}

function getDefaultStorage(): ApiWorkbenchStorage {
  if (typeof localStorage === 'undefined') {
    throw new ApiWorkbenchStorageError({
      reason: 'unavailable',
      message: 'localStorage is not available in this environment.'
    })
  }

  return localStorage
}

export class BrowserLocalWorkspaceRepository extends ApiWorkbenchWorkspaceRepository {
  private readonly storage: ApiWorkbenchStorage
  private readonly storageKey: string

  public constructor(input?: {
    readonly storage?: ApiWorkbenchStorage
    readonly storageKey?: string
  }) {
    super()
    this.storage = input?.storage ?? getDefaultStorage()
    this.storageKey = input?.storageKey ?? API_WORKBENCH_STORAGE_KEY
  }

  public async load(): Promise<ApiWorkbenchWorkspace> {
    const storedWorkspace = this.storage.getItem(this.storageKey)

    if (!storedWorkspace) {
      const workspace = createEmptyApiWorkbenchWorkspace()
      await this.save(workspace)
      return workspace
    }

    return parseWorkspace(storedWorkspace)
  }

  public async save(workspace: ApiWorkbenchWorkspace): Promise<void> {
    const validWorkspace = apiWorkbenchWorkspaceSchema.parse(workspace)

    try {
      this.storage.setItem(this.storageKey, JSON.stringify(validWorkspace))
    } catch (error: unknown) {
      throw new ApiWorkbenchStorageError({
        reason: 'write-failed',
        message: 'Could not save API workbench data locally.',
        cause: error
      })
    }
  }

  public async reset(): Promise<ApiWorkbenchWorkspace> {
    const workspace = createEmptyApiWorkbenchWorkspace()
    await this.save(workspace)
    return workspace
  }

  public async exportData(): Promise<string> {
    return JSON.stringify(await this.load(), null, 2)
  }

  public async importData(serializedWorkspace: string): Promise<ApiWorkbenchWorkspace> {
    const workspace = parseWorkspace(serializedWorkspace)
    await this.save(workspace)
    return workspace
  }

  public async clear(): Promise<void> {
    this.storage.removeItem(this.storageKey)
  }
}

