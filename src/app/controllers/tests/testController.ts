/* eslint-disable @typescript-eslint/no-explicit-any */

import { apiUrl, axiosInstance } from "../../../axios/axiosInstance";

export const getTests = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/tests/all`);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const getMyTests = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/tests/my-tests`);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export interface CreateTestData {
  test_name: string;
  timing: number;
  positive_scoring: number;
  negative_scoring: number;
  questions: Array<any>;
  batch_id: string;
  cut_off: number;
}

export const createTest = async (data: CreateTestData) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/tests/create`, {
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

export const updateTest = async (data: CreateTestData, testId: string) => {
  try {
    const response = await axiosInstance.put(`${apiUrl}/tests/${testId}`, {
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

export const getTestsInBatch = async (batchId: string) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}/batches/tests/${batchId}`
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

export const searchTests = async (searchQuery: string) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}/tests/search?query=${searchQuery}`
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

export const startTest = async (testId: string) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/testresults/create`, {
      test_id: testId,
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

export const submitTest = async (testresultId: string) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/testresults/submit/${testresultId}`,
      {}
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

export const deleteTest = async (testId: string) => {
  try {
    const response = await axiosInstance.delete(`${apiUrl}/tests/${testId}`);
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const questionStateUpdate = async (
  testId: string,
  questionId: string,
  optionId: string,
  state: string
) => {
  try {
    const response = await axiosInstance.put(
      `${apiUrl}/testresults/update/${testId}`,
      {
        question_id: questionId,
        selected_option: optionId,
        state,
      }
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

export const getTestHistory = async (testId: string) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}/testresults/by-test/${testId}`
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
