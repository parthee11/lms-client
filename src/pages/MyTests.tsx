import { useEffect, useState } from "react";
import {
  getMyTests,
  getTestHistory,
} from "../app/controllers/tests/testController"; // API call to fetch user's tests
import { useDispatch, useSelector } from "react-redux";
import Header from "../components/common/Header";
import { Link } from "react-router-dom";
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
import { Test } from "@/app/features/tests/testsSlice";
import { useTranslation } from "react-i18next"; // Import for translation

interface TestHistory {
  total_score: number;
  max_score: number;
  total_questions: number;
  total_answered: number;
  total_unanswered: number;
  test_result: boolean;
}

const MyTests = () => {
  const dispatch = useDispatch();
  const myTests = useSelector(selectMyTests);
  const { t } = useTranslation(); // Initialize translation hook

  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [historyTestId, setHistoryTestId] = useState<string | null>(null);
  const [historyData, setHistoryData] = useState<TestHistory[] | null>(null);

  useEffect(() => {
    fetchMyTests();
  }, []);

  // Handle modal close - reset history data
  useEffect(() => {
    if (!isHistoryOpen) {
      setHistoryData(null);
    }
  }, [isHistoryOpen]);

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

    // Fetch history when modal is open and we have a test ID
    if (historyTestId && isHistoryOpen) {
      fetchHistory(historyTestId);
    }
  }, [historyTestId, isHistoryOpen]);

  const fetchMyTests = async () => {
    try {
      const response = await getMyTests();
      dispatch(setMyTests(response?.data?.data));
    } catch (error) {
      console.log("Error fetching my tests >>>", error);
    }
  };

  const handleTakeTest = (test: Test) => {
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
      alert(t("popup_blocked"));
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

      <h1 className="font-bold text-2xl px-4 mt-10">{t("my_tests")}</h1>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t("test_name")}</TableHead>
              <TableHead className="w-[100px]">{t("positive_scoring")}</TableHead>
              <TableHead className="w-[100px]">{t("negative_scoring")}</TableHead>
              <TableHead className="w-[100px]">{t("number_of_questions")}</TableHead>
              <TableHead className="w-[100px]">{t("duration")}</TableHead>
              <TableHead className="w-[100px]">{t("actions")}</TableHead>
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
                  <TableCell>{test?.timing} {t("minutes")}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant={"secondary"}
                      onClick={() => handleTakeTest(test)}
                    >
                      <Play className="w-4 h-4" /> {t("take_test")}
                    </Button>
                    {test?.hasHistory ? (
                      <Button
                        variant={"secondary"}
                        onClick={() => {
                          // First open the modal, then set the test ID to trigger the fetch
                          setIsHistoryOpen(true);
                          setHistoryTestId(test?._id);
                        }}
                      >
                        <History className="w-4 h-4" /> {t("view_history")}
                      </Button>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>{t("no_tests_found")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog 
        open={isHistoryOpen} 
        onOpenChange={(open) => {
          setIsHistoryOpen(open);
          // If dialog is closing, we don't need to do anything else
          // The useEffect will handle clearing the data
        }}
      >
        <DialogContent className="w-full max-w-[650px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex gap-2 items-center">
              <span>{t("your_test_results")}</span>
            </DialogTitle>
            <DialogDescription className="text-sm">
              {t("check_how_you_did")}
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm">
            {historyData && historyData?.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableCell>{t("score_2")}</TableCell>
                    <TableCell>{t("percentage")}</TableCell>
                    <TableCell>{t("total_questions_2")}</TableCell>
                    <TableCell>{t("answered")}</TableCell>
                    <TableCell>{t("unanswered")}</TableCell>
                    <TableCell>{t("result")}</TableCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData?.map((history, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {history.total_score} / {history.max_score}
                      </TableCell>
                      <TableCell>
                        {history.max_score > 0 
                          ? `${Math.round((history.total_score / history.max_score) * 100)}%` 
                          : '0%'}
                      </TableCell>
                      <TableCell>{history.total_questions || (history.total_answered + history.total_unanswered)}</TableCell>
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
                          {history.test_result ? t("pass") : t("fail")}
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
