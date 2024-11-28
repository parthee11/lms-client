import { useEffect } from "react";
import { getUsers, deleteUser } from "../app/controllers/user/userController"; // Add deleteUser import
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../app/features/user/userSlice";
import { selectUsers } from "../app/features/user/userSelector";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

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

      <div className="px-4">
        <Link
          to={"/dashboard"}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <h1 className="font-bold text-2xl px-4 mt-10">Students</h1>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Username</TableHead>
              <TableHead className="w-[100px]">Email</TableHead>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Age</TableHead>
              <TableHead className="w-[100px]">Gender</TableHead>
              <TableHead className="w-[100px]">Phone</TableHead>
              <TableHead className="w-[100px]">Role</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.length ? (
              users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>
                    <Link
                      to={`/users/${user._id}`}
                      state={{ user }}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {user.username}
                    </Link>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.profile.name}</TableCell>
                  <TableCell>{user.profile.age}</TableCell>
                  <TableCell>{user.profile.gender}</TableCell>
                  <TableCell>{user.profile.phone}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant={"secondary"}
                      onClick={() => handleEdit(user)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={"secondary"}
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No students found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Users;
