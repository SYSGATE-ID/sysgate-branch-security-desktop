import { useAxiosInstance } from "@api/axiosInstance";
import type { IMember, IPayloadMember } from "@interface/member.interface";
import type { IResponse } from "@interface/response.interface";
import type { AxiosResponse } from "axios";

interface MemberService {
  getAllMember: (params?: object) => Promise<IResponse<IMember[]>>;
  getDetailMember: (id: number) => Promise<IResponse<IMember>>;
  createMember: (data: IPayloadMember) => Promise<IResponse>;
  updateMember: (id: number, data: IPayloadMember) => Promise<IResponse>;
 deleteMember: (id: number) => Promise<IResponse>;
}

const MemberService = (): MemberService => {
  const axiosInstance = useAxiosInstance();

  const getAllMember = async (
    params?: object
  ): Promise<IResponse<IMember[]>> => {
    try {
      const response: AxiosResponse<IResponse<IMember[]>> =
        await axiosInstance.get(`/member`, { params });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getDetailMember = async (id: number): Promise<IResponse<IMember>> => {
    try {
      const response: AxiosResponse<IResponse<IMember>> =
        await axiosInstance.get(`/member/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createMember = async (data: IPayloadMember): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/member`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateMember = async (
    id: number,
    data: IPayloadMember
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(
        `/member/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteMember = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(
        `/member/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getAllMember,
    getDetailMember,
    createMember,
    updateMember,
    deleteMember,
  };
};

export default MemberService;
