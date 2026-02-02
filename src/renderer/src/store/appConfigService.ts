import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import { IAppConfig, IPayloadAppConfig } from '@renderer/interface/appConfig.interface'
import type { AxiosResponse } from 'axios'

interface AppConfigService {
  getAllAppConfig: (params?: object) => Promise<IResponse<IAppConfig[]>>
  getDetailAppConfig: (id: string) => Promise<IResponse<IAppConfig>>
  createAppConfig: (data: IPayloadAppConfig) => Promise<IResponse>
  updateAppConfig: (id: string, data: IPayloadAppConfig) => Promise<IResponse>
  deleteAppConfig: (id: number) => Promise<IResponse>
}

const AppConfigService = (): AppConfigService => {
  const axiosInstance = useAxiosInstance()

  const getAllAppConfig = async (params?: object): Promise<IResponse<IAppConfig[]>> => {
    try {
      const response: AxiosResponse<IResponse<IAppConfig[]>> = await axiosInstance.get(
        `/app-config`,
        { params }
      )
      localStorage.setItem('appConfig', JSON.stringify(response.data.data))

      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailAppConfig = async (id: string): Promise<IResponse<IAppConfig>> => {
    try {
      const response: AxiosResponse<IResponse<IAppConfig>> = await axiosInstance.get(
        `/app-config/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const createAppConfig = async (data: IPayloadAppConfig): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/app-config`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateAppConfig = async (id: string, data: IPayloadAppConfig): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/app-config/${id}`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteAppConfig = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/app-config/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllAppConfig,
    getDetailAppConfig,
    createAppConfig,
    updateAppConfig,
    deleteAppConfig
  }
}

export default AppConfigService
