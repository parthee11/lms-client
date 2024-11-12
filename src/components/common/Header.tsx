import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  selectIsAuthenticated,
  selectUser,
} from "../../app/features/auth/authSelectors";
import { setIsAuthenticated } from "../../app/features/auth/authSlice";

interface HeaderProps {
  isAdmin: boolean;
}

const Header = ({ isAdmin }: HeaderProps) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userProfile = useSelector(selectUser);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(setIsAuthenticated(false));
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="text-xl font-bold">
          <Link to="/dashboard" className="text-blue-500 hover:text-blue-600">
            MyApp
          </Link>
        </div>

        {/* Navigation */}
        <nav>
          {isAuthenticated ? (
            <ul className="flex space-x-4">
              {userProfile?.role === "admin" ? (
                <>
                  <li>
                    <Link
                      to="/users"
                      className="text-gray-700 hover:text-blue-500"
                    >
                      Users
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/batches"
                      className="text-gray-700 hover:text-blue-500"
                    >
                      Batches
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/tests"
                      className="text-gray-700 hover:text-blue-500"
                    >
                      Tests
                    </Link>
                  </li>
                </>
              ) : null}
               {userProfile?.role === "student" ? (
                <>
                  <li>
                    <Link
                      to="/my-tests"
                      className="text-gray-700 hover:text-blue-500"
                    >
                      My Tests
                    </Link>
                  </li>
                </>
              ) : null}
              <li>
                <button
                  className="text-gray-700 hover:text-blue-500"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <ul className="flex space-x-4">
              <li>
                <Link
                  to={isAdmin ? "/login" : "/admin-login"}
                  className="text-gray-700 hover:text-blue-500"
                >
                  {isAdmin ? "User Login" : "Admin Login"}
                </Link>
              </li>
              {isAdmin ? (
                <li>
                  <Link
                    to="/admin-register"
                    className="text-gray-700 hover:text-blue-500"
                  >
                    Admin Register
                  </Link>
                </li>
              ) : null}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
