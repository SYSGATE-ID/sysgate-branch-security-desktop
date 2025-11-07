// hooks/useAxiosInstance.ts
import { useToast } from '@store/ToastContext'
import axios, { AxiosInstance, AxiosError, AxiosResponse } from 'axios'
import { useNavigate } from 'react-router-dom'

interface ErrorResponse {
  message?: string
  [key: string]: unknown
}

export const useAxiosInstance = (): AxiosInstance => {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const token = localStorage.getItem('token')

  const instance = axios.create({
    baseURL: '/api/v1',
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
        showToast('Akses Ditolak', 'Harap login terlebih dahulu.', 'error')
        navigate('/login')
      } else if (status === 403) {
        showToast('Akses Ditolak', 'Anda tidak memiliki izin untuk halaman ini.', 'error')
      } else if (status === 500) {
        showToast('Kesalahan Server', 'Terjadi kesalahan di server, coba lagi nanti.', 'error')
      } else if (!error.response) {
        showToast('Koneksi Gagal', 'Tidak dapat terhubung ke server.', 'error')
      }

      return Promise.reject(error)
    }
  )

  return instance
}
