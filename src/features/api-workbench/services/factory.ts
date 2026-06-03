import { BrowserLocalWorkspaceRepository } from './browser-local-workspace.repository.impl'
import { BrowserFetchSendEngine } from './browser-fetch-send-engine.impl'
import { TauriNativeSendEngine } from './tauri-native-send-engine.impl'
import { TauriSqliteWorkspaceRepository } from './tauri-sqlite-workspace.repository.impl'
import type { ApiWorkbenchWorkspaceRepository } from './api-workbench-workspace.repository'
import type { ApiWorkbenchSendEngine } from './api-workbench-send-engine'

function isTauriRuntime(): boolean {
  return Boolean('__TAURI_INTERNALS__' in window)
}

export function createApiWorkbenchWorkspaceRepository(): ApiWorkbenchWorkspaceRepository {
  if (isTauriRuntime()) {
    return new TauriSqliteWorkspaceRepository()
  }

  return new BrowserLocalWorkspaceRepository()
}

export function createApiWorkbenchSendEngine(): ApiWorkbenchSendEngine {
  if (isTauriRuntime()) {
    return new TauriNativeSendEngine()
  }

  return new BrowserFetchSendEngine()
}

export const apiWorkbenchWorkspaceRepository = createApiWorkbenchWorkspaceRepository()
export const apiWorkbenchSendEngine = createApiWorkbenchSendEngine()
