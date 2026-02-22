import { useAxiosInstance } from '@api/axiosInstance'
import type {
  IPayloadLogin,
  IResponseLogin,
  PayloadChangePassword,
  IResponseTokenValidation
} from '@interface/auth.interface'
import type { IResponse } from '@interface/response.interface'
import { useNavigate } from 'react-router-dom'
import { LoggerService } from './loggerService'
import axios from 'axios'
import { useConfigStore } from '@renderer/store/configProvider'

interface AuthService {
  loginAuth: (data: IPayloadLogin) => Promise<IResponse<IResponseLogin>>
  changePassword: (data: PayloadChangePassword) => Promise<IResponse>
  validateToken: (token: string) => Promise<IResponseTokenValidation>
  logout: () => void
}

const AuthService = (): AuthService => {
  const { config } = useConfigStore.getState() // langsung akses tanpa hook
  const baseURL = config?.api_url || 'http://localhost/3003'
  const axiosInstance = useAxiosInstance()
  const navigate = useNavigate()

  const userLogin = localStorage.getItem('userLogin')
  const userData = userLogin ? JSON.parse(userLogin) : null

  const loginAuth = async (data: IPayloadLogin): Promise<IResponse<IResponseLogin>> => {
    try {
      const response = await axios.post<IResponse<IResponseLogin>>(
        `${baseURL}/api/v1/auth/login`,
        data,
        { withCredentials: true }
      )
      return response.data
    } catch (error) {
      console.log('Login Gagal', `Error saat login: `, error)
      console.error(error)
      throw error
    }
  }

  const changePassword = async (data: PayloadChangePassword): Promise<IResponse> => {
    try {
      const response = await axiosInstance.post<IResponse>(`/auth/change-password`, data, {
        headers: {
          authorization: `Bearer ${userData?.token}`
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const validateToken = async (token: string): Promise<IResponseTokenValidation> => {
    try {
      const response = await axiosInstance.get<IResponseTokenValidation>(`/auth/verify-token`, {
        headers: {
          authorization: `Bearer ${token}`
        }
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const logout = async (): Promise<void> => {
    localStorage.removeItem('userLogin')
    navigate('/cmsadmin/login')
    await LoggerService.info('Logout Berhasil', 'user melakukan logout')
  }

  return {
    loginAuth,
    logout,
    validateToken,
    changePassword
  }
}

export default AuthService
