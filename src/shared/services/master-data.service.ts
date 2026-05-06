import { HttpService } from '@/infra/api/http-service'
import type { Future } from '@/shared/types/common'

export type MasterDataResponse = Record<string, any>

export type MasterDataOptions = Record<string, object>

const MASTER_DATA_URL = '/master-data'

export abstract class MasterDataService {
  public abstract getMasterData(options?: MasterDataOptions): Future<MasterDataResponse>
}

export class HttpMasterDataService extends MasterDataService {
  public getMasterData(options: MasterDataOptions = {}): Future<MasterDataResponse> {
    const searchParams = new URLSearchParams()
    for (const [resource, params] of Object.entries(options)) {
      searchParams.set(`resources[${resource}]`, JSON.stringify(params))
    }

    const query = searchParams.toString()
    const url = query ? `${MASTER_DATA_URL}?${query}` : MASTER_DATA_URL

    return HttpService.get(url, undefined, {
      retry: { maxAttempts: 3 }
    }) as Future<MasterDataResponse>
  }
}
