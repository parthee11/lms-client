import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

interface Option {
  key: number;
  value: string;
}

interface Question {
  _id: string;
  question: string;
  options: Option[];
  correct_answer: number;
  reasoning: string;
  tags: { _id: string; tag_name: string; count: number }[];
}

interface Test {
  _id: string;
  test_name: string;
  timing: number;
  positive_scoring: number;
  negative_scoring: number;
  questions: Question[];
}

type QuestionState = "unanswered" | "answered" | "review" | "flagged";

const TakeTest = () => {
  const { testId } = useParams<{ testId: string }>();
  const [currentScreen, setCurrentScreen] = useState<
    "instructions" | "questions"
  >("instructions");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const [test, setTest] = useState(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false);
  const [isConfrimationModalOpen, setIsConfrimationModalOpen] = useState(false);

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
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      window.stop();
    };

    if (currentScreen === "questions") {
      window.addEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [currentScreen]);

  useEffect(() => {
    if (timer !== null) {
      const countdown = setInterval(() => {
        setTimer((prev) => (prev && prev > 0 ? prev - 1 : 0));
      }, 1000);

      if (timer === 0) {
        clearInterval(countdown);
        setIsSubmissionModalOpen(true);
        handleSubmitConfirmation();
      }

      return () => clearInterval(countdown);
    }
  }, [timer]);

  if (!test) {
    return <div>No test details found.</div>;
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

    // navigate("/my-tests");
  };

  const handleOptionSelect = (questionId: string, optionKey: string) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleSubmitConfirmation = async () => {
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
      // console.log("subimitting");
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

      <ConfimationModal
        isOpen={isConfrimationModalOpen}
        setIsOpen={setIsConfrimationModalOpen}
        handleSubmitConfirmation={handleSubmitConfirmation}
      />
      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        setIsOpen={setIsSubmissionModalOpen}
        loading={submissionLoading}
        result={testResult || {}}
      />
    </div>
  );
};

export default TakeTest;

const Instructions = ({ test, handleStartTest }) => {
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
            <h1 className="font-bold text-2xl">Instructions for {test_name}</h1>
          </CardTitle>
        </CardHeader>
      </Card>
      <ul className="list-disc pl-6 mb-4 space-y-2 mt-10">
        <li>
          <strong>Total Questions:</strong> {questions.length}
        </li>
        <li>
          <strong>Time limit:</strong> {timing} minutes
        </li>
        <li>
          <strong>Positive scoring:</strong> {positive_scoring} points per
          correct answer
        </li>
        <li>
          <strong>Negative scoring:</strong> {negative_scoring} points per
          incorrect answer
        </li>
        <li>
          <strong>Test timing:</strong> The test will be automatically submitted
          when the timer runs out, from whichever state it was in.
        </li>
        <li>
          <strong>Auto-submit on refresh/leave:</strong> Refreshing or leaving
          the page will result in your test being automatically submitted.
        </li>
        <li>Ensure you have a stable internet connection during the test.</li>
        <li>
          Do not refresh or navigate away from the page once the test starts.
        </li>
        <li>Read each question carefully before answering.</li>
        <li>
          Once submitted, answers cannot be changed, so review your answers
          before the timer ends.
        </li>
        <li>
          Keep track of the timer displayed on the screen during the test.
        </li>
      </ul>
      <div className="text-center">
        <Button onClick={handleStartTest}>Start Test</Button>
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
}) => {
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
          <CardHeader className="flex justify-center items-cente relative">
            <CardTitle className="text-center">
              <h1 className="font-bold text-2xl">{test_name}</h1>
            </CardTitle>
            {timer !== null && (
              <div
                className={`${buttonVariants({
                  variant: "outline",
                })} absolute right-6`}
              >
                Timer: {formatTime(timer)}
              </div>
            )}
          </CardHeader>
        </Card>
      </div>

      <div className="flex mt-10 flex-1 items-stretch justify-stretch">
        {/* question */}
        <div className="flex-1 p-4">
          <h2 className="text-lg font-bold mb-2">
            Question {currentQuestionIndex + 1}
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
                  You have answered this question
                </span>
              )}
              {questionStates[questions[currentQuestionIndex]._id] ===
                "flagged" && (
                <span className="flex gap-2 text-red-900 text-xs border border-red-500 bg-red-200 rounded-sm p-1">
                  <CircleCheck className="w-4 h-4 text-red-900" />
                  You have flagged this question
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
              <CardTitle>All Questions</CardTitle>
              <CardDescription>
                Quickly switch between questions from here.
              </CardDescription>
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
                Save & Next
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
                Save
              </Button>
            )}
            <Button
              onClick={() => {
                handleSubmitTest(questions[currentQuestionIndex]._id);
              }}
              className="bg-green-500 hover:bg-green-400"
            >
              Submit Test
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
              <Flag className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

const SubmissionModal = ({ isOpen, setIsOpen, loading, result }) => {
  const {
    totalScore,
    totalQuestions,
    maxScore,
    totalAnswered,
    totalUnanswered,
    testResult,
  } = result;

  return (
    <Dialog open={isOpen} onOpenChange={() => setIsOpen(true)}>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="[&>button]:hidden"
      >
        <div className="flex justify-center items-center flex-col">
          {loading ? (
            <>
              <div className="text-sm">
                Your test is being evaluated. Please wait.
              </div>

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
                {testResult
                  ? "Hooray! You passed the test."
                  : "Better luck next time!"}
              </h2>
              <div className="flex flex-col gap-2">
                <Card className="rounded-xl overflow-hidden w-[50px] h-[50px]">
                  <img
                    src={
                      testResult
                        ? "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Adrian"
                        : "https://api.dicebear.com/9.x/fun-emoji/svg?seed=Ryan"
                    }
                    alt="user-avatar"
                    className="h-[50px] w-[50px] object-cover"
                  />
                </Card>

                <div className="space-y-2">
                  <p>
                    <strong>Score:</strong> {totalScore}/ {maxScore}
                  </p>
                  <p>
                    <strong>Total Questions:</strong> {totalQuestions}
                  </p>
                  <p>
                    <strong>Total Answered:</strong> {totalAnswered}
                  </p>
                  <p>
                    <strong>Total Unanswered:</strong> {totalUnanswered}
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

const ConfimationModal = ({ isOpen, setIsOpen, handleSubmitConfirmation }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex gap-2 items-center">
            <span>Test incomplete</span> <TriangleAlert className="w-4 h-4" />
          </DialogTitle>
        </DialogHeader>
        <div className="text-sm">
          You have not answered all the questions. Are you sure to continue
          submitting the test?
        </div>
        <DialogFooter>
          <Button variant={"destructive"} onClick={handleSubmitConfirmation}>
            Submit
          </Button>
          <Button variant={"outline"}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
