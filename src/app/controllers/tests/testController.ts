import { apiUrl, axiosInstance } from "../../../axios/axiosInstance";

export const getTests = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/tests/all`);
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const getMyTests = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/tests/my-tests`);
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const createTest = async (data) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/tests/create`, {
      ...data,
    });
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const getTestsInBatch = async (batchId: string) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}/batches/tests/${batchId}`
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const searchTests = async (searchQuery: string) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}/tests/search?query=${searchQuery}`
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};
