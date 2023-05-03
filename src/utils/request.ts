import axios, { type AxiosResponse } from "axios"

import { getStorage } from "./storage"

export const service = axios.create({
  baseURL: process.env.API_URL,
  timeout: 30000,
  headers: {
    Authorization: `Bearer ${getStorage('access_token') ?? ''}`
  }
})

service.interceptors.request.use(
  (request) => {
    return request
  },
  (error) => {
    return error
  }
)

service.interceptors.response.use(
  async (response : AxiosResponse) => {
    return await Promise.resolve(response)
  },
  async (error) => {
    return await Promise.reject(error)
  }
)
