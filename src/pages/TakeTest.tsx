import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  questionStateUpdate,
  startTest,
  submitTest,
} from "../app/controllers/tests/testController";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  CornerDownLeft,
  Flag,
  LoaderCircle,
  TriangleAlert,
} from "lucide-react";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Test } from "@/app/features/tests/testsSlice";
import { useTranslation } from "react-i18next"; // Import translation hook

type QuestionState = "unanswered" | "answered" | "review" | "flagged";

type Result = {
  totalScore: number;
  totalQuestions: number;
  maxScore: number;
  totalAnswered: number;
  totalUnanswered: number;
  testResult: string;
};

type SubmissionModalProps = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  loading: boolean;
  result: Result | null;
};

type QuestionsScreenProps = {
  test: Test;
  currentQuestionIndex: number;
  setCurrentQuestionIndex: React.Dispatch<React.SetStateAction<number>>;
  selectedAnswers: Record<string, string>;
  questionStates: Record<string, QuestionState>;
  handleOptionSelect: (questionId: string, optionKey: string) => void;
  updateQuestionState: (questionId: string, state: QuestionState) => void;
  handlePrevQuestion: () => void;
  handleSaveQuestion: (questionId: string) => void;
  handleSaveAndNextQuestion: (questionId: string) => void;
  handleSubmitTest: () => void;
  timer: number | null;
  formatTime: (seconds: number) => string;
};

type TakeTestProps = object;

