import { useAxiosInstance } from '@api/axiosInstance'
import type { IDepartment, IPayloadDepartment } from '@interface/department.interface'
import type { IResponse } from '@interface/response.interface'
import type { AxiosError, AxiosResponse } from 'axios'
import { LoggerService } from './loggerService'

interface DepartmentService {
  getAllDepartment: (params?: object) => Promise<IResponse<IDepartment[]>>
  getDetailDepartment: (id: string) => Promise<IResponse<IDepartment>>
  createDepartment: (data: IPayloadDepartment) => Promise<IResponse>
  updateDepartment: (id: string, data: IPayloadDepartment) => Promise<IResponse>
  deleteDepartment: (id: number) => Promise<IResponse>
}

const DepartmentService = (): DepartmentService => {
  const axiosInstance = useAxiosInstance()

  const getAllDepartment = async (params?: object): Promise<IResponse<IDepartment[]>> => {
    try {
      const response: AxiosResponse<IResponse<IDepartment[]>> = await axiosInstance.get(
        `/department`,
        { params }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('DepartmentService.getAllDepartment', 'Get all department failed', {
        request: '/department',
        params,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const getDetailDepartment = async (id: string): Promise<IResponse<IDepartment>> => {
    try {
      const response: AxiosResponse<IResponse<IDepartment>> = await axiosInstance.get(
        `/department/${id}`
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error(
        'DepartmentService.getDetailDepartment', // Diperbaiki: nama function sesuai
        'Get detail department failed',
        {
          request: `/department/${id}`,
          response: axiosError.response
        }
      )
      console.error(error)
      throw error
    }
  }

  const createDepartment = async (data: IPayloadDepartment): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/department`, data)
      try {
        await LoggerService.info(
          'DepartmentService.createDepartment', // Diperbaiki: nama function sesuai
          'Create department success',
          {
            request: `/department`,
            payload: data,
            response: response
          }
        )
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('DepartmentService.createDepartment', 'Create department failed', {
        request: `/department`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const updateDepartment = async (id: string, data: IPayloadDepartment): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/department/${id}`, data)
      try {
        await LoggerService.info(
          'DepartmentService.updateDepartment', // Diperbaiki: nama function sesuai
          'Update department success',
          {
            request: `/department/${id}`,
            payload: data,
            response: response
          }
        )
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error(
        'DepartmentService.updateDepartment',
        'Update department failed', // Diperbaiki: pesan error sesuai
        {
          request: `/department/${id}`, // Diperbaiki: endpoint sesuai
          payload: data,
          response: axiosError.response
        }
      )
      console.error(error)
      throw error
    }
  }

  const deleteDepartment = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/department/${id}`)
      try {
        await LoggerService.info(
          'DepartmentService.deleteDepartment',
          'Delete department success',
          {
            request: `/department/${id}`,
            response: response
          }
        )
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('DepartmentService.deleteDepartment', 'Delete department failed', {
        request: `/department/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  return {
    getAllDepartment,
    getDetailDepartment,
    createDepartment,
    updateDepartment,
    deleteDepartment
  }
}

export default DepartmentService
