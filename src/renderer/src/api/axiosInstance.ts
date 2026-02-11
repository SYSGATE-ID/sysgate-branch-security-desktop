/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConfigStore } from '@renderer/store/configProvider'
import { clearLocalStorageExcept } from '@renderer/utils/myFunctions'
import { LoggerService } from '@services/loggerService'
import axios from 'axios'
import { useNavigate, useLocation } from 'react-router-dom'
import { toast } from 'sonner'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const useAxiosInstance = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { config } = useConfigStore.getState() // langsung akses tanpa hook
  const baseURL = config?.api_url || 'http://localhost/3003'

  // Flag untuk mencegah multiple refresh token calls
  let isRefreshing = false
  let failedQueue: Array<{
    resolve: (value?: any) => void
    reject: (error?: any) => void
  }> = []

  const processQueue = (error: any = null): void => {
    failedQueue.forEach((prom) => {
      if (error) {
        prom.reject(error)
      } else {
        prom.resolve()
      }
    })
    failedQueue = []
  }

  const instance = axios.create({
    baseURL: `${baseURL}/api/v1`,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  })

  // Fungsi untuk mendapatkan informasi halaman saat ini
  const getCurrentPageInfo = (): {
    path: string
    fullPath: string
    route: string
    timestamp: string
  } => {
    return {
      path: location.pathname,
      fullPath: location.pathname + location.search,
      route: location.pathname.split('/').filter(Boolean).join(' → ') || 'Home',
      timestamp: new Date().toISOString()
    }
  }

  // Interceptor untuk request (logging)
  instance.interceptors.request.use(
    (config) => {
      // Skip logging untuk GET requests
      if (config.method?.toUpperCase() === 'GET') {
        return config
      }

      const pageInfo = getCurrentPageInfo()

      // Log request hanya untuk non-GET methods
      LoggerService.debug(
        'AxiosInstance.Request',
        `Making ${config.method?.toUpperCase()} request to ${config.url}`,
        {
          request: {
            url: config.url,
            method: config.method?.toUpperCase(),
            headers: config.headers,
            baseURL: config.baseURL
          },
          params: config.params,
          payload: config.data,
          meta: {
            page: pageInfo
          }
        }
      )
      return config
    },
    (error) => {
      const pageInfo = getCurrentPageInfo()

      LoggerService.error('AxiosInstance.Request', 'Request interceptor error', {
        error: error.message,
        meta: {
          page: pageInfo
        }
      })
      return Promise.reject(error)
    }
  )

  // Interceptor untuk handle response dan error global
  instance.interceptors.response.use(
    (response) => {
      const pageInfo = getCurrentPageInfo()
      const method = response.config.method?.toUpperCase()

      // Skip logging untuk successful GET responses
      if (method === 'GET') {
        return response
      }

      // Log successful responses hanya untuk non-GET methods
      LoggerService.info('AxiosInstance.Response', `Success ${method} ${response.config.url}`, {
        request: {
          url: response.config.url,
          method: method
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          data: response.data
        },
        meta: {
          page: pageInfo
        }
      })
      return response
    },
    async (error) => {
      const originalRequest = error.config
      const status = error.response?.status
      const url = error.config?.url
      const method = error.config?.method?.toUpperCase()
      const pageInfo = getCurrentPageInfo()

      // Handle 401 - Unauthorized
      if (status === 401 && !originalRequest._retry) {
        // Jika sedang proses refresh, masukkan request ke queue
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject })
          })
            .then(() => {
              return instance(originalRequest)
            })
            .catch((err) => {
              return Promise.reject(err)
            })
        }

        originalRequest._retry = true
        isRefreshing = true

        LoggerService.info('AxiosInstance.Auth', 'Attempting to refresh token', {
          request: {
            url: originalRequest.url,
            method: originalRequest.method
          },
          params: originalRequest.params
        })

        try {
          // Refresh token
          const refreshResponse = await axios.post(
            `${baseURL}/api/v1/auth/refresh`,
            {},
            { withCredentials: true }
          )

          const newToken = refreshResponse.data?.data?.token

          if (newToken) {
            localStorage.setItem('token', newToken)

            LoggerService.info('AxiosInstance.Auth', 'Token refreshed successfully', {
              meta: {
                page: pageInfo
              }
            })

            // Process queued requests
            processQueue()
            isRefreshing = false

            // Retry original request
            return instance(originalRequest)
          } else {
            throw new Error('No token received from refresh endpoint')
          }
        } catch (refreshError) {
          // Refresh token gagal
          processQueue(refreshError)
          isRefreshing = false

          LoggerService.error('AxiosInstance.Auth', 'Token refresh failed - redirecting to login', {
            error: refreshError instanceof Error ? refreshError.message : 'Unknown error',
            // actions: "Clearing storage and redirecting",
            meta: {
              page: pageInfo,
              previousPage: location.pathname
            }
          })

          clearLocalStorageExcept(['localConfig'])
          toast.warning('Akses Ditolak', {
            description: `Harap login terlebih dahulu.`
          })
          navigate('/login')

          return Promise.reject(refreshError)
        }
      }

      // Skip logging untuk GET errors (kecuali error penting)
      if (method === 'GET') {
        if (status === 401 || !error.response) {
          LoggerService.error(
            'AxiosInstance.Response',
            `Error ${method} ${url} - Status: ${status || 'No Response'}`,
            {
              request: {
                url: error.config?.url,
                method: method,
                baseURL: error.config?.baseURL
              },
              response: error.response
                ? {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                  }
                : undefined,
              error: {
                message: error.message,
                code: error.code
              },
              meta: {
                page: pageInfo,
                userAction: getCurrentUserAction(location.pathname, method, url)
              }
            }
          )
        }
        return Promise.reject(error)
      }

      // Log error details untuk non-GET methods
      LoggerService.error(
        'AxiosInstance.Response',
        `Error ${method} ${url} - Status: ${status || 'No Response'}`,
        {
          request: {
            url: error.config?.url,
            method: method,
            baseURL: error.config?.baseURL
          },
          response: error.response
            ? {
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
              }
            : undefined,
          error: {
            message: error.message,
            code: error.code
          },
          meta: {
            page: pageInfo,
            userAction: getCurrentUserAction(location.pathname, method, url)
          }
        }
      )

      // Handle different error statuses (selain 401 yang sudah dihandle di atas)
      if (status === 403) {
        LoggerService.warn('AxiosInstance.Auth', 'Forbidden access - user lacks permission', {
          url: error.config?.url,
          method: method,
          meta: {
            page: pageInfo,
            attemptedAction: getActionDescription(method, url)
          }
        })
        toast.warning('Akses Ditolak', {
          description: `'Anda tidak memiliki izin untuk halaman ini.`
        })
      } else if (status === 500) {
        LoggerService.error('AxiosInstance.Server', 'Internal server error', {
          url: error.config?.url,
          response: error.response?.data,
          meta: {
            page: pageInfo
          }
        })
        toast.warning('Kesalahan Server', {
          description: `Terjadi kesalahan di server, coba lagi nanti.`
        })
      } else if (!error.response) {
        LoggerService.error('AxiosInstance.Network', 'Network error - no response from server', {
          url: error.config?.url,
          error: error.message,
          meta: {
            page: pageInfo
          }
        })
        toast.warning('Koneksi Gagal', {
          description: `Tidak dapat terhubung ke server, periksa koneksi Anda.`
        })
      } else {
        // Log other HTTP errors untuk non-GET methods
        LoggerService.warn('AxiosInstance.HTTP', `HTTP Error ${status} for ${method} ${url}`, {
          request: {
            url: error.config?.url,
            method: method
          },
          response: error.response
            ? {
                status: error.response.status,
                data: error.response.data
              }
            : undefined,
          meta: {
            page: pageInfo
          }
        })
      }

      return Promise.reject(error)
    }
  )

  return instance
}

// Helper function untuk mendeskripsikan aksi user
const getCurrentUserAction = (currentPath: string, method?: string, url?: string): string => {
  const pathSegments = currentPath.split('/').filter(Boolean)
  const currentSection = pathSegments[0] || 'dashboard'

  let action = `Mengakses halaman ${currentSection}`

  if (method && url) {
    const apiAction = getActionDescription(method, url)
    action += ` → ${apiAction}`
  }

  return action
}

// Helper function untuk mendeskripsikan aksi API
const getActionDescription = (method: string, url: string): string => {
  const urlParts = url.split('/').filter(Boolean)
  const resource = urlParts[urlParts.length - 1] || urlParts[urlParts.length - 2] || 'data'

  switch (method) {
    case 'GET':
      return `Mengambil data ${resource}`
    case 'POST':
      return `Membuat ${resource} baru`
    case 'PUT':
    case 'PATCH':
      return `Memperbarui ${resource}`
    case 'DELETE':
      return `Menghapus ${resource}`
    default:
      return `Melakukan aksi ${method} pada ${resource}`
  }
}
