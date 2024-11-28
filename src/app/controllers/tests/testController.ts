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

export const updateTest = async (data, testId) => {
  try {
    const response = await axiosInstance.put(`${apiUrl}/tests/${testId}`, {
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

export const startTest = async (testId: string) => {
  try {
    const response = await axiosInstance.post(`${apiUrl}/testresults/create`, {
      test_id: testId,
    });
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const submitTest = async(testresultId:string) => {
  try {
    const response = await axiosInstance.put(`${apiUrl}/testresults/submit/${testresultId}`, {
    });
    return response;
  } catch(error) {
    console.log("Error >>>", error);
  }
}

export const deleteTest = async (testId: string) => {
  try {
    const response = await axiosInstance.delete(
      `${apiUrl}/tests/${testId}`
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
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
  } catch (error) {
    console.log("Error >>>", error);
  }
};
