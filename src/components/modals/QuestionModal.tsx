import React from "react";

interface Option {
  key: number;
  value: string;
}

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddQuestion: (
    question: string,
    options: Option[],
    correctAnswer: number
  ) => void;
}

const QuestionModal: React.FC<QuestionModalProps> = ({
  isOpen,
  onClose,
  onAddQuestion,
}) => {
  const [question, setQuestion] = React.useState<string>("");
  const [options, setOptions] = React.useState<Option[]>([
    { key: 0, value: "" },
    { key: 1, value: "" },
  ]);
  const [correctAnswer, setCorrectAnswer] = React.useState<number>(0);

  const handleAddOption = () => {
    setOptions([...options, { key: options.length, value: "" }]);
  };

  const handleSubmit = () => {
    onAddQuestion(question, options, correctAnswer);
    setQuestion("");
    setOptions([
      { key: 0, value: "" },
      { key: 1, value: "" },
    ]);
    setCorrectAnswer(0);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <h2>Add Question</h2>
        <label>Question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question"
        />
        <h3>Options</h3>
        {options.map((option, index) => (
          <div key={index}>
            <input
              type="text"
              value={option.value}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[index].value = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${index + 1}`}
            />
          </div>
        ))}
        <button type="button" onClick={handleAddOption}>
          Add Option
        </button>
        <label>Correct Answer (Index)</label>
        <input
          type="number"
          value={correctAnswer}
          onChange={(e) =>
            setCorrectAnswer(
              Math.max(0, Math.min(options.length - 1, Number(e.target.value)))
            )
          }
          min={0}
          max={options.length - 1}
        />
        <button type="button" onClick={handleSubmit}>
          Add Question
        </button>
        <button type="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default QuestionModal;

// const QuestionForm: React.FC<{ onAdd: (question: Question) => void }> = ({ onAdd }) => {
//   const [question, setQuestion] = useState<string>('');
//   const [options, setOptions] = useState<Option[]>([
//     { key: 0, value: '' },
//     { key: 1, value: '' },
//   ]);
//   const [correctAnswer, setCorrectAnswer] = useState<number>(0);
//   const [reasoning, setReasoning] = useState<string>('');

//   const handleAddOption = () => {
//     setOptions([...options, { key: options.length, value: '' }]);
//   };

//   const handleSubmit = () => {
//     onAdd({ question, options, correct_answer: correctAnswer, reasoning });
//   };

//   return (
//     <div>
//       <input
//         type="text"
//         placeholder="Enter question"
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//         className="w-full mt-2 p-2 border rounded"
//       />
//       {options.map((option, index) => (
//         <input
//           key={index}
//           type="text"
//           placeholder={`Option ${index + 1}`}
//           value={option.value}
//           onChange={(e) =>
//             setOptions(
//               options.map((o, i) =>
//                 i === index ? { ...o, value: e.target.value } : o
//               )
//             )
//           }
//           className="w-full mt-2 p-2 border rounded"
//         />
//       ))}
//       <button onClick={handleAddOption} className="mt-2 text-blue-500">
//         Add Option
//       </button>
//       <button onClick={handleSubmit} className="mt-4 bg-green-500 text-white px-4 py-2 rounded">
//         Add Question
//       </button>
//     </div>
//   );
// };
