import { useAxiosInstance } from "@api/axiosInstance";
import type { IResponse } from "@interface/response.interface";
import type { IUser, IPayloadUser, IPayloadUpdateUser } from "@interface/user.interface";
import type { AxiosResponse } from "axios";

interface UsersService {
  getAllUsers: (params?: object) => Promise<IResponse<IUser[]>>;
  getDetailUser: (id: string) => Promise<IResponse<IUser>>;
  createUser: (data: IPayloadUser) => Promise<IResponse>;
  updateUser: (id: string, data: IPayloadUpdateUser) => Promise<IResponse>;
  deleteUser: (id: number) => Promise<IResponse>;
}

const UsersService = (): UsersService => {
  const axiosInstance = useAxiosInstance();

  const getAllUsers = async (
    params?: object
  ): Promise<IResponse<IUser[]>> => {
    try {
      const response: AxiosResponse<IResponse<IUser[]>> =
        await axiosInstance.get(`/user`, { params });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getDetailUser = async (id: string): Promise<IResponse<IUser>> => {
    try {
      const response: AxiosResponse<IResponse<IUser>> =
        await axiosInstance.get(`/user/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createUser = async (data: IPayloadUser): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/auth/register`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateUser = async (
    id: string,
    data: IPayloadUpdateUser
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(
        `/user/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteUser = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(
        `/user/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getAllUsers,
    getDetailUser,
    createUser,
    updateUser,
    deleteUser,
  };
};

export default UsersService;
