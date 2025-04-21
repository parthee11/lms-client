import axios from "axios";
import { LoginFormValues } from "../../../components/auth/LoginForm";
import { RegisterFormValues } from "../../../components/auth/RegisterForm";
import { apiUrl, axiosInstance } from "../../../axios/axiosInstance";

export const registerAdmin = async (data: RegisterFormValues) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/register-admin`, {
      ...data,
      admin_password: "makemeadmin",
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

export const loginUser = async (data: LoginFormValues) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/login`, {
      ...data,
    });
    if (response?.status === 200) {
      const authToken = response?.data?.data?.token;
      localStorage.setItem("authToken", authToken);
    }
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};

export const getMe = async () => {
  try {
    const response = await axiosInstance.get(`${apiUrl}/users/me`, {});
    return response;
  } catch (error: any) {
    const message =
      error?.response?.data?.data?.message ||
      error?.response?.data?.message ||
      "Something went wrong";
    throw new Error(message);
  }
};
