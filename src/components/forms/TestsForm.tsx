// @ts-nocheck
import React, { useEffect, useState } from "react";
import {
  createTest,
  updateTest,
} from "../../app/controllers/tests/testController";
import { useLocation, useNavigate } from "react-router-dom";
import AsyncSelect from "react-select/async";
import {
  searchQuestions,
  searchTags,
} from "../../app/controllers/tags/tagsController";
import { getBatches } from "../../app/controllers/batch/batchController";
import { useTranslation } from "react-i18next";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import { CircleX, Plus } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";

export interface CreateTestFormValues {
  test_name: string;
  timing: number;
  positive_scoring: number;
  negative_scoring: number;
  questions: Array<any>;
  batch_id: string;
  cut_off: number;
}

const TestsForm = ({ create }: { create: boolean }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { state } = useLocation();
  const testData = state?.test;

  const [formData, setFormData] = useState<CreateTestFormValues>({
    test_name: testData?.test_name || "",
    timing: testData?.timing || 0,
    positive_scoring: testData?.positive_scoring || 0,
    negative_scoring: testData?.negative_scoring || 0,
    questions: testData?.questions || [],
    batch_id: testData?.batch_id || "",
    cut_off: testData?.cut_off || 0,
  });

  const [selectedQuestions, setSelectedQuestions] = useState<any[]>([]);
  const [tagSelected, setTagSelected] = useState([]);
  const [questions, setQuestions] = useState<{}[]>([]);
  const [batches, setBatches] = useState<{}[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBatches = async () => {
      const response = await getBatches();
      const data = response?.data || [];
      const fetchedBatches = data.map((batch: any) => ({
        label: batch.batch_name,
        value: batch._id,
      }));
      setBatches(fetchedBatches);
    };

    fetchBatches();
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await searchQuestions(
        tagSelected?.map((tag) => tag.label).join(","),
        currentPage,
        itemsPerPage
      );
      const data = response?.data?.data || [];
      const totalPages = response?.data?.totalPages || 0;
      setQuestions(data);
      setTotalPages(totalPages);
    };

    if (tagSelected?.length) {
      fetchQuestions();
    } else {
      setQuestions([]);
    }
  }, [tagSelected]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (create) {
        await createTest({ ...formData });
        toast.success(t("created_success", { name: formData.test_name }));
      } else {
        await updateTest({ ...formData }, testData?._id);
        toast.success(t("updated_success", { name: formData.test_name }));
      }
      navigate("/tests");
    } catch (error) {
      toast.error(t(create ? "error_creating_test" : "error_updating_test"));
    }
  };

  const handleSelectAll = (event) => {
    setSelectedQuestions(event.target.checked ? [...questions] : []);
  };

  const handleSelectQuestion = (question) => {
    setSelectedQuestions((prevSelected) =>
      prevSelected.some((q) => q._id === question._id)
        ? prevSelected.filter((q) => q._id !== question._id)
        : [...prevSelected, question]
    );
  };

  const fetchTags = async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const response = await searchTags(inputValue);
      const data = response?.data?.data || [];
      return data.map((tag: any) => ({ label: tag.tag_name, value: tag._id }));
    } catch {
      return [];
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const isAllSelected =
    questions?.length > 0 && selectedQuestions.length === questions?.length;

  return (
    <div>
      <form onSubmit={handleCreateTestSubmit} className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="test_name">{t("test_name")}</Label>
            <Input
              type="text"
              name="test_name"
              value={formData.test_name}
              onChange={handleInputChange}
              placeholder={t("enter_test_name")}
            />
          </div>

          <div>
            <Label htmlFor="timing">{t("duration")}</Label>
            <Input
              type="number"
              name="timing"
              value={formData.timing}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="positive_scoring">{t("positive_scoring")}</Label>
            <Input
              type="number"
              name="positive_scoring"
              value={formData.positive_scoring}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="negative_scoring">{t("negative_scoring")}</Label>
            <Input
              type="number"
              name="negative_scoring"
              value={formData.negative_scoring}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="batch_id">{t("batch")}</Label>
            <Select
              value={formData.batch_id}
              onValueChange={(value) => handleSelectChange("batch_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("select_batch")} />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.value} value={batch.value}>
                    {batch.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cut_off">{t("cut_off")}</Label>
            <Input
              type="number"
              name="cut_off"
              value={formData.cut_off}
              onChange={handleInputChange}
              placeholder={t("cut_off")}
              max={100}
              min={0}
            />
          </div>

          <Drawer open={isDrawerOpen}>
            <DrawerTrigger>
              <Button
                className="mt-2 w-full"
                type="button"
                variant="outline"
                onClick={() => setIsDrawerOpen(true)}
              >
                {t("add_questions")} <Plus className="w-4 h-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh]">
              <DrawerHeader>
                <DrawerTitle>{t("pick_questions_title")}</DrawerTitle>
                <DrawerDescription>{t("pick_questions_description")}</DrawerDescription>
              </DrawerHeader>
              <div className="px-4">
                <Label className="pb-2 inline-block">{t("tag")}</Label>
                <AsyncSelect
                  isMulti
                  cacheOptions
                  loadOptions={fetchTags}
                  defaultOptions
                  placeholder={t("tag")}
                  onChange={(selected) => setTagSelected(selected)}
                />

                {questions?.questions?.length ? (
                  <Table className="mt-10">
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <Input
                            checked={isAllSelected}
                            onChange={handleSelectAll}
                            type="checkbox"
                            className="w-4 h-4"
                          />
                        </TableHead>
                        <TableHead>{t("question")}</TableHead>
                        <TableHead>{t("reasoning")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.questions.map((q) => (
                        <TableRow key={q._id}>
                          <TableCell>
                            <Input
                              checked={selectedQuestions.some((s) => s._id === q._id)}
                              onChange={() => handleSelectQuestion(q)}
                              type="checkbox"
                              className="w-4 h-4"
                            />
                          </TableCell>
                          <TableCell>{q.question}</TableCell>
                          <TableCell>{q.reasoning}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : null}

                {questions.length ? (
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <Button variant="outline" onClick={handlePreviousPage} disabled={currentPage === 1}>
                      {t("previous")}
                    </Button>
                    <span>{t("page_of", { current: currentPage, total: totalPages })}</span>
                    <Button variant="outline" onClick={handleNextPage} disabled={currentPage === totalPages}>
                      {t("next")}
                    </Button>
                  </div>
                ) : null}
              </div>

              <DrawerFooter className="flex gap-2 flex-row">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      questions: [...prev.questions, ...selectedQuestions],
                    }));
                    setQuestions([]);
                    setSelectedQuestions([]);
                    setIsDrawerOpen(false);
                  }}
                >
                  {t("add_selected")}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuestions([]);
                    setIsDrawerOpen(false);
                  }}
                >
                  {t("cancel")}
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="selected_questions">{t("selected_questions")}</Label>
          <ul className="grid grid-cols-3 gap-4">
            {formData.questions.length ? (
              formData.questions.map((question, index) => (
                <li key={index} className="border p-2 rounded-lg relative pr-4">
                  <CircleX
                    className="w-4 h-4 text-red-500 absolute top-2 right-2 cursor-pointer"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        questions: prev.questions.filter((_, idx) => idx !== index),
                      }))
                    }
                  />
                  <div>{question?.question || t("no_questions_selected")}</div>
                </li>
              ))
            ) : (
              <li className="text-sm">{t("no_questions_selected")}</li>
            )}
          </ul>
        </div>
        <Button className="mt-6" type="submit">
          {t(create ? "create" : "update")}
        </Button>
      </form>
    </div>
  );
};

export default TestsForm;
