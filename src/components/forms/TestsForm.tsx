import React, { useEffect, useState } from "react";
import { Field, Form } from "react-final-form";
import { createTest } from "../../app/controllers/tests/testController";
import { useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import {
  getTags,
  searchQuestions,
  searchTags,
} from "../../app/controllers/tags/tagsController";

export interface CreateTestFormValues {
  test_name: string;
  timing: number;
  positive_scoring: number;
  negative_scoring: number;
  questions: Array<any>;
}

const TestsForm = ({ create }: { create: boolean }) => {
  const navigate = useNavigate();
  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);

  const [tags, setTags] = useState<{}[]>([]);
  const [tagSelected, setTagSelected] = useState<{}>({});
  const [questions, setQuestions] = useState<{}[]>([]);

  useEffect(() => {
    const fetchInitialTags = async () => {
      const response = await getTags();
      const data = response?.data?.data || [];
      const fetchedTags = data.map((tag: any) => ({
        label: tag.tag_name,
        value: tag._id,
      }));
      setTags(fetchedTags);
    };

    fetchInitialTags();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await searchQuestions(tagSelected?.label);
      const data = response?.data?.data || [];
      const fetchedQuestions = data.map((question: any) => {
        const { options, ...rest } = question;
        return {
          label: question.question,
          value: question._id,
          _options: options,
          ...rest,
        };
      });
      setQuestions(fetchedQuestions);
    };

    if (tagSelected?.label) {
      fetchQuestions();
    }
  }, [tagSelected]);

  const handleCreateTestSubmit = async (data: CreateTestFormValues) => {
    try {
      const { tag, question, ...filteredData } = data; // Exclude 'tag' and 'question' fields
      const response = await createTest({
        ...filteredData,
        questions: selectedQuestions,
      });
      console.log(response);
      navigate("/dashboard");
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  const validate = (values: CreateTestFormValues) => {
    const errors: Partial<CreateTestFormValues> = {};
    if (!values.test_name) errors.test_name = "Test name is required";
    return errors;
  };

  // // Asynchronous function to fetch tags (simulate an API call)
  // const fetchTags = async (inputValue: string) => {
  //   if (!inputValue) return [];
  //   try {
  //     const response = await searchTags(inputValue);
  //     const data = response?.data?.data || [];
  //     return data.map((tag: any) => ({ label: tag.tag_name, value: tag._id }));
  //   } catch (error) {
  //     console.error("Error fetching tags", error);
  //     return [];
  //   }
  // };

  // // Asynchronous function to fetch questions based on selected tag
  // const fetchQuestions = async (inputValue: string, selectedTag: any) => {
  //   if (!selectedTag) return [];

  //   try {
  //     const response = await searchQuestions(selectedTag.value);
  //     const questions = response?.data?.data || [];

  //     console.log(questions, ">>>")

  //     // Filter questions based on inputValue, and return in the required format
  //     // return questions
  //     //   .filter((question) =>
  //     //     question.label.toLowerCase().includes(inputValue.toLowerCase())
  //     //   )
  //     //   .map((question) => ({ label: question.label, value: question._id }));
  //   } catch (error) {
  //     console.error("Error fetching questions:", error);
  //     return [];
  //   }
  // };

  const handleQuestionSelect = (selectedQuestion: any) => {
    if (selectedQuestion) {
      const { _options, rest } = selectedQuestion;
      setSelectedQuestions((prevQuestions) => [
        ...prevQuestions,
        { options: _options, ...rest },
      ]);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Form
        onSubmit={handleCreateTestSubmit}
        validate={validate}
        render={({ handleSubmit, submitting, pristine }) => (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field name="test_name">
              {({ input, meta }) => (
                <div>
                  <label className="block text-sm font-medium">Test Name</label>
                  <input
                    {...input}
                    type="text"
                    placeholder="Enter test name"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  {meta.touched && meta.error && (
                    <span className="text-sm text-red-500">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>

            <Field name="timing">
              {({ input, meta }) => (
                <div>
                  <label className="block text-sm font-medium">
                    Timing (minutes)
                  </label>
                  <input
                    {...input}
                    type="number"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  {meta.touched && meta.error && (
                    <span className="text-sm text-red-500">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>

            <Field name="positive_scoring">
              {({ input, meta }) => (
                <div>
                  <label className="block text-sm font-medium">
                    Positive Scoring
                  </label>
                  <input
                    {...input}
                    type="number"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  {meta.touched && meta.error && (
                    <span className="text-sm text-red-500">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>

            <Field name="negative_scoring">
              {({ input, meta }) => (
                <div>
                  <label className="block text-sm font-medium">
                    Negative Scoring
                  </label>
                  <input
                    {...input}
                    type="number"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  />
                  {meta.touched && meta.error && (
                    <span className="text-sm text-red-500">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>

            {/* Tag selector using AsyncSelect */}
            <Field name="tag">
              {({ input }) => (
                <div>
                  <label className="block text-sm font-medium">
                    Search Tag
                  </label>
                  <AsyncSelect
                    {...input}
                    cacheOptions
                    defaultOptions={tags}
                    options={tags}
                    placeholder="Search and select a tag"
                    onChange={(selectedTag) => {
                      input.onChange(selectedTag);
                      setTagSelected(selectedTag);
                    }}
                  />
                </div>
              )}
            </Field>

            {/* Question selector using AsyncSelect */}
            <Field name="question">
              {({ input }) => (
                <div>
                  <label className="block text-sm font-medium">
                    Select Question
                  </label>
                  <AsyncSelect
                    {...input}
                    cacheOptions
                    options={questions}
                    defaultOptions={questions}
                    placeholder="Select a question"
                    onChange={(selectedQuestion) => {
                      input.onChange(selectedQuestion);
                      handleQuestionSelect(selectedQuestion);
                    }}
                  />
                </div>
              )}
            </Field>

            {/* Display selected questions */}
            <div>
              <label className="block text-sm font-medium">
                Selected Questions
              </label>
              <ul className="mt-1 space-y-1">
                {selectedQuestions.map((question, index) => (
                  <li key={index} className="border p-2 rounded-lg">
                    {question.label} (ID: {question.value})
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="submit"
              disabled={submitting || pristine}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
            >
              Submit
            </button>
          </form>
        )}
      />
    </div>
  );
};

export default TestsForm;
