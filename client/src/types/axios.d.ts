import 'axios'

declare module 'axios' {
  interface AxiosRequestConfig {
    feedback?: {
      success?: boolean
      error?: boolean
    }
  }
}
