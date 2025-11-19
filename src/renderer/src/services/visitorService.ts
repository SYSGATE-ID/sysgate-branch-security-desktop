import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponse } from '@interface/response.interface'
import type {
  IPayloadAgreement,
  IPayloadVisitor,
  IResponseReportVisitor,
  IVisitor
} from '@interface/visitor.interface'
import type { AxiosError, AxiosResponse } from 'axios'
import { LoggerService } from './loggerService'

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
  getStatusVisitor: () => Promise<IResponse<[]>>
  reportVisitors: (params?: object) => Promise<IResponseReportVisitor<IVisitor[]>>
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
      const axiosError = error as AxiosError
      await LoggerService.error('VisitorService.getAllVisitors', 'Get all visitors failed', {
        request: '/ticket',
        params,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const reportVisitors = async (params?: object): Promise<IResponseReportVisitor<IVisitor[]>> => {
    try {
      const response: AxiosResponse<IResponseReportVisitor<IVisitor[]>> = await axiosInstance.get(
        `/ticket-report`,
        { params }
      )
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('VisitorService.reportVisitors', 'Get report visitors failed', {
        request: '/ticket-report',
        params,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const getDetailVisitor = async (id: number): Promise<IResponse<IVisitor>> => {
    try {
      const response: AxiosResponse<IResponse<IVisitor>> = await axiosInstance.get(`/ticket/${id}`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('VisitorService.getDetailVisitor', 'Get detail visitor failed', {
        request: `/ticket/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const createVisitor = async (data: IPayloadVisitor): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(`/ticket`, data)
      try {
        await LoggerService.info('VisitorService.createVisitor', 'Create visitor success', {
          request: `/ticket`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('VisitorService.createVisitor', 'Create visitor failed', {
        request: `/ticket`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const updateVisitor = async (id: string, data: IPayloadVisitor): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(`/ticket/${id}`, data)
      try {
        await LoggerService.info('VisitorService.updateVisitor', 'Update visitor success', {
          request: `/ticket/${id}`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('VisitorService.updateVisitor', 'Update visitor failed', {
        request: `/ticket/${id}`,
        payload: data,
        response: axiosError.response
      })
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
      try {
        await LoggerService.info(
          'VisitorService.updateStatusVisitor',
          'Update status visitor success',
          {
            request: `/ticket/status/${id}`,
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
        'VisitorService.updateStatusVisitor',
        'Update status visitor failed',
        {
          request: `/ticket/status/${id}`,
          payload: data,
          response: axiosError.response
        }
      )
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
      try {
        await LoggerService.info('VisitorService.approveVisitor', 'Approve visitor success', {
          request: `/ticket/approve/${id}`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('VisitorService.approveVisitor', 'Approve visitor failed', {
        request: `/ticket/approve/${id}`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const getStatusVisitor = async (): Promise<IResponse<[]>> => {
    try {
      const response: AxiosResponse<IResponse<[]>> = await axiosInstance.get(`/ticket/status`)
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('VisitorService.getStatusVisitor', 'Get status visitor failed', {
        request: '/ticket/status',
        response: axiosError.response
      })
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
      try {
        await LoggerService.info('VisitorService.denyVisitor', 'Deny visitor success', {
          request: `/ticket/deny/${id}`,
          payload: data,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('VisitorService.denyVisitor', 'Deny visitor failed', {
        request: `/ticket/deny/${id}`,
        payload: data,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const deleteVisitor = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(`/ticket/${id}`)
      try {
        await LoggerService.info('VisitorService.deleteVisitor', 'Delete visitor success', {
          request: `/ticket/${id}`,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('VisitorService.deleteVisitor', 'Delete visitor failed', {
        request: `/ticket/${id}`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  const sendEmailTicketVisitor = async (kode: string): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `mailer/send-ticket/${kode}`
      )
      try {
        await LoggerService.info(
          'VisitorService.sendEmailTicketVisitor',
          'Send email ticket visitor success',
          {
            request: `mailer/send-ticket/${kode}`,
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
        'VisitorService.sendEmailTicketVisitor',
        'Send email ticket visitor failed',
        {
          request: `mailer/send-ticket/${kode}`,
          response: axiosError.response
        }
      )
      console.error(error)
      throw error
    }
  }

  return {
    getAllVisitors,
    getDetailVisitor,
    createVisitor,
    getStatusVisitor,
    updateVisitor,
    deleteVisitor,
    updateStatusVisitor,
    approveVisitor,
    denyVisitor,
    sendEmailTicketVisitor,
    reportVisitors
  }
}

export default VisitorService
