import { axiosInstance } from "../../../axios/axiosInstance";
import { CreateEntityFormValues } from "../../../components/forms/UserForm";

export const getUsers = async () => {
  try {
    const response = await axiosInstance.get("http://localhost:5000/users/all");
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const createUser = async (data: CreateEntityFormValues) => {
  try {
    const response = await axiosInstance.post(
      "http://localhost:5000/users/add",
      { ...data }
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const updateUser = async (data: CreateEntityFormValues, userId: string) => {
  try {
    const response = await axiosInstance.put(
      `http://localhost:5000/users/update/${userId}`,
      { ...data }
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const deleteUser = async (userId: string) => {
  try {
    const response = await axiosInstance.delete(
      `http://localhost:5000/users/delete/${userId}`
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};
