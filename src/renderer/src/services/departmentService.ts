import { useAxiosInstance } from '@api/axiosInstance'
import type { IDepartment, IPayloadDepartment } from '@interface/department.interface'
import type { IResponse } from '@interface/response.interface'
import type { AxiosResponse } from 'axios'

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
      console.error(error)
      throw error
    }
  }

  const createDepartment = async (data: IPayloadDepartment): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/department`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateDepartment = async (id: string, data: IPayloadDepartment): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/department/${id}`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteDepartment = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/department/${id}`)
      return response.data
    } catch (error) {
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
