import { useEffect } from "react";
import { getMyTests } from "../app/controllers/tests/testController"; // API call to fetch user's tests
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { setMyTests } from "../app/features/my-tests/myTestsSlice"; // Redux action to set tests
import { selectMyTests } from "../app/features/my-tests/myTestsSelector"; // Selector to get tests from state
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Play } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const MyTests = () => {
  const dispatch = useDispatch();
  const myTests = useSelector(selectMyTests);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyTests();
  }, []);

  const fetchMyTests = async () => {
    try {
      const response = await getMyTests();
      console.log("myTests >>>", response?.data?.data);
      dispatch(setMyTests(response?.data?.data));
    } catch (error) {
      console.log("Error fetching my tests >>>", error);
    }
  };

  const handleTakeTest = (test) => {
    const testUrl = `/my-tests/take/${test._id}`;
    const fullUrl = `${window.location.origin}${testUrl}`;
    const windowFeatures =
      "fullscreen=yes, width=" + screen.width + ", height=" + screen.height;

    const newWindow = window.open(fullUrl, "_blank", windowFeatures);
    if (newWindow) {
      // Pass state data to the new window using localStorage
      localStorage.setItem("testState", JSON.stringify(test));
      newWindow.focus();
    } else {
      alert("Please allow popups for this website");
    }
  };

  return (
    <>
      <Header isAdmin={false} />

      <div className="px-4">
        <Link
          to={"/dashboard"}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <h1 className="font-bold text-2xl px-4 mt-10">My Tests</h1>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Test Name</TableHead>
              <TableHead className="w-[100px]">Positive Scoring</TableHead>
              <TableHead className="w-[100px]">Negative Scoring</TableHead>
              <TableHead className="w-[100px]">Number of Questions</TableHead>
              <TableHead className="w-[100px]">Duration</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myTests?.length ? (
              myTests.map((test) => (
                <TableRow key={test._id}>
                  <TableCell>
                    <strong>{test?.test_name}</strong>
                  </TableCell>
                  <TableCell>{test?.positive_scoring}</TableCell>
                  <TableCell>{test?.negative_scoring}</TableCell>
                  <TableCell>{test?.questions?.length}</TableCell>
                  <TableCell>{test?.timing} minutes</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant={"secondary"}
                      onClick={() => handleTakeTest(test)}
                    >
                      <Play className="w-4 h-4" /> Take Test
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No tests found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default MyTests;
