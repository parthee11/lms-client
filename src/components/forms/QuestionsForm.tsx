// @ts-nocheck
import React, { useState } from "react";
import { Field, Form } from "react-final-form";
import { useNavigate } from "react-router-dom";
import { createQuestion } from "../../app/controllers/questions/questionController";
import arrayMutators from "final-form-arrays";
import { FieldArray } from "react-final-form-arrays";
import { createTag, searchTags } from "../../app/controllers/tags/tagsController";
import AsyncSelect from "react-select/async";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogDescription } from "@radix-ui/react-dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Plus, Trash2 } from "lucide-react";
import { Textarea } from "../ui/textarea";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

const QuestionsForm = ({ create }) => {
  const navigate = useNavigate();
  const [questionsList, setQuestionsList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

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
      const formattedQuestion = {
        ...values,
        tags: values.tags.map((tag) => tag.label),
      };
      setQuestionsList([...questionsList, formattedQuestion]);
      setIsOpen(false);
    } catch (error) {
      console.error("Error adding question:", error);
    }
  };

  const handleSubmitAllQuestions = async () => {
    try {
      await createQuestion(questionsList);
      toast.success(t("questions_created_success"));
      navigate("/dashboard");
    } catch (error) {
      toast.error(t("questions_create_error"));
    }
  };

  const handleTagChange = (selectedTag, change) => {
    change("tags", selectedTag);
  };

  const handleKeyDown = (event, inputValue, value, change) => {
    if (event.key === "Enter" && inputValue) {
      event.preventDefault();
      handleCreateTag(inputValue, value, change);
      event.target.value = "";
    }
  };

  const handleCreateTag = async (inputValue: string, value, change) => {
    try {
      const newTag = {
        label: inputValue,
        value: Math.round(Math.random() * 1000000),
      };
      change("tags", [...value, newTag]);
    } catch (e) {
      console.log("Error creating tag >>>", e);
    }
  };

  return (
    <div className="space-y-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mt-4">
            {t("add_question")}
          </Button>
        </DialogTrigger>
        <DialogContent className="w-full max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t("add_question")}</DialogTitle>
            <DialogDescription className="text-xs">
              {t("add_question_description")}
            </DialogDescription>
          </DialogHeader>
          <Form
            onSubmit={handleCreateQuestionsSubmit}
            initialValues={{
              question: "",
              options: [{ key: 0, value: "" }, { key: 1, value: "" }],
              correct_answer: 0,
              reasoning: "",
              tags: [],
            }}
            mutators={{ ...arrayMutators }}
            render={({
              handleSubmit,
              form: { mutators: { push }, change },
            }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Field name="question">
                      {({ input }) => (
                        <div>
                          <Label htmlFor="question">{t("question")}</Label>
                          <Input {...input} type="text" placeholder={t("enter_question")} />
                        </div>
                      )}
                    </Field>
                    <FieldArray name="options">
                      {({ fields }) =>
                        fields.map((optionName, optIndex) => (
                          <div key={optionName} className="flex items-center gap-2">
                            <Field name={`${optionName}.value`}>
                              {({ input }) => (
                                <Input
                                  {...input}
                                  type="text"
                                  placeholder={`${t("option")} ${optIndex + 1}`}
                                />
                              )}
                            </Field>
                            {optIndex >= 2 && (
                              <Button
                                type="button"
                                variant="outline"
                                onClick={() => fields.remove(optIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))
                      }
                    </FieldArray>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        push("options", {
                          key: Math.round(Math.random() * 100000),
                          value: "",
                        })
                      }
                    >
                      {t("add_option")} <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex-1 space-y-2">
                    <Field name="correct_answer">
                      {({ input }) => (
                        <div>
                          <Label htmlFor="correct_answer">{t("correct_answer")}</Label>
                          <Input
                            {...input}
                            type="number"
                            min={0}
                            placeholder={t("enter_correct_answer_index")}
                          />
                        </div>
                      )}
                    </Field>
                    <Field name="reasoning">
                      {({ input }) => (
                        <div>
                          <Label htmlFor="reasoning">{t("reasoning")}</Label>
                          <Textarea {...input} placeholder={t("enter_reasoning")} />
                        </div>
                      )}
                    </Field>
                    <Field name="tags">
                      {({ input }) => (
                        <div>
                          <Label htmlFor="tags">{t("tags")}</Label>
                          <AsyncSelect
                            {...input}
                            isMulti
                            cacheOptions
                            loadOptions={fetchTags}
                            defaultOptions
                            placeholder={t("search_and_select_tags")}
                            onChange={(selected) => handleTagChange(selected, change)}
                            onKeyDown={(event) =>
                              handleKeyDown(
                                event,
                                event.target.value,
                                input.value,
                                change
                              )
                            }
                          />
                        </div>
                      )}
                    </Field>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="submit">{t("save_question")}</Button>
                  <DialogClose>
                    <Button type="button" variant="outline">
                      {t("cancel")}
                    </Button>
                  </DialogClose>
                </div>
              </form>
            )}
          />
        </DialogContent>
      </Dialog>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">{t("added_questions")}</h2>
        {questionsList.length > 0 ? (
          questionsList.map((question, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <p className="font-medium">
                Q{index + 1}: {question.question}
              </p>
              <ul className="ml-4 list-disc">
                {question.options.map((option, idx) => (
                  <li key={idx}>{option.value}</li>
                ))}
              </ul>
              <p>
                <span className="font-semibold">{t("correct_answer")}:</span>{" "}
                {t("option")} {Number(question.correct_answer) + 1}
              </p>
              {question.reasoning && (
                <p>
                  <span className="font-semibold">{t("reasoning")}:</span>{" "}
                  {question.reasoning}
                </p>
              )}
              <p>
                <span className="font-semibold">{t("tags")}:</span>{" "}
                {question.tags.join(", ")}
              </p>
            </div>
          ))
        ) : (
          <p>{t("no_questions_added")}</p>
        )}
      </div>

      {questionsList.length > 0 && (
        <Button variant="secondary" onClick={handleSubmitAllQuestions}>
          {t("submit_all_questions")}
        </Button>
      )}
    </div>
  );
};

export default QuestionsForm;
