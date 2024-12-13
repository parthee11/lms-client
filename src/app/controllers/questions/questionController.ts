// @ts-nocheck

import { apiUrl, axiosInstance } from "../../../axios/axiosInstance";

export const getQuestions = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/questions/all`);
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const createQuestion = async (data) => {
  try {
    const response = await axiosInstance.post(
      `${apiUrl}/questions/create`,
      data
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const updateQuestion = async (data, questionId: string) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/questions/update/${questionId}`,
      { ...data }
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const deleteQuestion = async (questionId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${apiUrl}/questions/delete/${questionId}`
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};
