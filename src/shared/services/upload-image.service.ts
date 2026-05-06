import { HttpService } from '@/infra/api/http-service'
import type { Future } from '@/shared/types/common'

export type UploadImageResponse = {
  readonly url: string
  readonly thumb: string
  readonly type: string
  readonly id: number
}

export type UploadImageOptions = {
  readonly type?: string
  readonly onProgress?: (percent: number) => void
}

const UPLOAD_IMAGE_URL = '/upload-image'

export abstract class UploadImageService {
  public abstract uploadImage(file: File, options?: UploadImageOptions): Future<UploadImageResponse>
}

export class HttpUploadImageService extends UploadImageService {
  public uploadImage(file: File, options?: UploadImageOptions): Future<UploadImageResponse> {
    const form: FormData = new FormData()
    form.append('image', file)

    if (options?.type) {
      form.append('type', options.type)
    }

    return HttpService.post<FormData>(UPLOAD_IMAGE_URL, form, {
      onUploadProgress: (progressEvent) => {
        if (options?.onProgress && progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          options.onProgress(percent)
        }
      }
    }) as Future<UploadImageResponse>
  }
}

export const uploadImageService: UploadImageService = new HttpUploadImageService()
