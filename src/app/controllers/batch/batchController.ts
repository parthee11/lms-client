import { apiUrl, axiosInstance } from "../../../axios/axiosInstance";
import { CreateBatchFormValues } from "../../../components/forms/BatchForm";

export const getBatches = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/batches/all`);
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const createBatch = async (data) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/batches/create`, {
      ...data,
    });
    return response;
  } catch (error) {
    console.log("Error >>>", error);
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
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const deleteBatch = async (batchId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${apiUrl}/batches/delete/${batchId}`
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const enrollToBatch = async (batchId: string, userIds: string[]) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/batches/enroll/${batchId}`,
      { userIds }
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const addTestsToBatch = async (batchId: string, testIds: string[]) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/batches/add-tests/${batchId}`,
      { testIds }
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};
