import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type { IPayloadAgreement, IPayloadVisitor, IVisitor } from '@interface/visitor.interface'
import type { AxiosResponse } from 'axios'

interface VisitorService {
  getAllVisitors: (params?: object) => Promise<IResponse<IVisitor[]>>
  getDetailVisitor: (id: number) => Promise<IResponse<IVisitor>>
  createVisitor: (data: IPayloadVisitor) => Promise<IResponse>
  updateVisitor: (id: string, data: IPayloadVisitor) => Promise<IResponse>
  approveVisitor: (id: string, data?: IPayloadAgreement) => Promise<IResponse<IVisitor>>
  denyVisitor: (id: string, data: IPayloadAgreement) => Promise<IResponse<IVisitor>>
  updateStatusVisitor: (id: string, data: { status: number }) => Promise<IResponse>
  deleteVisitor: (id: number) => Promise<IResponse>
  sendEmailTicketVisitor: (kode: string) => Promise<IResponse>
}

const VisitorService = (): VisitorService => {
  const axiosInstance = useAxiosInstance()

  const getAllVisitors = async (params?: object): Promise<IResponse<IVisitor[]>> => {
    try {
      const response: AxiosResponse<IResponse<IVisitor[]>> = await axiosInstance.get(`/ticket`, {
        params
      })
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDetailVisitor = async (id: number): Promise<IResponse<IVisitor>> => {
    try {
      const response: AxiosResponse<IResponse<IVisitor>> = await axiosInstance.get(`/ticket/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const createVisitor = async (data: IPayloadVisitor): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/ticket`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateVisitor = async (id: string, data: IPayloadVisitor): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/ticket/${id}`, data)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const updateStatusVisitor = async (id: string, data: { status: number }): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(
        `/ticket/status/${id}`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const approveVisitor = async (
    id: string,
    data?: IPayloadAgreement
  ): Promise<IResponse<IVisitor>> => {
    try {
      const response: AxiosResponse<IResponse<IVisitor>> = await axiosInstance.patch(
        `/ticket/approve/${id}`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const denyVisitor = async (id: string, data: IPayloadAgreement): Promise<IResponse<IVisitor>> => {
    try {
      const response: AxiosResponse<IResponse<IVisitor>> = await axiosInstance.patch(
        `/ticket/deny/${id}`,
        data
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const deleteVisitor = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/ticket/${id}`)
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const sendEmailTicketVisitor = async (kode: string): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `mailer/send-ticket/${kode}`
      )
      return response.data
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return {
    getAllVisitors,
    getDetailVisitor,
    createVisitor,
    updateVisitor,
    deleteVisitor,
    updateStatusVisitor,
    approveVisitor,
    denyVisitor,
    sendEmailTicketVisitor
  }
}

export default VisitorService
