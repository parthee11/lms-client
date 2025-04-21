import { useEffect } from "react";
import { getUsers, deleteUser } from "../app/controllers/user/userController";
import { useDispatch, useSelector } from "react-redux";
import { setUsers } from "../app/features/user/userSlice";
import { selectUsers } from "../app/features/user/userSelector";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { CreateEntityFormValues } from "@/components/forms/UserForm";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector(selectUsers);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      dispatch(setUsers(response?.data?.data?.students));
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  const handleEdit = (user: CreateEntityFormValues) => {
    navigate(`/update?type=user`, { state: { user } });
  };

  const handleDelete = async (userId: string) => {
    try {
      await deleteUser(userId);
      toast.success(t("student_deleted_success"));
      fetchUsers();
    } catch (error) {
      toast.error(t("student_delete_error"));
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

      <h1 className="font-bold text-2xl px-4 mt-10">{t("students")}</h1>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t("username")}</TableHead>
              <TableHead className="w-[100px]">{t("email")}</TableHead>
              <TableHead className="w-[100px]">{t("name")}</TableHead>
              <TableHead className="w-[100px]">{t("age")}</TableHead>
              <TableHead className="w-[100px]">{t("gender")}</TableHead>
              <TableHead className="w-[100px]">{t("phone")}</TableHead>
              <TableHead className="w-[100px]">{t("role")}</TableHead>
              <TableHead className="w-[100px]">{t("actions")}</TableHead>
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
                      onClick={() => handleDelete(user._id as string)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>{t("no_students_found")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Users;
