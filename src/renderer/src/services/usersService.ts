import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { IUser, IPayloadUser, IPayloadUpdateUser } from '@interface/user.interface'
import type { AxiosError, AxiosResponse } from 'axios'
import { LoggerService } from './loggerService'

interface UsersService {
  getAllUsers: (params?: object) => Promise<IResponse<IUser[]>>
  getDetailUser: (id: string) => Promise<IResponse<IUser>>
  createUser: (data: IPayloadUser) => Promise<IResponse>
  updateUser: (id: string, data: IPayloadUpdateUser) => Promise<IResponse>
  deleteUser: (id: number) => Promise<IResponse>
}

const UsersService = (): UsersService => {
  const axiosInstance = useAxiosInstance()

  const getAllUsers = async (params?: object): Promise<IResponse<IUser[]>> => {
    try {
      const response: AxiosResponse<IResponse<IUser[]>> = await axiosInstance.get(`/user`, {
        params
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('UsersService.getAllUsers', 'Get all users failed', {
        request: '/user',
        params,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const getDetailUser = async (id: string): Promise<IResponse<IUser>> => {
    try {
      const response: AxiosResponse<IResponse<IUser>> = await axiosInstance.get(`/user/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('UsersService.getDetailUser', 'Get detail user failed', {
        request: `/user/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const createUser = async (data: IPayloadUser): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/auth/register`, data)
      try {
        await LoggerService.info('UsersService.createUser', 'Create user success', {
          request: `/auth/register`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('UsersService.createUser', 'Create user failed', {
        request: `/auth/register`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const updateUser = async (id: string, data: IPayloadUpdateUser): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/user/${id}`, data)
      try {
        await LoggerService.info('UsersService.updateUser', 'Update user success', {
          request: `/user/${id}`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('UsersService.updateUser', 'Update user failed', {
        request: `/user/${id}`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const deleteUser = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/user/${id}`)
      try {
        await LoggerService.info('UsersService.deleteUser', 'Delete user success', {
          request: `/user/${id}`,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('UsersService.deleteUser', 'Delete user failed', {
        request: `/user/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  return {
    getAllUsers,
    getDetailUser,
    createUser,
    updateUser,
    deleteUser
  }
}

export default UsersService
