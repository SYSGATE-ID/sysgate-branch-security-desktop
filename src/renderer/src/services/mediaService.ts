import { useAxiosInstance } from "@api/axiosInstance";
import type { IResponseMedia } from "@interface/media.interface";
import type { IResponse } from "@interface/response.interface";
import type { AxiosResponse } from "axios";

interface MediaService {
  createMedia: (data: FormData) => Promise<IResponse<IResponseMedia>>;
}

const MediaService = (): MediaService => {
  const axiosInstance = useAxiosInstance();

  const createMedia = async (
    data: FormData
  ): Promise<IResponse<IResponseMedia>> => {
    try {
      const response: AxiosResponse<IResponse<IResponseMedia>> =
        await axiosInstance.post(`/s3/upload-image`, data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    createMedia,
  };
};

export default MediaService;
