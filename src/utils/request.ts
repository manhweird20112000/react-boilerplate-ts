import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { getStorage } from './storage'

export const baseApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL,
    timeout: 3000,
    headers: {
      Authorization: `Bearer ${getStorage('access_token') ?? ''}`
    }
  }),
  endpoints: () => ({})
})
