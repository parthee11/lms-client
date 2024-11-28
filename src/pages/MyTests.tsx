import { useEffect, useState } from "react";
import {
  getMyTests,
  getTestHistory,
} from "../app/controllers/tests/testController"; // API call to fetch user's tests
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import { setMyTests } from "../app/features/my-tests/myTestsSlice"; // Redux action to set tests
import { selectMyTests } from "../app/features/my-tests/myTestsSelector"; // Selector to get tests from state
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, History, LoaderCircle, Play } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";

const MyTests = () => {
  const dispatch = useDispatch();
  const myTests = useSelector(selectMyTests);

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [historyTestId, setHistoryTestId] = useState(null);
  const [historyData, setHistoryData] = useState(null);

  useEffect(() => {
    fetchMyTests();
  }, []);

  useEffect(() => {
    const fetchHistory = async (testId: string) => {
      try {
        const response = await getTestHistory(testId);
        const data = response?.data?.data;
        setHistoryData(data);
      } catch (error) {
        console.log("Error fetching test results history >>>", error);
      }
    };

    if (historyTestId) {
      fetchHistory(historyTestId);
    }
  }, [historyTestId]);

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
                    {test?.hasHistory ? (
                      <Button
                        variant={"secondary"}
                        onClick={() => {
                          setHistoryData(null);
                          setHistoryTestId(test?._id);
                          setIsHistoryOpen(true);
                        }}
                      >
                        <History className="w-4 h-4" />
                      </Button>
                    ) : null}
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

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="w-full max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex gap-2 items-center">
              <span>Your test results</span>
            </DialogTitle>
            <DialogDescription className="text-sm">
              Check how you did previously in the test ;)
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm">
            {historyData && historyData?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>Score</TableCell>
                    <TableCell>Percentage</TableCell>
                    <TableCell>Total Questions</TableCell>
                    <TableCell>Answered</TableCell>
                    <TableCell>Unanswered</TableCell>
                    <TableCell>Result</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData?.map((history) => (
                    <TableRow>
                      <TableCell>
                        {history.total_score} / {history.max_score}
                      </TableCell>
                      <TableCell>50%</TableCell>
                      <TableCell>{history.total_questions}</TableCell>
                      <TableCell>{history.total_answered}</TableCell>
                      <TableCell>{history.total_unanswered}</TableCell>
                      <TableCell>
                        <div
                          className={`${buttonVariants({
                            variant: "secondary",
                          })} ${
                            history.test_result
                              ? "!bg-green-400"
                              : "!bg-red-400"
                          }  !text-white`}
                        >
                          {history.test_result ? "Pass" : "Fail"}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="my-10 flex items-center justify-center">
                <LoaderCircle className="w-24 h-24 animate-spin" />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MyTests;
