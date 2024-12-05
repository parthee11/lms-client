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
  const [tagSelected, setTagSelected] = useState<{}>({});
  const [questions, setQuestions] = useState<{}[]>([]);
  const [batches, setBatches] = useState<{}[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Pagination state
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
        await createTest({
          ...formData,
        });
        navigate("/dashboard");
      } else {
        await updateTest(
          {
            ...formData,
          },
          testData?._id
        );
        navigate("/tests");
      }
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      // Select all questions
      setSelectedQuestions([...questions]); // Assuming `id` is a unique identifier
    } else {
      // Deselect all questions
      setSelectedQuestions([]);
    }
  };

  const handleSelectQuestion = (question) => {
    setSelectedQuestions(
      (prevSelected) =>
        prevSelected.some((q) => q.id === question._id)
          ? prevSelected.filter((q) => q.id !== question._id) // Deselect question
          : [...prevSelected, question] // Select question
    );
  };

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

  // Pagination handlers
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
            <Label htmlFor="test_name">Name</Label>
            <Input
              type="text"
              name="test_name"
              value={formData.test_name}
              onChange={handleInputChange}
              placeholder="Enter test name"
            />
          </div>

          <div>
            <Label htmlFor="timing">Duration (minutes)</Label>
            <Input
              type="number"
              name="timing"
              value={formData.timing}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="positive_scoring">Positive Scoring</Label>
            <Input
              type="number"
              name="positive_scoring"
              value={formData.positive_scoring}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="negative_scoring">Negative Scoring</Label>
            <Input
              type="number"
              name="negative_scoring"
              value={formData.negative_scoring}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <Label htmlFor="batch_id">Batch</Label>
            <Select
              value={formData?.batch_id}
              onValueChange={(value) => handleSelectChange("batch_id", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a batch" />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch?.value} value={batch?.value}>
                    {batch?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="cut_off">Cut Off (in %)</Label>
            <Input
              type="number"
              name="cut_off"
              value={formData.cut_off}
              onChange={handleInputChange}
              placeholder="Enter the cut off (%)"
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
                Add Questions <Plus className="w-4 h-4" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="h-[90vh]">
              <DrawerHeader>
                <DrawerTitle>Pick questions for your test</DrawerTitle>
                <DrawerDescription>
                  Search for tags and select your questions.
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4">
                <div>
                  <Label className="pb-2 inline-block">Tag</Label>
                  <AsyncSelect
                    isMulti
                    cacheOptions
                    loadOptions={fetchTags}
                    defaultOptions
                    placeholder="Search and select tag"
                    onChange={(selected) => setTagSelected(selected)}
                  />
                </div>
                {questions.length ? (
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
                        <TableHead>Question</TableHead>
                        <TableHead>Reasoning</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {questions.map((question) => {
                        return (
                          <TableRow key={question._id}>
                            <TableCell>
                              <Input
                                checked={selectedQuestions.some(
                                  (q) => q._id === question._id
                                )}
                                onChange={() => {
                                  handleSelectQuestion(question);
                                }}
                                type="checkbox"
                                className="w-4 h-4"
                              />
                            </TableCell>
                            <TableCell>{question?.question}</TableCell>
                            <TableCell>{question?.reasoning}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                ) : (
                  <></>
                )}
                {questions.length ? (
                  <div className="flex justify-between items-center mt-4 text-sm">
                    <Button
                      variant="outline"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <span>
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                ) : (
                  <></>
                )}
              </div>
              <DrawerFooter className="flex gap-2 flex-row">
                <Button
                  variant={"secondary"}
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
                  Add Selected
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuestions([]);
                    setIsDrawerOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="flex flex-col gap-1">
          <Label htmlFor="selected_questions">Selected Questions</Label>
          <ul className="grid grid-cols-3 gap-4">
            {formData.questions.length ? (
              formData.questions.map((question, index) => (
                <li key={index} className="border p-2 rounded-lg relative pr-4">
                  <CircleX
                    className="w-4 h-4 text-red-500 absolute top-2 right-2"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        questions: prev.questions.filter(
                          (_, idx) => idx !== index
                        ),
                      }))
                    }
                  />
                  <div>{question?.question || "No question name"}</div>
                </li>
              ))
            ) : (
              <li className="text-sm">No questions selected yet.</li>
            )}
          </ul>
        </div>
        <Button className="mt-6" type="submit">
          {create ? "Create" : "Update"}
        </Button>
      </form>
    </div>
  );
};

export default TestsForm;
