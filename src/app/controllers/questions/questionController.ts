// @ts-nocheck

import { apiUrl, axiosInstance } from "../../../axios/axiosInstance";

export const getQuestions = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/questions/all`);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const createQuestion = async (data) => {
  try {
    const response = await axiosInstance.post(
      `${apiUrl}/questions/create`,
      data
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

export const updateQuestion = async (data, questionId: string) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/questions/update/${questionId}`,
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

export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${apiUrl}/questions/delete/${questionId}`
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
