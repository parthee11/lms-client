import { useEffect } from "react";
import { deleteTest, getTests } from "../app/controllers/tests/testController";
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { setTests, Test } from "../app/features/tests/testsSlice";
import { selectTests } from "../app/features/tests/testsSelector";
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
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const Tests = () => {
  const dispatch = useDispatch();
  const tests = useSelector(selectTests);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    fetchTests();
  }, []);

  const fetchTests = async () => {
    try {
      const response = await getTests();
      dispatch(setTests(response?.data?.data));
    } catch (error) {
      console.log("Error fetching tests >>>", error);
    }
  };

  const handleEdit = (test: Test) => {
    navigate(`/update?type=test`, { state: { test } });
  };

  const handleDelete = async (testId: string) => {
    try {
      await deleteTest(testId);
      toast.success(t("test_deleted_success"));
      fetchTests();
    } catch (error) {
      toast.error(t("test_delete_error"));
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

      <h1 className="font-bold text-2xl px-4 mt-10">{t("tests")}</h1>

      <div className="p-4 w-2/3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t("name")}</TableHead>
              <TableHead className="w-[100px]">{t("number_of_questions")}</TableHead>
              <TableHead className="w-[100px]">{t("duration")}</TableHead>
              <TableHead className="w-[100px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests?.length ? (
              tests.map((test) => (
                <TableRow key={test._id}>
                  <TableCell>{test?.test_name}</TableCell>
                  <TableCell>{test?.questions?.length}</TableCell>
                  <TableCell>{test?.timing}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant={"secondary"}
                      onClick={() => handleEdit(test)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={"secondary"}
                      onClick={() => handleDelete(test._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4}>{t("no_tests_found")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Tests;
