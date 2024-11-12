import { axiosInstance } from "../../../axios/axiosInstance";
import { CreateBatchFormValues } from "../../../components/forms/BatchForm";

export const getBatches = async () => {
  try {
    const response = await axiosInstance.get(
      "http://localhost:5000/batches/all"
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const createBatch = async (data) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/batches/create",
      { ...data }
    );
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
      `http://localhost:5000/batches/update/${batchId}`,
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
      `http://localhost:5000/batches/delete/${batchId}`
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const enrollToBatch = async (batchId: string, userIds: string[]) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:5000/batches/enroll/${batchId}`,
      { userIds }
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};
