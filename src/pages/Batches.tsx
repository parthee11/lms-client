import { useEffect } from "react";
import {
  getBatches,
  deleteBatch,
} from "../app/controllers/batch/batchController";
import { useDispatch, useSelector } from "react-redux";
import { setBatches } from "../app/features/batches/batchSlice";
import { selectBatches } from "../app/features/batches/batchSelectors";
import Header from "../components/common/Header";
import { Link, useNavigate } from "react-router-dom";
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
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

interface Batch {
  _id: string;
  batch_name: string;
  start_date: string;
  end_date: string;
  students: Array<string>;
  tests: Array<string>;
}

const Batches = () => {
  const dispatch = useDispatch();
  const batches = useSelector(selectBatches);
  const navigate = useNavigate();
  const { t } = useTranslation();

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

  const handleEdit = (batch: Batch) => {
    navigate(`/update?type=batch`, { state: { batch } });
  };

  const handleDelete = async (batchId: string) => {
    try {
      await deleteBatch(batchId);
      toast.success(t("batch_deleted_success"));
      fetchBatches();
    } catch (error) {
      toast.error(t("batch_delete_error"));
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

      <h1 className="font-bold text-2xl px-4 mt-10">{t("batches")}</h1>

      <div className="p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t("name")}</TableHead>
              <TableHead className="w-[100px]">{t("start_date")}</TableHead>
              <TableHead className="w-[100px]">{t("end_date")}</TableHead>
              <TableHead className="w-[100px]">{t("students_enrolled")}</TableHead>
              <TableHead className="w-[100px]">{t("tests_enrolled")}</TableHead>
              <TableHead className="w-[100px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {batches?.length ? (
              batches.map((batch: Batch) => (
                <TableRow key={batch._id}>
                  <TableCell>
                    <Link
                      to={`/batches/${batch._id}`}
                      state={{ batch }}
                      className={buttonVariants({ variant: "ghost" })}
                    >
                      {batch.batch_name}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {new Date(batch.start_date).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(batch.end_date).toLocaleString()}
                  </TableCell>
                  <TableCell>{batch.students.length}</TableCell>
                  <TableCell>{batch.tests.length}</TableCell>
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
                <TableCell colSpan={6}>{t("no_batches_found")}</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default Batches;
