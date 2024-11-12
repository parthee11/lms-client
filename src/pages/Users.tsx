import { useEffect } from "react";
import { getUsers, deleteUser } from "../app/controllers/user/userController"; // Add deleteUser import
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../app/features/user/userSlice";
import { selectUsers } from "../app/features/user/userSelector";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const navigate = useNavigate(); // For navigation on edit

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      console.log("users >>>", response);
      dispatch(setUsers(response?.data?.data?.students));
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  const handleEdit = (user) => {
    // Navigate to an edit page or pass user data to a form
    navigate(`/update?type=user`, { state: { user } });
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId); // Assuming deleteUser is an API call
      fetchUsers(); // Refresh the list after deletion
    } catch (error) {
      console.log("Error deleting user >>>", error);
    }
  };

  return (
    <>
      <Header isAdmin={true} />
      <div>
        {users && users.length > 0 && (
          <div className="mt-8 px-8">
            <h3 className="text-xl font-semibold mb-4">Users</h3>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border border-gray-300 p-2">Username</th>
                  <th className="border border-gray-300 p-2">Email</th>
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Age</th>
                  <th className="border border-gray-300 p-2">Gender</th>
                  <th className="border border-gray-300 p-2">Phone</th>
                  <th className="border border-gray-300 p-2">Role</th>
                  <th className="border border-gray-300 p-2">Actions</th> {/* New Actions Column */}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="border border-gray-300 p-2">
                      <Link to={`/users/${user._id}`} state={{ user }}>
                        {user.username}
                      </Link>
                    </td>
                    <td className="border border-gray-300 p-2">{user.email}</td>
                    <td className="border border-gray-300 p-2">
                      {user.profile.name}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {user.profile.age}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {user.profile.gender}
                    </td>
                    <td className="border border-gray-300 p-2">
                      {user.profile.phone}
                    </td>
                    <td className="border border-gray-300 p-2">{user.role}</td>
                    <td className="border border-gray-300 p-2 flex gap-2">
                    <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 text-white p-2 rounded flex items-center gap-1"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 text-white p-2 rounded flex items-center gap-1"
                      >
                        <FaTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
