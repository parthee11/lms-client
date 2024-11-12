import { AppDispatch } from "../../store";
import { setIsAuthenticated } from "./authSlice";

export const initializeAuth = () => (dispatch: AppDispatch) => {
  const token = localStorage.getItem("authToken");

  if (token) {
    dispatch(setIsAuthenticated(true));
  } else {
    dispatch(setIsAuthenticated(false));
  }
};