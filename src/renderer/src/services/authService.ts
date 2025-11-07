import type {
  IPayloadLogin,
  IResponseLogin,
  PayloadChangePassword,
  IResponseTokenValidation
} from '@interface/auth.interface'
import type { IResponse } from '@interface/response.interface'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
const apiUrl = "http://192.168.2.45:3000/api"

interface AuthService {
  loginAuth: (data: IPayloadLogin) => Promise<IResponse<IResponseLogin>>
  changePassword: (data: PayloadChangePassword) => Promise<IResponse>
  validateToken: (token: string) => Promise<IResponseTokenValidation>
  logout: () => void
}

const AuthService = (): AuthService => {
  const navigate = useNavigate()

  const userLogin = localStorage.getItem('userLogin')
  const userData = userLogin ? JSON.parse(userLogin) : null

  const loginAuth = async (data: IPayloadLogin): Promise<IResponse<IResponseLogin>> => {
    try {
      const response = await axios.post<IResponse<IResponseLogin>>(`${apiUrl}/v1/auth/login`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const changePassword = async (data: PayloadChangePassword): Promise<IResponse> => {
    try {
      const response = await axios.post<IResponse>(`${apiUrl}/auth/change-password`, data, {
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
      const response = await axios.get<IResponseTokenValidation>(`${apiUrl}/auth/verify-token`, {
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

  const logout = (): void => {
    // ✅ Hapus localStorage
    localStorage.removeItem('userLogin')
    navigate('/cmsadmin/login')
  }

  return {
    loginAuth,
    logout,
    validateToken,
    changePassword
  }
}

export default AuthService
