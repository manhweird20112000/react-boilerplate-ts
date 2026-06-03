import { beforeEach, describe, expect, it } from 'vitest'

import { API_WORKBENCH_STORAGE_KEY } from '../constants/api-workbench-storage'
import type { ApiWorkbenchWorkspace } from '../types'
import { createEmptyApiWorkbenchWorkspace } from '../utils/create-empty-workspace'
import { ApiWorkbenchStorageError } from './api-workbench-storage-error'
import { BrowserLocalWorkspaceRepository } from './browser-local-workspace.repository.impl'

describe('BrowserLocalWorkspaceRepository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('creates and persists an empty workspace when no data exists', async () => {
    const repository = new BrowserLocalWorkspaceRepository()

    const workspace = await repository.load()

    expect(workspace.name).toBe('Local Workspace')
    expect(workspace.schemaVersion).toBe(1)
    expect(workspace.collections).toEqual([])
    expect(localStorage.getItem(API_WORKBENCH_STORAGE_KEY)).not.toBeNull()
  })

  it('saves and loads a valid workspace', async () => {
    const repository = new BrowserLocalWorkspaceRepository()
    const workspace: ApiWorkbenchWorkspace = {
      ...createEmptyApiWorkbenchWorkspace({ name: 'Saved Workspace', now: '2026-06-03T00:00:00.000Z' }),
      settings: {
        historyLimit: 25,
        defaultTimeoutMs: 5000
      }
    }

    await repository.save(workspace)

    await expect(repository.load()).resolves.toEqual(workspace)
  })

  it('exports formatted workspace JSON', async () => {
    const repository = new BrowserLocalWorkspaceRepository()
    await repository.save(createEmptyApiWorkbenchWorkspace({ name: 'Exported' }))

    const exported = await repository.exportData()
    const parsed = JSON.parse(exported) as ApiWorkbenchWorkspace

    expect(exported).toContain('\n')
    expect(parsed.name).toBe('Exported')
  })

  it('imports a valid workspace JSON', async () => {
    const repository = new BrowserLocalWorkspaceRepository()
    const workspace = createEmptyApiWorkbenchWorkspace({ name: 'Imported' })

    const imported = await repository.importData(JSON.stringify(workspace))

    expect(imported).toEqual(workspace)
    await expect(repository.load()).resolves.toEqual(workspace)
  })

  it('throws a storage error for invalid JSON', async () => {
    const repository = new BrowserLocalWorkspaceRepository()

    await expect(repository.importData('{bad json')).rejects.toMatchObject({
      name: 'ApiWorkbenchStorageError',
      reason: 'invalid-json'
    })
  })

  it('throws a storage error for invalid schema', async () => {
    const repository = new BrowserLocalWorkspaceRepository()

    await expect(repository.importData(JSON.stringify({ schemaVersion: 2 }))).rejects.toBeInstanceOf(
      ApiWorkbenchStorageError
    )
  })

  it('resets local data to a new empty workspace', async () => {
    const repository = new BrowserLocalWorkspaceRepository()
    await repository.save(createEmptyApiWorkbenchWorkspace({ name: 'Before reset' }))

    const resetWorkspace = await repository.reset()

    expect(resetWorkspace.name).toBe('Local Workspace')
    await expect(repository.load()).resolves.toEqual(resetWorkspace)
  })
})

