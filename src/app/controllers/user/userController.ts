import { apiUrl, axiosInstance } from "../../../axios/axiosInstance";
import { CreateEntityFormValues } from "../../../components/forms/UserForm";

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/users/all`);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const createUser = async (data: CreateEntityFormValues) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/users/add`, {
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

export const updateUser = async (
  data: CreateEntityFormValues,
  userId: string
) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/users/update/${userId}`,
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

export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${apiUrl}/users/delete/${userId}`
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

export const getStudentsInBatch = async (batchId: string) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}/batches/students/${batchId}`
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

export const searchStudents = async (searchQuery: string) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}/users/search?name=${searchQuery}&page=1&limit=5`
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
