import axios from "axios";
import { LoginFormValues } from "../../../components/auth/LoginForm";
import { RegisterFormValues } from "../../../components/auth/RegisterForm";
import { axiosInstance } from "../../../axios/axiosInstance";

export const registerAdmin = async (data: RegisterFormValues) => {
  try {
    const response = await axios.post(
      "http://localhost:5000/auth/register-admin",
      { ...data, admin_password: "makemeadmin" }
    );
    return response;
  } catch (error) {
    console.log("Error >>>", error);
  }
};

export const loginUser = async (data: LoginFormValues) => {
  try {
    const response = await axios.post("http://localhost:5000/auth/login", {
      ...data,
    });
    if (response?.status === 200) {
      const authToken = response?.data?.data?.token;
      localStorage.setItem("authToken", authToken);
    }
    return response;
  } catch (error) {
    console.log("Error >>>", error);
    throw new Error("Something went wrong!")
  }
};

export const getMe = async () => {
  try {
    const response = await axiosInstance.get("http://localhost:5000/users/me", {})
    return response;
  } catch(error) {
    console.log("Error >>>", error);
  }
}