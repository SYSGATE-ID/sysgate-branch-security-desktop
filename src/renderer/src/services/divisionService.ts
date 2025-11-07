import { useAxiosInstance } from "@api/axiosInstance";
import type { IDivision, IPayloadDivision } from "@interface/division.interface";
import type { IResponse } from "@interface/response.interface";
import type { AxiosResponse } from "axios";

interface DivisionService {
  getAllDivision: (params?: object) => Promise<IResponse<IDivision[]>>;
  getDetailDivision: (id: string) => Promise<IResponse<IDivision>>;
  createDivision: (data: IPayloadDivision) => Promise<IResponse>;
  updateDivision: (id: string, data: IPayloadDivision) => Promise<IResponse>;
  deleteDivision: (id: number) => Promise<IResponse>;
}

const DivisionService = (): DivisionService => {
  const axiosInstance = useAxiosInstance();

  const getAllDivision = async (
    params?: object
  ): Promise<IResponse<IDivision[]>> => {
    try {
      const response: AxiosResponse<IResponse<IDivision[]>> =
        await axiosInstance.get(`/division`, { params });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getDetailDivision = async (
    id: string
  ): Promise<IResponse<IDivision>> => {
    try {
      const response: AxiosResponse<IResponse<IDivision>> =
        await axiosInstance.get(`/division/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createDivision = async (data: IPayloadDivision): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/division`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateDivision = async (
    id: string,
    data: IPayloadDivision
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(
        `/division/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteDivision = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(
        `/division/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getAllDivision,
    getDetailDivision,
    createDivision,
    updateDivision,
    deleteDivision,
  };
};

export default DivisionService;
