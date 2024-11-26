import { useEffect } from "react";
import { deleteTest, getTests } from "../app/controllers/tests/testController"; // Add your API call for fetching tests
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { setTests } from "../app/features/tests/testsSlice";
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

const Tests = () => {
  const dispatch = useDispatch();
  const tests = useSelector(selectTests);
  const navigate = useNavigate(); // For navigation on edit

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

  const handleEdit = (test) => {
    // Navigate to an edit page or pass test data to a form
    navigate(`/update?type=test`, { state: { test } });
  };

  const handleDelete = async (testId: string) => {
    try {
      await deleteTest(testId);
      fetchTests();
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

      <h1 className="font-bold text-2xl px-4 mt-10">Tests</h1>

      <div className="p-4 w-2/3">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Number of Questions</TableHead>
              <TableHead className="w-[100px]">Duration</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tests ? (
              tests.map((test) => (
                <TableRow key={test._id}>
                  <TableCell>
                    {/* <Link
                      to={"/"}
                      className={buttonVariants({ variant: "ghost" })}
                    > */}
                    {test?.test_name}
                    {/* </Link> */}
                  </TableCell>
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
                <TableCell>No tests found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Tests;
