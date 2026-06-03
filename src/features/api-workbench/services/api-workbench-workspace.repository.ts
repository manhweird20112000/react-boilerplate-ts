import type { ApiWorkbenchWorkspace } from '../types'

export abstract class ApiWorkbenchWorkspaceRepository {
  abstract load(): Promise<ApiWorkbenchWorkspace>
  abstract save(workspace: ApiWorkbenchWorkspace): Promise<void>
  abstract reset(): Promise<ApiWorkbenchWorkspace>
  abstract exportData(): Promise<string>
  abstract importData(serializedWorkspace: string): Promise<ApiWorkbenchWorkspace>
}

