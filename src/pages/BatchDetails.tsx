import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import _ from "lodash"; // Import lodash for debounce
import { searchStudents } from "../app/controllers/user/userController";
import { enrollToBatch } from "../app/controllers/batch/batchController";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Group, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AsyncSelect from "react-select/async";
import { CreateEntityFormValues } from "@/components/forms/UserForm";

interface Batch {
  _id: string;
  start_date: string;
  end_date: string;
  students: Array<string>;
  tests: Array<string>;
}

const BatchDetails = () => {
  const { state } = useLocation();
  const batch = state?.batch as Batch;

  const [selectedUsers, setSelectedUsers] = useState<{ label: string; value: string }[]>([]);
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);

  if (!batch) return <div>No batch details found.</div>;

  const fetchStudents = async (inputValue: string) => {
    if (!inputValue) return [];
    try {
      const response = await searchStudents(inputValue);
      const data = response?.data?.data || [];
      return data.users.map((user: CreateEntityFormValues) => ({
        label: `${user.profile.name} (${user.username})`,
        value: user._id,
      }));
    } catch (error) {
      console.error("Error fetching tags", error);
      return [];
    }
  };

  const handleEnrollUser = async () => {
    try {
      if (selectedUsers.length) {
        const response = await enrollToBatch(
          batch._id,
          selectedUsers.map((user) => user.value)
        );
        console.log("response >>>", response);
        window.location.reload();
      }
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  return (
    <>
      <Header isAdmin={true} />

      <div className="px-4">
        <Link to={"/users"} className={buttonVariants({ variant: "outline" })}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="w-full mt-10">
        <div className="mt-10 flex items-center justify-center h-full">
          <div className="flex flex-col space-y-3">
            <h3 className="text-2xl font-bold mb-4">Batch Details</h3>
            <Card className="rounded-full overflow-hidden w-[50px] h-[50px] flex justify-center items-center bg-gray-100">
              <Group className="w-6 h-6" />
            </Card>
            <div className="space-y-2">
              <p>
                <strong>Start Date:</strong>{" "}
                {new Date(batch.start_date).toLocaleDateString()}
              </p>
              <p>
                <strong>End Date:</strong>{" "}
                {new Date(batch.end_date).toLocaleDateString()}
              </p>
              <p className="flex items-center gap-4">
                <span>
                  <strong>Students Enrolled:</strong> {batch.students.length}
                </span>
                <Button
                  onClick={() => setIsStudentModalOpen(true)}
                  className="h-6 w-6 rounded-full p-0"
                  variant={"outline"}
                >
                  <Plus className="w-2 h-2" />
                </Button>
              </p>
              <p>
                <strong>Tests:</strong> {batch.tests.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isStudentModalOpen} onOpenChange={setIsStudentModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll to batch</DialogTitle>
            <DialogDescription className="text-xs">
              Select the batch you want the student to enroll to.
            </DialogDescription>
          </DialogHeader>
          <div>
            <Label htmlFor="students">Students</Label>
            <AsyncSelect
              isMulti
              cacheOptions
              loadOptions={fetchStudents}
              defaultOptions
              placeholder="Search and select students"
              onChange={(selected) => setSelectedUsers(selected as { label: string; value: string }[])}
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleEnrollUser}>
              Enroll
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// const RenderTestsList = ({ batchId }: { batchId: string }) => {
//   const [tests, setTests] = useState<Test[] | null>(null);

//   useEffect(() => {
//     fetchTests();
//   }, [batchId]);

//   const fetchTests = async () => {
//     try {
//       const response = await getTestsInBatch(batchId);
//       if (response?.data?.data?.tests) {
//         setTests(response?.data?.data?.tests);
//       }
//     } catch (error) {
//       console.log("Error >>>", error);
//     }
//   };

//   return (
//     <>
//       {tests && (
//         <ul className="list-disc pl-6">
//           {tests.map((test) => (
//             <li key={test._id}>{test?.test_name}</li>
//           ))}
//         </ul>
//       )}
//     </>
//   );
// };

export default BatchDetails;
