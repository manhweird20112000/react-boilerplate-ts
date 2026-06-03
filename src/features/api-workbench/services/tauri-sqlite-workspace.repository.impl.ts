import { invoke } from '@tauri-apps/api/core'
import { z } from 'zod'

import { apiWorkbenchWorkspaceSchema } from '../schemas/api-workbench-workspace.schema'
import type { ApiWorkbenchWorkspace } from '../types'
import { createEmptyApiWorkbenchWorkspace } from '../utils/create-empty-workspace'
import { ApiWorkbenchStorageError } from './api-workbench-storage-error'
import { ApiWorkbenchWorkspaceRepository } from './api-workbench-workspace.repository'

const sqliteLoadResultSchema = z.object({
  workspace: z.string().nullable()
})

function parseWorkspace(serializedWorkspace: string): ApiWorkbenchWorkspace {
  let parsed: unknown

  try {
    parsed = JSON.parse(serializedWorkspace)
  } catch (error: unknown) {
    throw new ApiWorkbenchStorageError({
      reason: 'invalid-json',
      message: 'Stored API workbench SQLite data is not valid JSON.',
      cause: error
    })
  }

  try {
    return apiWorkbenchWorkspaceSchema.parse(parsed)
  } catch (error: unknown) {
    const message =
      error instanceof z.ZodError
        ? `Stored API workbench SQLite data is invalid: ${error.issues[0]?.message ?? 'schema mismatch'}.`
        : 'Stored API workbench SQLite data is invalid.'

    throw new ApiWorkbenchStorageError({
      reason: 'invalid-schema',
      message,
      cause: error
    })
  }
}

function toStorageError(error: unknown, message: string): ApiWorkbenchStorageError {
  if (error instanceof ApiWorkbenchStorageError) {
    return error
  }

  return new ApiWorkbenchStorageError({
    reason: 'write-failed',
    message,
    cause: error
  })
}

export class TauriSqliteWorkspaceRepository extends ApiWorkbenchWorkspaceRepository {
  public async load(): Promise<ApiWorkbenchWorkspace> {
    try {
      const result = sqliteLoadResultSchema.parse(
        await invoke<unknown>('api_workbench_sqlite_load')
      )

      if (!result.workspace) {
        const workspace = createEmptyApiWorkbenchWorkspace()
        await this.save(workspace)
        return workspace
      }

      return parseWorkspace(result.workspace)
    } catch (error: unknown) {
      throw toStorageError(error, 'Could not load API workbench data from SQLite.')
    }
  }

  public async save(workspace: ApiWorkbenchWorkspace): Promise<void> {
    try {
      const validWorkspace = apiWorkbenchWorkspaceSchema.parse(workspace)
      await invoke('api_workbench_sqlite_save', {
        workspace: JSON.stringify(validWorkspace)
      })
    } catch (error: unknown) {
      throw toStorageError(error, 'Could not save API workbench data to SQLite.')
    }
  }

  public async reset(): Promise<ApiWorkbenchWorkspace> {
    try {
      await invoke('api_workbench_sqlite_reset')
      const workspace = createEmptyApiWorkbenchWorkspace()
      await this.save(workspace)
      return workspace
    } catch (error: unknown) {
      throw toStorageError(error, 'Could not reset API workbench SQLite data.')
    }
  }

  public async exportData(): Promise<string> {
    return JSON.stringify(await this.load(), null, 2)
  }

  public async importData(serializedWorkspace: string): Promise<ApiWorkbenchWorkspace> {
    const workspace = parseWorkspace(serializedWorkspace)
    await this.save(workspace)
    return workspace
  }
}

