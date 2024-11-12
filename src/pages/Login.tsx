import { useDispatch } from "react-redux";
import { loginUser } from "../app/controllers/auth/authController";
import { setIsAuthenticated } from "../app/features/auth/authSlice";
import LoginForm, { LoginFormValues } from "../components/auth/LoginForm";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleUserLoginSubmit = async (data: LoginFormValues) => {
    try {
      await loginUser(data);
      dispatch(setIsAuthenticated(true));
      navigate('/dashboard')
    } catch (error) {
      console.error("Error logging in admin:", error?.response?.data || error);
    }
  };

  return (
    <div>
      <Header isAdmin={false} />
      <LoginForm handleLoginSubmit={handleUserLoginSubmit} />
    </div>
  );
};

export default Login;
