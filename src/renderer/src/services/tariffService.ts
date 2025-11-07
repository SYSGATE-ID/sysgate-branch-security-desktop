import { useAxiosInstance } from "@api/axiosInstance";
import type { IResponse } from "@interface/response.interface";
import type { ITariff, IPayloadTariff } from "@interface/tariff.interface";
import type { AxiosResponse } from "axios";

interface TariffService {
  getAllTariff: (params?: object) => Promise<IResponse<ITariff[]>>;
  getDetailTariff: (id: string) => Promise<IResponse<ITariff>>;
  createTariff: (data: IPayloadTariff) => Promise<IResponse>;
  updateTariff: (id: string, data: IPayloadTariff) => Promise<IResponse>;
  deleteTariff: (id: number) => Promise<IResponse>;
}

const TariffService = (): TariffService => {
  const axiosInstance = useAxiosInstance();

  const getAllTariff = async (
    params?: object
  ): Promise<IResponse<ITariff[]>> => {
    try {
      const response: AxiosResponse<IResponse<ITariff[]>> =
        await axiosInstance.get(`/tariff`, { params });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const getDetailTariff = async (id: string): Promise<IResponse<ITariff>> => {
    try {
      const response: AxiosResponse<IResponse<ITariff>> =
        await axiosInstance.get(`/tariff/${id}`);
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const createTariff = async (data: IPayloadTariff): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.post(
        `/tariff`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const updateTariff = async (
    id: string,
    data: IPayloadTariff
  ): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.put(
        `/tariff/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const deleteTariff = async (id: number): Promise<IResponse> => {
    try {
      const response: AxiosResponse<IResponse> = await axiosInstance.delete(
        `/tariff/${id}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return {
    getAllTariff,
    getDetailTariff,
    createTariff,
    updateTariff,
    deleteTariff,
  };
};

export default TariffService;
