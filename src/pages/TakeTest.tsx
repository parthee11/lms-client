import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";

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

const TakeTest = () => {
  const { testId } = useParams<{ testId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const { test }: { test: Test } = location.state || {};
  const [currentScreen, setCurrentScreen] = useState<
    "instructions" | "questions"
  >("instructions");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, number>
  >({});

  if (!test) {
    return <div>No test details found.</div>;
  }

  const {
    test_name,
    timing,
    positive_scoring,
    negative_scoring,
    // questions = [
    //   {
    //     _id: "671680528e20fcaddda52e1d",
    //     question: "What is the largest planet in our solar system?",
    //     options: [
    //       {
    //         key: 0,
    //         value: "Earth",
    //       },
    //       {
    //         key: 1,
    //         value: "Jupiter",
    //       },
    //       {
    //         key: 2,
    //         value: "Mars",
    //       },
    //       {
    //         key: 3,
    //         value: "Venus",
    //       },
    //     ],
    //     correct_answer: 1,
    //     reasoning: "Jupiter is the largest planet in our solar system.",
    //     tags: [
    //       {
    //         _id: "67167ca72467db8ecaf037e5",
    //         tag_name: "lol",
    //         count: 5,
    //         __v: 0,
    //       },
    //       {
    //         _id: "6715f50e366b83c408687186",
    //         tag_name: "hard",
    //         count: 6,
    //         __v: 0,
    //       },
    //     ],
    //   },
    //   {
    //     _id: "671680528e20fcaddda52e14",
    //     question: "Which element has the chemical symbol 'O'?",
    //     options: [
    //       {
    //         key: 0,
    //         value: "Oxygen",
    //       },
    //       {
    //         key: 1,
    //         value: "Osmium",
    //       },
    //       {
    //         key: 2,
    //         value: "Oganesson",
    //       },
    //       {
    //         key: 3,
    //         value: "Osmate",
    //       },
    //     ],
    //     correct_answer: 0,
    //     reasoning: "Oxygen has the chemical symbol 'O'.",
    //     tags: [
    //       {
    //         _id: "6715f50e366b83c408687186",
    //         tag_name: "hard",
    //         count: 6,
    //         __v: 0,
    //       },
    //     ],
    //   },
    //   {
    //     _id: "671dd60aa770d3874ca6f290",
    //     question: "What is the capital of France?",
    //     options: [
    //       {
    //         key: 0,
    //         value: "Berlin",
    //       },
    //       {
    //         key: 1,
    //         value: "Madrid",
    //       },
    //       {
    //         key: 2,
    //         value: "Paris",
    //       },
    //       {
    //         key: 3,
    //         value: "Rome",
    //       },
    //     ],
    //     correct_answer: 2,
    //     reasoning: "Paris is the capital of France.",
    //     tags: [
    //       {
    //         _id: "67167ca72467db8ecaf037e5",
    //         tag_name: "lol",
    //         count: 5,
    //         __v: 0,
    //       },
    //       {
    //         _id: "67167ca72467db8ecaf037e8",
    //         tag_name: "easy",
    //         count: 7,
    //         __v: 0,
    //       },
    //     ],
    //   },
    //   {
    //     _id: "671dd60aa770d3874ca6f297",
    //     question: "What is 2 + 2?",
    //     options: [
    //       {
    //         key: 0,
    //         value: "3",
    //       },
    //       {
    //         key: 1,
    //         value: "4",
    //       },
    //       {
    //         key: 2,
    //         value: "5",
    //       },
    //       {
    //         key: 3,
    //         value: "6",
    //       },
    //     ],
    //     correct_answer: 1,
    //     reasoning: "2 + 2 equals 4.",
    //     tags: [
    //       {
    //         _id: "67167ca72467db8ecaf037e8",
    //         tag_name: "easy",
    //         count: 7,
    //         __v: 0,
    //       },
    //     ],
    //   },
    // ],
    questions = []
  } = test;

  const handleStartTest = () => {
    setCurrentScreen("questions");
  };

  const handleOptionSelect = (questionId: string, optionKey: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.min(prev + 1, questions.length - 1));
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmitTest = () => {
    console.log("Selected answers:", selectedAnswers);
    alert("Test submitted successfully!");
    navigate("/my-tests");
  };

  return (
    <div className="p-4">
      {currentScreen === "instructions" ? (
        <div className="instructions-screen">
          <h2 className="text-xl font-bold mb-4">
            Instructions for {test_name}
          </h2>
          <ul className="list-disc pl-6 mb-4">
            <li>Time limit: {timing} minutes</li>
            <li>
              Positive scoring: {positive_scoring} points per correct answer
            </li>
            <li>
              Negative scoring: {negative_scoring} points per incorrect answer
            </li>
            <li>Ensure a stable internet connection during the test.</li>
            <li>
              Do not refresh or navigate away from the page once the test
              starts.
            </li>
          </ul>
          <button
            onClick={handleStartTest}
            className="bg-blue-500 text-white py-2 px-4 rounded"
          >
            Start Test
          </button>
        </div>
      ) : (
        <div className="questions-screen">
          <h2 className="text-lg font-bold mb-2">
            Question {currentQuestionIndex + 1}
          </h2>
          {questions.length > 0 ? (
            <>
              {/* Question Navigator */}
              <div className="question-navigator mb-4 flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    className={`py-1 px-3 rounded border ${
                      index === currentQuestionIndex
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
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
                    <li key={option.key}>
                      <label>
                        <input
                          type="radio"
                          name={`question-${questions[currentQuestionIndex]._id}`}
                          value={option.key}
                          checked={
                            selectedAnswers[
                              questions[currentQuestionIndex]._id
                            ] === option.key
                          }
                          onChange={() =>
                            handleOptionSelect(
                              questions[currentQuestionIndex]._id,
                              option.key
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
                    onClick={handleNextQuestion}
                    className="bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Save & Next
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitTest}
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
      )}
    </div>
  );
};

export default TakeTest;
