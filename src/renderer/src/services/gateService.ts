import { useAxiosInstance } from "@api/axiosInstance";
import type { IResponse } from "@interface/response.interface";
import type { IGate, IPayloadGate } from "@interface/gate.interface";
import type { AxiosResponse } from "axios";

interface GateService {
  getAllGate: (params?: object) => Promise<IResponse<IGate[]>>;
  getDetailGate: (id: string) => Promise<IResponse<IGate>>;
  createGate: (data: IPayloadGate) => Promise<IResponse>;
  updateGate: (id: string, data: IPayloadGate) => Promise<IResponse>;
  deleteGate: (id: number) => Promise<IResponse>;
}

const GateService = (): GateService => {
  const axiosInstance = useAxiosInstance();

  const getAllGate = async (
    params?: object
  ): Promise<IResponse<IGate[]>> => {
    try {
      const response: AxiosResponse<IResponse<IGate[]>> =
        await axiosInstance.get(`/gate`, { params });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getDetailGate = async (id: string): Promise<IResponse<IGate>> => {
    try {
      const response: AxiosResponse<IResponse<IGate>> =
        await axiosInstance.get(`/gate/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createGate = async (data: IPayloadGate): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/gate`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateGate = async (
    id: string,
    data: IPayloadGate
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(
        `/gate/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteGate = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(
        `/gate/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getAllGate,
    getDetailGate,
    createGate,
    updateGate,
    deleteGate,
  };
};

export default GateService;
