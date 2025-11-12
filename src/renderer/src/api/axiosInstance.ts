// hooks/useAxiosInstance.ts
import { useConfigStore } from '@renderer/store/configProvider'
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

interface ErrorResponse {
  message?: string
  [key: string]: unknown
}

export const useAxiosInstance = (): AxiosInstance => {
  const navigate = useNavigate()
  const { config } = useConfigStore.getState() // langsung akses tanpa hook
  const baseURL = config?.api_url || 'http://localhost/sysgate-branch'
  const token = localStorage.getItem('token')

  const instance = axios.create({
    baseURL: `${baseURL}/api/v1`,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    }
  })

  // Interceptor untuk handle error global
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError<ErrorResponse>) => {
      const status = error.response?.status

      if (status === 401) {
        localStorage.clear()
        toast('Akses Ditolak', {
          description: `Harap login terlebih dahulu.`
        })
        navigate('/login')
      } else if (status === 403) {
        toast('Akses Ditolak', {
          description: `Anda tidak memiliki izin untuk halaman ini.`
        })
      } else if (status === 500) {
        toast('Kesalahan Server', {
          description: `Terjadi kesalahan di server, coba lagi nanti.`
        })
      } else if (!error.response) {
        toast('Koneksi Gagal', {
          description: `Tidak dapat terhubung ke server.`
        })
      }

      return Promise.reject(error)
    }
  )

  return instance
}
