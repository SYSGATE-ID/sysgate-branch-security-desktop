import { useAxiosInstance } from '@api/axiosInstance'
import type { IDivision, IPayloadDivision } from '@interface/division.interface'
import type { IResponse } from '@interface/response.interface'
import type { AxiosError, AxiosResponse } from 'axios'
import { LoggerService } from './loggerService'

interface DivisionService {
  getAllDivision: (params?: object) => Promise<IResponse<IDivision[]>>
  getDetailDivision: (id: string) => Promise<IResponse<IDivision>>
  createDivision: (data: IPayloadDivision) => Promise<IResponse>
  updateDivision: (id: string, data: IPayloadDivision) => Promise<IResponse>
  deleteDivision: (id: number) => Promise<IResponse>
}

const DivisionService = (): DivisionService => {
  const axiosInstance = useAxiosInstance()

  const getAllDivision = async (params?: object): Promise<IResponse<IDivision[]>> => {
    try {
      const response: AxiosResponse<IResponse<IDivision[]>> = await axiosInstance.get(`/division`, {
        params
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('DivisionService.getAllDivision', 'Get all division failed', {
        request: '/division',
        params,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const getDetailDivision = async (id: string): Promise<IResponse<IDivision>> => {
    try {
      const response: AxiosResponse<IResponse<IDivision>> = await axiosInstance.get(
        `/division/${id}`
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('DivisionService.getDetailDivision', 'Get detail division failed', {
        request: `/division/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const createDivision = async (data: IPayloadDivision): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/division`, data)
      try {
        await LoggerService.info('DivisionService.createDivision', 'Create division success', {
          request: `/division`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('DivisionService.createDivision', 'Create division failed', {
        request: `/division`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const updateDivision = async (id: string, data: IPayloadDivision): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/division/${id}`, data)
      try {
        await LoggerService.info('DivisionService.updateDivision', 'Update division success', {
          request: `/division/${id}`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('DivisionService.updateDivision', 'Update division failed', {
        request: `/division/${id}`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const deleteDivision = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/division/${id}`)
      try {
        await LoggerService.info('DivisionService.deleteDivision', 'Delete division success', {
          request: `/division/${id}`,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('DivisionService.deleteDivision', 'Delete division failed', {
        request: `/division/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  return {
    getAllDivision,
    getDetailDivision,
    createDivision,
    updateDivision,
    deleteDivision
  }
}

export default DivisionService
