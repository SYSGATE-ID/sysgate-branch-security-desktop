import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { ITariff, IPayloadTariff } from '@interface/tariff.interface'
import type { AxiosError, AxiosResponse } from 'axios'
import { LoggerService } from './loggerService'

interface TariffService {
  getAllTariff: (params?: object) => Promise<IResponse<ITariff[]>>
  getDetailTariff: (id: string) => Promise<IResponse<ITariff>>
  createTariff: (data: IPayloadTariff) => Promise<IResponse>
  updateTariff: (id: string, data: IPayloadTariff) => Promise<IResponse>
  deleteTariff: (id: number) => Promise<IResponse>
}

const TariffService = (): TariffService => {
  const axiosInstance = useAxiosInstance()

  const getAllTariff = async (params?: object): Promise<IResponse<ITariff[]>> => {
    try {
      const response: AxiosResponse<IResponse<ITariff[]>> = await axiosInstance.get(`/tariff`, {
        params
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('TariffService.getAllTariff', 'Get all tariff failed', {
        request: '/tariff',
        params,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const getDetailTariff = async (id: string): Promise<IResponse<ITariff>> => {
    try {
      const response: AxiosResponse<IResponse<ITariff>> = await axiosInstance.get(`/tariff/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('TariffService.getDetailTariff', 'Get detail tariff failed', {
        request: `/tariff/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const createTariff = async (data: IPayloadTariff): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/tariff`, data)
      try {
        await LoggerService.info('TariffService.createTariff', 'Create tariff success', {
          request: `/tariff`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('TariffService.createTariff', 'Create tariff failed', {
        request: `/tariff`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const updateTariff = async (id: string, data: IPayloadTariff): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/tariff/${id}`, data)
      try {
        await LoggerService.info('TariffService.updateTariff', 'Update tariff success', {
          request: `/tariff/${id}`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('TariffService.updateTariff', 'Update tariff failed', {
        request: `/tariff/${id}`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const deleteTariff = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/tariff/${id}`)
      try {
        await LoggerService.info('TariffService.deleteTariff', 'Delete tariff success', {
          request: `/tariff/${id}`,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('TariffService.deleteTariff', 'Delete tariff failed', {
        request: `/tariff/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  return {
    getAllTariff,
    getDetailTariff,
    createTariff,
    updateTariff,
    deleteTariff
  }
}

export default TariffService
