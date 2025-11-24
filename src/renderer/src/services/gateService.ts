import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { IGate, ILogGate, IPayloadGate } from '@interface/gate.interface'
import type { AxiosError, AxiosResponse } from 'axios'
import { LoggerService } from './loggerService'

interface GateService {
  getAllGate: (params?: object) => Promise<IResponse<IGate[]>>
  getAllLogGate: (params?: object) => Promise<IResponse<ILogGate[]>>
  getDetailGate: (id: string) => Promise<IResponse<IGate>>
  getDetailLogGate: (id: string) => Promise<IResponse<ILogGate>>
  createGate: (data: IPayloadGate) => Promise<IResponse>
  updateGate: (id: string, data: IPayloadGate) => Promise<IResponse>
  deleteGate: (id: number) => Promise<IResponse>
  getTypeGate: () => Promise<IResponse<[]>>
}

const GateService = (): GateService => {
  const axiosInstance = useAxiosInstance()

  const getAllGate = async (params?: object): Promise<IResponse<IGate[]>> => {
    try {
      const response: AxiosResponse<IResponse<IGate[]>> = await axiosInstance.get(`/gate`, {
        params
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('GateService.getAllGate', 'Get all gate failed', {
        request: '/gate',
        params,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const getAllLogGate = async (params?: object): Promise<IResponse<ILogGate[]>> => {
    try {
      const response: AxiosResponse<IResponse<ILogGate[]>> = await axiosInstance.get(`/gate/logs`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailGate = async (id: string): Promise<IResponse<IGate>> => {
    try {
      const response: AxiosResponse<IResponse<IGate>> = await axiosInstance.get(`/gate/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('GateService.getDetailGate', 'Get detail gate failed', {
        request: `/gate/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const getDetailLogGate = async (id: string): Promise<IResponse<ILogGate>> => {
    try {
      const response: AxiosResponse<IResponse<ILogGate>> = await axiosInstance.get(
        `/gate/log/${id}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getTypeGate = async (): Promise<IResponse<[]>> => {
    try {
      const response: AxiosResponse<IResponse<[]>> = await axiosInstance.get(`/gate/types`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('GateService.getTypeGate', 'Get type gate failed', {
        request: '/gate/types',
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const createGate = async (data: IPayloadGate): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/gate`, data)
      try {
        await LoggerService.info('GateService.createGate', 'Create gate success', {
          request: `/gate`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('GateService.createGate', 'Create gate failed', {
        request: `/gate`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const updateGate = async (id: string, data: IPayloadGate): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/gate/${id}`, data)
      try {
        await LoggerService.info('GateService.updateGate', 'Update gate success', {
          request: `/gate/${id}`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('GateService.updateGate', 'Update gate failed', {
        request: `/gate/${id}`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const deleteGate = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/gate/${id}`)
      try {
        await LoggerService.info('GateService.deleteGate', 'Delete gate success', {
          request: `/gate/${id}`,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('GateService.deleteGate', 'Delete gate failed', {
        request: `/gate/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  return {
    getAllGate,
    getAllLogGate,
    getTypeGate,
    getDetailGate,
    getDetailLogGate,
    createGate,
    updateGate,
    deleteGate
  }
}

export default GateService
