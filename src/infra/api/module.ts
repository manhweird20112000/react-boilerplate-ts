import axios, { type AxiosError, type AxiosInstance, type AxiosResponse } from 'axios'

class HttpModule {
  private readonly instance: AxiosInstance

  constructor(baseURL: string, timeout: number = 50000) {
    this.instance = axios.create({
      baseURL,
      timeout
    })

    this.instance.interceptors.request.use(
      (config) => {
        return config
      },
      (error: AxiosError) => Promise.reject(error)
    )

    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // if (response?.data?.status_code !== 200) {
        //   Toast.error({ message: response?.data?.message })
        //   if (response?.data?.status_code === 404) {
        //     showError({ statusCode: 404 })
        //   } else if (response?.data?.status_code === 401) {
        //     StorageData.clearStorage()
        //     window.location.reload()
        //   }
        // }
        return response
      },
      (error: AxiosError) => {
        // Toast.error({ message: (error?.response?.data as any)?.message })
        return error.response
      }
    )
  }

  getInstance(): AxiosInstance {
    return this.instance
  }
}

export default HttpModule
