import { useAxiosInstance } from '@api/axiosInstance'
import type { IResponseMedia } from '@interface/media.interface'
import type { IResponse } from '@interface/response.interface'
import type { AxiosError, AxiosResponse } from 'axios'
import { LoggerService } from './loggerService'

interface MediaService {
  createMedia: (data: FormData) => Promise<IResponse<IResponseMedia>>
}

const MediaService = (): MediaService => {
  const axiosInstance = useAxiosInstance()

  const createMedia = async (data: FormData): Promise<IResponse<IResponseMedia>> => {
    try {
      const response: AxiosResponse<IResponse<IResponseMedia>> = await axiosInstance.post(
        `/s3/upload-image`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )
      try {
        await LoggerService.info('MediaService.createMedia', 'Create media success', {
          request: `/s3/upload-image`,
          response: response
        })
      } catch (error) {
        console.error(error)
      }
      return response.data
    } catch (error) {
      const axiosError = error as AxiosError
      await LoggerService.error('MediaService.createMedia', 'Create media failed', {
        request: `/s3/upload-image`,
        response: axiosError.response
      })
      console.error(error)
      throw error
    }
  }

  return {
    createMedia
  }
}

export default MediaService
