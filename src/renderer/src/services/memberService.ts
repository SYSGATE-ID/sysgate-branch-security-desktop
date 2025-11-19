import { useAxiosInstance } from '@api/axiosInstance'
import type { IMember, IPayloadMember } from '@interface/member.interface'
import type { IResponse } from '@interface/response.interface'
import type { AxiosError, AxiosResponse } from 'axios'
import { LoggerService } from './loggerService'

interface MemberService {
  getAllMember: (params?: object) => Promise<IResponse<IMember[]>>
  getDetailMember: (id: number) => Promise<IResponse<IMember>>
  createMember: (data: IPayloadMember) => Promise<IResponse>
  updateMember: (id: number, data: IPayloadMember) => Promise<IResponse>
  deleteMember: (id: number) => Promise<IResponse>
}

const MemberService = (): MemberService => {
  const axiosInstance = useAxiosInstance()

  const getAllMember = async (params?: object): Promise<IResponse<IMember[]>> => {
    try {
      const response: AxiosResponse<IResponse<IMember[]>> = await axiosInstance.get(`/member`, {
        params
      })
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('MemberService.getAllMember', 'Get all member failed', {
        request: '/member',
        params,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const getDetailMember = async (id: number): Promise<IResponse<IMember>> => {
    try {
      const response: AxiosResponse<IResponse<IMember>> = await axiosInstance.get(`/member/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('MemberService.getDetailMember', 'Get detail member failed', {
        request: `/member/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const createMember = async (data: IPayloadMember): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/member`, data)
      try {
        await LoggerService.info('MemberService.createMember', 'Create member success', {
          request: `/member`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('MemberService.createMember', 'Create member failed', {
        request: `/member`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const updateMember = async (id: number, data: IPayloadMember): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/member/${id}`, data)
      try {
        await LoggerService.info('MemberService.updateMember', 'Update member success', {
          request: `/member/${id}`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('MemberService.updateMember', 'Update member failed', {
        request: `/member/${id}`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const deleteMember = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/member/${id}`)
      try {
        await LoggerService.info('MemberService.deleteMember', 'Delete member success', {
          request: `/member/${id}`,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('MemberService.deleteMember', 'Delete member failed', {
        request: `/member/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  return {
    getAllMember,
    getDetailMember,
    createMember,
    updateMember,
    deleteMember
  }
}

export default MemberService
