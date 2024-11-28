import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import {
  selectIsAuthenticated,
  selectUser,
} from "./app/features/auth/authSelectors";
import { useDispatch, useSelector } from "react-redux";
import CreateEntity from "./pages/CreateEntity";
import UpdateEntity from "./pages/UpdateEntity";
import Users from "./pages/Users";
import Batches from "./pages/Batches";
import Tests from "./pages/Tests";
import UserDetails from "./pages/UserDetails";
import BatchDetails from "./pages/BatchDetails";
import MyTests from "./pages/MyTests";
import TakeTest from "./pages/TakeTest";
import { useEffect } from "react";
import { getMe } from "./app/controllers/auth/authController";
import { setUser } from "./app/features/auth/authSlice";

const PrivateRoute: React.FC<{ children: React.ReactElement }> = ({
  children,
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const ProtectedRoutes: React.FC = () => {
  return (
    <div>
      <Outlet />
    </div>
  );
};

const App = () => {
  const dispatch = useDispatch();
  const userProfile = useSelector(selectUser);

  useEffect(() => {
    if (!userProfile) {
      fetchMe();
    }
  }, [userProfile]);

  const fetchMe = async () => {
    try {
      const response = await getMe();
      dispatch(setUser(response?.data?.data));
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <PrivateRoute>
              <ProtectedRoutes />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<UserDetails />} />
          <Route path="/batches" element={<Batches />} />
          <Route path="/batches/:id" element={<BatchDetails />} />
          <Route path="/tests" element={<Tests />} />
          <Route path="/my-tests" element={<MyTests />} />
          <Route path="/my-tests/take/:testId" element={<TakeTest />} />
          <Route path="/create" element={<CreateEntity />} />
          <Route path="/update" element={<UpdateEntity />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
