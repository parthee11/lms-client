import { useEffect } from "react";
import {
  getBatches,
  deleteBatch,
} from "../app/controllers/batch/batchController"; // Add deleteBatch import
import { useDispatch, useSelector } from "react-redux";
import { setBatches } from "../app/features/batches/batchSlice";
import { selectBatches } from "../app/features/batches/batchSelectors";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

const Batches = () => {
  const dispatch = useDispatch();
  const batches = useSelector(selectBatches);
  const navigate = useNavigate(); // For navigation on edit

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const response = await getBatches();
      dispatch(setBatches(response?.data));
    } catch (error) {
      console.log("Error fetching batches >>>", error);
    }
  };

  const handleEdit = (batch) => {
    // Navigate to an edit page or pass batch data to a form
    navigate(`/update?type=batch`, { state: { batch } });
  };

  const handleDelete = async (batchId: string) => {
    try {
      await deleteBatch(batchId); // Assuming deleteBatch is an API call
      fetchBatches(); // Refresh the list after deletion
    } catch (error) {
      console.log("Error deleting batch >>>", error);
    }
  };

  return (
    <>
      <Header isAdmin={true} />

      <div className="px-4">
        <Link
          to={"/dashboard"}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <h1 className="font-bold text-2xl px-4 mt-10">Batches</h1>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Name</TableHead>
              <TableHead className="w-[100px]">Start Date</TableHead>
              <TableHead className="w-[100px]">End Date</TableHead>
              <TableHead className="w-[100px]">Students Enrolled</TableHead>
              <TableHead className="w-[100px]">Tests Enrolled</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches?.length ? (
              batches.map((batch) => (
                <TableRow key={batch._id}>
                  <TableCell>
                    <Link
                      to={`/batches/${batch._id}`}
                      state={{ batch }}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {batch?.batch_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {" "}
                    {new Date(batch.start_date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {" "}
                    {new Date(batch.end_date).toLocaleString()}
                  </TableCell>
                  <TableCell> {batch.students.length}</TableCell>
                  <TableCell> {batch.tests.length}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant={"secondary"}
                      onClick={() => handleEdit(batch)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={"secondary"}
                      onClick={() => handleDelete(batch._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No batches found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Batches;
