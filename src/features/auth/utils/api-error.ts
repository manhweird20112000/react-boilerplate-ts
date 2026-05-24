import type { AxiosError } from 'axios'
import type { ApiEnvelope } from '../types/api.types'

export function getApiErrorMessage(error: unknown, fallback: string): string {
  const axiosError = error as AxiosError<ApiEnvelope<unknown>>
  const apiMessage = axiosError.response?.data?.errors?.[0]?.message
  if (apiMessage) {
    return apiMessage
  }
  return fallback
}
