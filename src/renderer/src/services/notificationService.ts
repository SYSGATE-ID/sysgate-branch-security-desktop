import { useAxiosInstance } from "@api/axiosInstance";
import type { INotif, IResponseNotif } from "@interface/notification.interface";
import type { IResponse } from "@interface/response.interface";
import type { AxiosResponse } from "axios";

interface NotificationService {
  getAllNotification: (params?: object) => Promise<IResponseNotif<INotif[]>>;
  markNotification: (id: number) => Promise<IResponse>;
}

const NotificationService = (): NotificationService => {
  const axiosInstance = useAxiosInstance();

  const getAllNotification = async (
    params?: object
  ): Promise<IResponseNotif<INotif[]>> => {
    try {
      const response: AxiosResponse<IResponseNotif<INotif[]>> =
        await axiosInstance.get(`/notification`, { params });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const markNotification = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.patch(
        `notification/read/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getAllNotification,
    markNotification,
  };
};

export default NotificationService;
