import { useDispatch } from "react-redux";
import { loginUser } from "../app/controllers/auth/authController";
import { setIsAuthenticated } from "../app/features/auth/authSlice";
import LoginForm, { LoginFormValues } from "../components/auth/LoginForm";
import Header from "../components/common/Header";
import { useNavigate } from "react-router-dom";

const AdminLogin: React.FC = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleAdminLoginSubmit = async (data: LoginFormValues) => {
    try {
      await loginUser(data);
      dispatch(setIsAuthenticated(true));
      navigate('/dashboard')
    } catch (e) {
      console.error("Error logging in admin", e);
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