const TakeTest: React.FC<TakeTestProps> = () => {
  const { testId } = useParams<{ testId: string }>();
  const [currentScreen, setCurrentScreen] = useState<
    "instructions" | "questions"
  >("instructions");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const [test, setTest] = useState<Test | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isConfrimationModalOpen, setIsConfrimationModalOpen] = useState(false);

  const { t } = useTranslation();

  useEffect(() => {
    const testState = localStorage.getItem("testState");
    if (testState) {
      setTest(JSON.parse(testState));
    }
  }, []);

  const [questionStates, setQuestionStates] = useState<
    Record<string, QuestionState>
  >(
    test?.questions.reduce(
      (acc, question) => ({
        ...acc,
        [question._id]: "unanswered",
      }),
      {}
    ) || {}
  );

  const [timer, setTimer] = useState<number | null>(null);

  const [submissionLoading, setSubmissionLoading] = useState(true);
  const [testResult, setTestResult] = useState<Result | null>(null);

  useEffect(() => {
    const handleBeforeUnload = () => {
      window.stop();
    };

    if (currentScreen === "questions") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentScreen]);

  const handleSubmitConfirmation = useCallback(async () => {
    setIsConfrimationModalOpen(false);
    setIsSubmissionModalOpen(true);
    try {
      const testresultId = localStorage.getItem("testresultId");
      const response = await submitTest(testresultId as string);
      setTimeout(() => {
        setSubmissionLoading(false);
        const rawResult = response?.data?.data;
        const result = {
          totalScore: rawResult.total_score || 0,
          totalQuestions: rawResult.total_questions || 0,
          maxScore: rawResult.max_score || 0,
          totalAnswered: rawResult.total_answered || 0,
          totalUnanswered: rawResult.total_unanswered || 0,
          testResult: rawResult.test_result || false,
        };
        setTestResult(result);
        setTimeout(() => {
          localStorage.removeItem("testresultId");
          localStorage.removeItem("testState");
          window.close();
        }, 10000);
      }, 3000);
    } catch (error) {
      setSubmissionLoading(false);
      console.log("Error submitting the test >>>", error);
    }
  }, [setIsConfrimationModalOpen, setIsSubmissionModalOpen, setSubmissionLoading, setTestResult]);

  useEffect(() => {
    if (timer !== null) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(countdown);
            setIsSubmissionModalOpen(true);
            handleSubmitConfirmation();
            return 0;
          }
        });
      }, 1000);

      return () => clearInterval(countdown);
    }
  }, [timer, handleSubmitConfirmation]);

  if (!test) {
    return <div>{t("no_test_details_found")}</div>; // Translate the "No test details found" message
  }

  const { timing, questions = [] } = test;

  const handleStartTest = async () => {
    try {
      if (testId) {
        const response = await startTest(testId);
        const data = response?.data?.data;
        localStorage.setItem("testresultId", data?._id);
        setCurrentScreen("questions");
        setTimer(timing * 60);
      }
    } catch (error) {
      console.log("There was a problem starting the test >>>", error);
    }
  };

  const handleSaveAndNextQuestion = (questionId: string) => {
    updateQuestionState(questionId, "answered");
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handleSaveQuestion = (questionId: string) => {
    updateQuestionState(questionId, "answered");
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitTest = () => {
    const questionStatesLen = Object.values(questionStates).length;
    const questionsLen = questions.length;

    if (questionStatesLen === questionsLen) {
      setIsSubmissionModalOpen(true);
      handleSubmitConfirmation();
    } else {
      setIsConfrimationModalOpen(true);
    }
  };

  const handleOptionSelect = (questionId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const updateQuestionState = async (
    questionId: string,
    state: QuestionState
  ) => {
    const testresultId = localStorage.getItem("testresultId");
    try {
      await questionStateUpdate(
        testresultId as string,
        questionId,
        selectedAnswers[questionId],
        state
      );
    } catch (error) {
      console.log("Error >>>", error);
    }

    setQuestionStates((prev) => ({
      ...prev,
      [questionId]: state,
    }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="p-4 relative">
      {currentScreen === "instructions" ? (
        <Instructions test={test} handleStartTest={handleStartTest} />
      ) : (
        <QuestionsScreen
          test={test}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={setCurrentQuestionIndex}
          selectedAnswers={selectedAnswers}
          questionStates={questionStates}
          handleOptionSelect={handleOptionSelect}
          updateQuestionState={updateQuestionState}
          handlePrevQuestion={handlePrevQuestion}
          handleSaveAndNextQuestion={handleSaveAndNextQuestion}
          handleSaveQuestion={handleSaveQuestion}
          handleSubmitTest={handleSubmitTest}
          timer={timer}
          formatTime={formatTime}
        />
      )}

      <ConfirmationModal
        isOpen={isConfrimationModalOpen}
        setIsOpen={setIsConfrimationModalOpen}
        handleSubmitConfirmation={handleSubmitConfirmation}
      />
      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        setIsOpen={setIsSubmissionModalOpen}
        loading={submissionLoading}
        result={testResult}
      />
    </div>
  );
};

export default TakeTest;

const Instructions = ({
  test,
  handleStartTest,
}: {
  test: Test;
  handleStartTest: () => void;
}) => {
  const { t } = useTranslation(); // Initialize the translation hook
  const {
    test_name,
    timing,
    positive_scoring,
    negative_scoring,
    questions = [],
  } = test;

  return (
    <div className="instructions-screen">
      <Card>
        <CardHeader className="flex justify-center items-center">
          <CardTitle>
            <h1 className="font-bold text-2xl">
              {t("instructions_for", { test_name })}
            </h1>
          </CardTitle>
        </CardHeader>
      </Card>
      <ul className="list-disc pl-6 mb-4 space-y-2 mt-10">
        <li>{t("total_questions", { totalQuestions: questions.length })}</li>
        <li>{t("time_limit", { minutes: timing })}</li>
        <li>{t("positive_scoring_2", { score: positive_scoring })}</li>
        <li>{t("negative_scoring_2", { score: negative_scoring })}</li>
        <li>{t("test_timing")}</li>
        <li>{t("auto_submit_refresh")}</li>
        <li>{t("stable_internet")}</li>
        <li>{t("no_refresh")}</li>
        <li>{t("read_questions")}</li>
        <li>{t("answers_final")}</li>
        <li>{t("track_timer")}</li>
      </ul>
      <div className="text-center">
        <Button onClick={handleStartTest}>{t("start_test")}</Button>
      </div>
    </div>
  );
};

const QuestionsScreen = ({
  test,
  currentQuestionIndex,
  setCurrentQuestionIndex,
  selectedAnswers,
  questionStates,
  handleOptionSelect,
  updateQuestionState,
  handlePrevQuestion,
  handleSaveQuestion,
  handleSaveAndNextQuestion,
  handleSubmitTest,
  timer,
  formatTime,
}: QuestionsScreenProps) => {
  const { t } = useTranslation();
  const { questions, test_name } = test;

  const getButtonColor = (state: QuestionState, isSelected: boolean) => {
    const baseClass = isSelected ? "outline outline-2 outline-black" : "";
    switch (state) {
      case "answered":
        return `${baseClass} bg-green-400 text-white hover:bg-green-300`;
      case "review":
        return `${baseClass} bg-orange-400 text-white hover:bg-orange-300`;
      case "flagged":
        return `${baseClass} bg-red-400 text-white hover:bg-red-300`;
      default:
        return `${baseClass} bg-gray-100 text-gray-800 hover:bg-gray-50`;
    }
  };

  return (
    <div className="questions-screen flex flex-col h-[90vh]">
      <div>
        <Card>
          <CardHeader className="flex justify-center items-center relative">
            <CardTitle className="text-center">
              <h1 className="font-bold text-2xl">{test_name}</h1>
            </CardTitle>
            {timer !== null && (
              <div
                className={`${buttonVariants({
                  variant: "outline",
                })} absolute right-6`}
              >
                {t("timer")}: {formatTime(timer)}
              </div>
            )}
          </CardHeader>
        </Card>
      </div>

      <div className="flex mt-10 flex-1 items-stretch justify-stretch">
        {/* question */}
        <div className="flex-1 p-4">
          <h2 className="text-lg font-bold mb-2">
            {t("question")} {currentQuestionIndex + 1}
          </h2>

          <div className="question mb-4">
            <p className="font-semibold">
              {questions[currentQuestionIndex].question}
            </p>
            <ul className="options-list mt-2 flex flex-col gap-2">
              {questionStates[questions[currentQuestionIndex]._id] ===
                "answered" && (
                <span className="flex gap-2 text-green-900 text-xs border border-green-500 bg-green-200 rounded-sm p-1">
                  <CircleCheck className="w-4 h-4 text-green-900" />
                  {t("you_have_answered")}
                </span>
              )}
              {questionStates[questions[currentQuestionIndex]._id] ===
                "flagged" && (
                <span className="flex gap-2 text-red-900 text-xs border border-red-500 bg-red-200 rounded-sm p-1">
                  <CircleCheck className="w-4 h-4 text-red-900" />
                  {t("you_have_flagged")}
                </span>
              )}
              {questions[currentQuestionIndex].options.map((option) => (
                <li key={option._id}>
                  <label
                    htmlFor={option.value}
                    className="flex gap-2 font-normal text-sm"
                  >
                    <input
                      type="radio"
                      disabled={
                        questionStates[questions[currentQuestionIndex]._id] ===
                        "answered"
                      }
                      name={`question-${questions[currentQuestionIndex]._id}`}
                      value={option.key}
                      checked={
                        selectedAnswers[questions[currentQuestionIndex]._id] ===
                        option._id
                      }
                      onChange={() =>
                        handleOptionSelect(
                          questions[currentQuestionIndex]._id,
                          option._id
                        )
                      }
                    />
                    {option.value}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* questions access */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("all_questions")}</CardTitle>
              <CardDescription>{t("switch_questions")}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-4 gap-4 p-4 h-full">
              {questions.map((question, index) => (
                <Button
                  key={question._id}
                  className={`${getButtonColor(
                    questionStates[question._id],
                    currentQuestionIndex === index
                  )}`}
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  Q{index + 1}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="buttons flex gap-2">
        {currentQuestionIndex > 0 && (
          <Button onClick={handlePrevQuestion} variant={"outline"}>
            <ChevronLeft className="w-4 h-4" />
            {t("previous")}
          </Button>
        )}
        {currentQuestionIndex < questions.length - 1 ? (
          <>
            {questionStates[questions[currentQuestionIndex]._id] !==
              "answered" && (
              <Button
                onClick={() =>
                  handleSaveAndNextQuestion(questions[currentQuestionIndex]._id)
                }
                disabled={!selectedAnswers[questions[currentQuestionIndex]._id]}
              >
                {t("save_and_next")}
              </Button>
            )}
          </>
        ) : (
          <>
            {questionStates[questions[currentQuestionIndex]._id] !==
              "answered" && (
              <Button
                onClick={() =>
                  handleSaveQuestion(questions[currentQuestionIndex]._id)
                }
                disabled={!selectedAnswers[questions[currentQuestionIndex]._id]}
              >
                {t("save")}
              </Button>
            )}
            <Button
              onClick={() => {
                handleSubmitTest();
              }}
              className="bg-green-500 hover:bg-green-400"
            >
              {t("submit_test")}
            </Button>
          </>
        )}
        {currentQuestionIndex < questions.length - 1 && (
          <Button
            onClick={() =>
              setCurrentQuestionIndex((prev) =>
                Math.min(prev + 1, questions.length - 1)
              )
            }
            variant={"outline"}
          >
            <ChevronRight className="w-4 h-4" />
            {t("next")}
          </Button>
        )}

        {questionStates[questions[currentQuestionIndex]._id] !== "answered" && (
          <>
            <span className="h-full inline-block border-l mx-4"></span>
            <Button
              onClick={() =>
                updateQuestionState(
                  questions[currentQuestionIndex]._id,
                  "review"
                )
              }
              className="bg-orange-400 hover:bg-orange-300"
            >
              {t("review")}
              <CornerDownLeft className="w-4 h-4" />
            </Button>
          </>
        )}

        {questionStates[questions[currentQuestionIndex]._id] === "answered" && (
          <>
            <span className="h-full inline-block border-l mx-4"></span>
            <Button
              onClick={() =>
                updateQuestionState(
                  questions[currentQuestionIndex]._id,
                  "flagged"
                )
              }
              variant={"destructive"}
            >
              {t("flagged")}
              <Flag className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const SubmissionModal = ({
  isOpen,
  setIsOpen,
  loading,
  result,
}: SubmissionModalProps) => {
  const { t } = useTranslation();
  const {
    totalScore,
    totalQuestions,
    maxScore,
    totalAnswered,
    totalUnanswered,
    testResult,
  } = result || {};

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(true)}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="[&>button]:hidden"
      >
        <div className="flex justify-center items-center flex-col">
          {loading ? (
            <>
              <div className="text-sm">{t("your_test_is_being_evaluated")}</div>
              <div className="my-10">
                <LoaderCircle className="w-24 h-24 animate-spin" />
              </div>
            </>
          ) : (
            <div className="flex gap-4 flex-col">
              <h2
                className={`text-xl font-bold ${
                  testResult ? "text-green-500" : "text-red-500"
                }`}
              >
                {testResult ? t("you_passed") : t("better_luck_next_time")}
              </h2>
              <div className="flex flex-col gap-2">
                <Card className="rounded-xl overflow-hidden w-[50px] h-[50px]">
                  <img
                    src={
                      testResult
                        ? "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Adrian"
                        : "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Ryan"
                    }
                    alt={testResult ? "Success" : "Failure"}
                    className="h-[50px] w-[50px] object-cover"
                  />
                </Card>

                <div className="space-y-2">
                  <p>
                    <strong>{t("score", { totalScore, maxScore })}</strong>
                  </p>
                  <p>
                    <strong>{t("total_questions", { totalQuestions })}</strong>
                  </p>
                  <p>
                    <strong>{t("total_answered", { totalAnswered })}</strong>
                  </p>
                  <p>
                    <strong>{t("total_unanswered", { totalUnanswered })}</strong>
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

type ConfirmationModalType = {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmitConfirmation: () => void;
};

const ConfirmationModal = ({
  isOpen,
  setIsOpen,
  handleSubmitConfirmation,
}: ConfirmationModalType) => {
  const { t } = useTranslation();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex gap-2 items-center">
            <span>{t("test_incomplete")}</span>{" "}
            <TriangleAlert className="w-4 h-4" />
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm">{t("confirmation_message")}</div>
        <DialogFooter>
          <Button variant={"destructive"} onClick={handleSubmitConfirmation}>
            {t("submit")}
          </Button>
          <Button variant={"outline"} onClick={() => setIsOpen(false)}>{t("cancel")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
