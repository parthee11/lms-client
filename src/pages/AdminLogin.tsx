import { useDispatch } from "react-redux";
import { getMe, loginUser } from "../app/controllers/auth/authController";
import { setIsAuthenticated, setUser } from "../app/features/auth/authSlice";
import LoginForm, { LoginFormValues } from "../components/auth/LoginForm";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAdminLoginSubmit = async (data: LoginFormValues) => {
    try {
      await loginUser(data);
      dispatch(setIsAuthenticated(true));
      const response = await getMe();
      dispatch(setUser(response?.data?.data));
      navigate("/dashboard");
    } catch (error) {
      // @ts-expect-error message
      const message = error?.message || "Login failed. Please try again.";
      toast.error(message);
    }
  };

  return (
    <div>
      <Header isAdmin={true} />
      <LoginForm handleLoginSubmit={handleAdminLoginSubmit} isAdmin={true} />
    </div>
  );
};

export default AdminLogin;
