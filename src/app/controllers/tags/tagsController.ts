import { axiosInstance } from "../../../axios/axiosInstance";

export const getQuestions = async () => {
  try {
    const response = await axiosInstance.get(
      "http://localhost:5000/questions/all"
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const getTags = async () => {
  try {
    const response = await axiosInstance.get(
      "http://localhost:5000/tags/all"
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const searchTags = async (searchQuery: string) => {
  try {
    const response = await axiosInstance.get(`http://localhost:5000/tags/search/${searchQuery}`)
    return response;
  } catch(error) {
    console.log("Error >>>", error)
  }
}

export const searchQuestions = async (searchTag:string) => {
  try {
    const response = await axiosInstance.get(`http://localhost:5000/tags/questions?tags=${searchTag}`)
    return response;
  } catch(error) {
    console.log("Error >>>", error)
  }
}

export const createQuestion = async (data) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/questions/create",
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
      `http://localhost:5000/questions/update/${questionId}`,
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
      `http://localhost:5000/questions/delete/${questionId}`
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};
