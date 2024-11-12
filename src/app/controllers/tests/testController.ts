import { axiosInstance } from "../../../axios/axiosInstance";

export const getTests = async () => {
  try {
    const response = await axiosInstance.get("http://localhost:5000/tests/all");
    return response;
  } catch(error) {
    console.log("Error >>>", error)
  }
}

export const getMyTests = async () => {
  try {
    const response = await axiosInstance.get("http://localhost:5000/tests/my-tests");
    return response;
  } catch(error) {
    console.log("Error >>>", error)
  }
}

export const createTest = async (data) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/tests/create",
      { ...data }
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};
