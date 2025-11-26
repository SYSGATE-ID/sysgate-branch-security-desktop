import { useState, ChangeEvent, FormEvent } from 'react'
// import { useNavigate } from 'react-router-dom'
import AuthService from '@services/authService'
import type { IPayloadLogin } from '@interface/auth.interface'
import type { IErrorResponse } from '@interface/response.interface'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { UseGlobalLayout } from '@renderer/components/core/hook/useGlobalLayout'
import { LoggerService } from '@renderer/services/loggerService'

interface UseIndexReturn {
  formLogin: IPayloadLogin
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleLogin: (e: FormEvent<HTMLFormElement>) => Promise<void>
  loading: { submit: boolean }
  errorFormLogin: Record<string, string>
}

export const useIndex = (): UseIndexReturn => {
  // const navigate = useNavigate()
  const authService = AuthService()
  const { licenseIs } = UseGlobalLayout()
  const [formLogin, setFormLogin] = useState<IPayloadLogin>({
    username: '',
    password: ''
  })

  const [errorFormLogin, setErrorFormLogin] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState<{ submit: boolean }>({ submit: false })

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormLogin((prev) => ({ ...prev, [name]: value }))
    setErrorFormLogin((prev) => ({ ...prev, [name]: '' }))
  }

  const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()

    if (!licenseIs) {
      toast.error('Akses ditolak!', {
        description: `License key tidak valid! Harap hubungi kami`
      })
      await LoggerService.error('License Key Tidak valid', 'Gagal login')
      setFormLogin({ username: '', password: '' })
      setLoading({ submit: false })
      return
    }

    const requiredFields: (keyof IPayloadLogin)[] = ['username', 'password']
    const newErrors: Record<string, string> = {}

    requiredFields.forEach((field) => {
      if (!formLogin[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`
      }
    })

    if (Object.keys(newErrors).length > 0) {
      setErrorFormLogin(newErrors)
      return
    }

    setLoading({ submit: true })

    try {
      const response = await authService.loginAuth(formLogin)
      if (response.status_code === 200) {
        localStorage.setItem('userLogin', JSON.stringify(response.data!.user))
        localStorage.setItem('token', response.data!.token)
        toast.success('Login Berhasil', {
          description: `Selamat datang ${response.data!.user.username}`
        })
        if (window.api && window.api.auth) {
          window.api.auth.loginSuccess()
        } else {
          // Fallback untuk development (browser)
          window.location.href = '/'
        }
      } else {
        toast.error('Login Gagal', {
          description: 'Username/Password yang Anda masukkan salah!'
        })
      }
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const message = axiosError.response?.data?.error || 'Terjadi kesalahan pada server!'
      toast.error('Login Gagal', {
        description: message as string
      })
    } finally {
      setFormLogin({ username: '', password: '' })
      setLoading({ submit: false })
    }
  }

  return {
    formLogin,
    handleChange,
    handleLogin,
    loading,
    errorFormLogin
  }
}
