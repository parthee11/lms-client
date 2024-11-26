import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  questionStateUpdate,
  startTest,
} from "../app/controllers/tests/testController";

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
  const navigate = useNavigate();
  const [currentScreen, setCurrentScreen] = useState<
    "instructions" | "questions"
  >("instructions");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const [test, setTest] = useState(null);

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
  const [isWarningModalOpen, setIsWarningModalOpen] = useState(false);
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      return (event.returnValue = "");
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
        handleSubmitTest(questions[currentQuestionIndex]._id);
      }

      return () => clearInterval(countdown);
    }
  }, [timer]);

  if (!test) {
    return <div>No test details found.</div>;
  }

  const {
    test_name,
    timing,
    positive_scoring,
    negative_scoring,
    questions = [],
  } = test;

  const handleStartTest = async () => {
    try {
      if (testId) {
        await startTest(testId);
        setCurrentScreen("questions");
        setTimer(timing * 60);
      }
    } catch (error) {
      console.log("There was a problem starting the test >>>", error);
    }
  };

  const handleCancelNavigation = () => {
    setIsWarningModalOpen(false);
  };

  const handleNextQuestion = (questionId: string) => {
    updateQuestionState(questionId, "answered");
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleConfirmNavigation = () => {
    setIsWarningModalOpen(false);
    window.removeEventListener("beforeunload", () => {});
    navigate(-1);
  };

  const handleSubmitTest = (questionId: string) => {
    navigate("/my-tests");
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
    try {
      await questionStateUpdate(
        testId as string,
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
      {timer !== null && (
        <div className="absolute top-4 right-4 bg-gray-800 text-white py-1 px-3 rounded">
          Timer: {formatTime(timer)}
        </div>
      )}

      {currentScreen === "instructions" ? (
        <Instructions
          test={TextDecoderStream}
          handleStartTest={handleStartTest}
        />
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
          handleNextQuestion={handleNextQuestion}
          handleSubmitTest={handleSubmitTest}
        />
      )}
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
      <h2 className="text-xl font-bold mb-4">Instructions for {test_name}</h2>
      <ul className="list-disc pl-6 mb-4 space-y-2">
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
        <button
          onClick={handleStartTest}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Start Test
        </button>
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
  handleNextQuestion,
  handleSubmitTest,
}) => {
  const { questions } = test;

  const getButtonColor = (state: QuestionState) => {
    switch (state) {
      case "answered":
        return "bg-green-500 text-white";
      case "review":
        return "bg-yellow-500 text-white";
      case "flagged":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="questions-screen">
      <h2 className="text-lg font-bold mb-2">
        Question {currentQuestionIndex + 1}
      </h2>
      {questions.length > 0 ? (
        <>
          <div className="question-navigator mb-4 flex flex-wrap gap-2">
            {questions.map((question, index) => (
              <button
                key={question._id}
                className={`py-1 px-3 rounded border ${getButtonColor(
                  questionStates[question._id]
                )}`}
                onClick={() => setCurrentQuestionIndex(index)}
              >
                Q{index + 1}
              </button>
            ))}
          </div>

          <div className="question mb-4">
            <p>{questions[currentQuestionIndex].question}</p>
            <ul className="options-list mt-2">
              {questions[currentQuestionIndex].options.map((option) => (
                <li key={option._id}>
                  <label>
                    <input
                      type="radio"
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

          <div className="buttons flex gap-2">
            <button
              onClick={() =>
                updateQuestionState(
                  questions[currentQuestionIndex]._id,
                  "review"
                )
              }
              className="bg-yellow-500 text-white py-2 px-4 rounded"
            >
              Mark for Review
            </button>
            <button
              onClick={() =>
                updateQuestionState(
                  questions[currentQuestionIndex]._id,
                  "flagged"
                )
              }
              className="bg-red-500 text-white py-2 px-4 rounded"
            >
              Flag
            </button>
            {currentQuestionIndex > 0 && (
              <button
                onClick={handlePrevQuestion}
                className="bg-gray-500 text-white py-2 px-4 rounded"
              >
                Previous
              </button>
            )}
            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() =>
                  handleNextQuestion(questions[currentQuestionIndex]._id)
                }
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Save & Next
              </button>
            ) : (
              <button
                onClick={() =>
                  handleSubmitTest(questions[currentQuestionIndex]._id)
                }
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Submit Test
              </button>
            )}
          </div>
        </>
      ) : (
        <div>No questions available for this test.</div>
      )}
    </div>
  );
};
