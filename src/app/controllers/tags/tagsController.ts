import { apiUrl, axiosInstance } from "../../../axios/axiosInstance";

export const getQuestions = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/questions/all`);
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const getTags = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/tags/all`);
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const searchTags = async (searchQuery: string) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}/tags/search/${searchQuery}`
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const searchQuestions = async (searchTag: string) => {
  try {
    const response = await axiosInstance.get(
      `${apiUrl}/tags/questions?tags=${searchTag}`
    );
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
