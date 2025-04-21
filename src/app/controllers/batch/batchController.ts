import { apiUrl, axiosInstance } from "../../../axios/axiosInstance";
import { CreateBatchFormValues } from "../../../components/forms/BatchForm";

export const getBatches = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/batches/all`);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const createBatch = async (data: CreateBatchFormValues) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/batches/create`, {
      ...data,
    });
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const updateBatch = async (
  data: CreateBatchFormValues,
  batchId: string
) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/batches/update/${batchId}`,
      { ...data }
    );
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const deleteBatch = async (batchId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${apiUrl}/batches/delete/${batchId}`
    );
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const enrollToBatch = async (batchId: string, userIds: string[]) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/batches/enroll/${batchId}`,
      { userIds }
    );
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const addTestsToBatch = async (batchId: string, testIds: string[]) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/batches/add-tests/${batchId}`,
      { testIds }
    );
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};
