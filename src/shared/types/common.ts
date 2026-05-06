import type { AxiosResponse } from 'axios'

export type FormErrors = Record<string, readonly string[]>

export type Future<T> = Promise<AxiosResponse<ResponseData<T>>>

export interface ResponseData<T> {
  success: boolean
  message: string
  errors?: FormErrors
  data: T
}

export type PaginationMeta = {
  readonly current_page: number
  readonly total_page: number
  readonly per_page: number
  readonly total: number
}

export type PaginatedData<T> = {
  readonly data: readonly T[]
} & PaginationMeta
