import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../../app/controllers/questions/questionController";
import Select from "react-select";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import debounce from "lodash.debounce";
import { searchTags } from "../../app/controllers/tags/tagsController";
import AsyncSelect from "react-select/async";

const QuestionsForm = () => {
  const navigate = useNavigate();
  const [tagOptions, setTagOptions] = useState([]);

  const fetchTags = async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const response = await searchTags(inputValue);
      const data = response?.data?.data || [];
      return data.map((tag: any) => ({ label: tag.tag_name, value: tag._id }));
    } catch (error) {
      console.error("Error fetching tags", error);
      return [];
    }
  };

  const handleCreateQuestionsSubmit = async (values) => {
    try {
      const formattedQuestions = values.questions.map((question) => ({
        ...question,
        tags: question.tags.map((tag) => tag.label),
      }));
      await createQuestion(formattedQuestions);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  return (
    <Form
      onSubmit={handleCreateQuestionsSubmit}
      initialValues={{
        questions: [
          {
            question: "",
            options: [
              { key: 0, value: "" },
              { key: 1, value: "" },
            ],
            correct_answer: 0,
            reasoning: "",
            tags: [],
          },
        ],
      }}
      mutators={{
        ...arrayMutators,
      }}
      render={({
        handleSubmit,
        form: {
          mutators: { push, pop },
        },
        submitting,
        pristine,
      }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          <FieldArray name="questions">
            {({ fields }) =>
              fields.map((name, qIndex) => (
                <div key={name} className="space-y-4">
                  {/* Question Input */}
                  <Field name={`${name}.question`}>
                    {({ input, meta }) => (
                      <div>
                        <label className="block text-sm font-medium">
                          Question
                        </label>
                        <input
                          {...input}
                          type="text"
                          className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                          placeholder="Enter question"
                        />
                        {meta.touched && meta.error && (
                          <span className="text-sm text-red-500">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    )}
                  </Field>

                  {/* Options */}
                  <FieldArray name={`${name}.options`}>
                    {({ fields }) =>
                      fields.map((optionName, optIndex) => (
                        <div key={optionName} className="flex items-center">
                          <Field name={`${optionName}.value`}>
                            {({ input, meta }) => (
                              <div className="flex-1">
                                <label className="block text-sm font-medium">
                                  Option {optIndex + 1}
                                </label>
                                <input
                                  {...input}
                                  type="text"
                                  className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                                  placeholder={`Enter option ${optIndex + 1}`}
                                />
                                {meta.touched && meta.error && (
                                  <span className="text-sm text-red-500">
                                    {meta.error}
                                  </span>
                                )}
                              </div>
                            )}
                          </Field>

                          {optIndex >= 2 && (
                            <button
                              type="button"
                              onClick={() => fields.remove(optIndex)}
                              className="ml-2 text-red-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      ))
                    }
                  </FieldArray>

                  <button
                    type="button"
                    onClick={() =>
                      push(`${name}.options`, { key: fields.length, value: "" })
                    }
                    className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
                  >
                    Add Option
                  </button>

                  {/* Correct Answer */}
                  <Field name={`${name}.correct_answer`}>
                    {({ input, meta }) => (
                      <div>
                        <label className="block text-sm font-medium">
                          Correct Answer
                        </label>
                        <input
                          {...input}
                          type="number"
                          min="0"
                          max={fields.length - 1}
                          className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                          placeholder="Correct answer index (0-n)"
                        />
                        {meta.touched && meta.error && (
                          <span className="text-sm text-red-500">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    )}
                  </Field>

                  {/* Reasoning */}
                  <Field name={`${name}.reasoning`}>
                    {({ input, meta }) => (
                      <div>
                        <label className="block text-sm font-medium">
                          Reasoning
                        </label>
                        <textarea
                          {...input}
                          className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                          placeholder="Enter reasoning"
                        />
                        {meta.touched && meta.error && (
                          <span className="text-sm text-red-500">
                            {meta.error}
                          </span>
                        )}
                      </div>
                    )}
                  </Field>

                  {/* Tags Selector */}
                  <Field name={`questions[${qIndex}].tags`}>
                    {({ input }) => (
                      <div>
                        <label className="block text-sm font-medium">
                          Tags
                        </label>
                        <AsyncSelect
                          {...input}
                          isMulti
                          cacheOptions
                          loadOptions={fetchTags}
                          defaultOptions
                          placeholder="Search and select tags"
                          onChange={(selected) => input.onChange(selected)}
                        />
                      </div>
                    )}
                  </Field>

                  <button
                    type="button"
                    onClick={() => fields.remove(qIndex)}
                    className="mt-2 text-red-500 hover:text-red-600"
                  >
                    Remove Question
                  </button>
                </div>
              ))
            }
          </FieldArray>

          <button
            type="button"
            onClick={() =>
              push("questions", {
                question: "",
                options: [
                  { key: 0, value: "" },
                  { key: 1, value: "" },
                ],
                correct_answer: 0,
                reasoning: "",
                tags: [],
              })
            }
            className="w-full px-4 py-2 mt-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Add Question
          </button>

          <button
            type="submit"
            disabled={submitting || pristine}
            className="w-full px-4 py-2 mt-4 text-white bg-green-500 rounded-lg hover:bg-green-600 disabled:bg-gray-300"
          >
            Submit Questions
          </button>
        </form>
      )}
    />
  );
};

export default QuestionsForm;
