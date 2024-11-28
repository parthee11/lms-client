import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import _ from "lodash"; // For debounce
import { useSelector } from "react-redux";
import { selectBatches } from "../app/features/batches/batchSelectors";
import { enrollToBatch } from "../app/controllers/batch/batchController";
import { Card } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import AsyncSelect from "react-select/async";

const UserDetails = () => {
  const { state } = useLocation();
  const user = state?.user;
  const batches = useSelector(selectBatches);
  const [formattedBatches, setFormattedBatches] = useState([]);

  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  if (!user) return <div>No user details found.</div>;

  useEffect(() => {
    if (batches) {
      const _formattedBatches = batches.map((batch) => ({
        label: batch.batch_name,
        value: batch._id,
      }));
      setFormattedBatches(_formattedBatches);
    }
  }, [batches]);

  const handleEnrollToBatch = async () => {
    if (!selectedBatch) {
      alert("Please select a batch.");
      return;
    }

    try {
      await enrollToBatch(selectedBatch?.value, [user._id]);
      alert("User enrolled successfully!");
      setIsEnrollModalOpen(false); // Close modal after enrollment
    } catch (error) {
      console.error("Enrollment Error >>>", error);
    }
  };

  return (
    <>
      <Header isAdmin={true} />

      <div className="px-4">
        <Link
          to={"/users"}
          className={buttonVariants({ variant: "outline" })}
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
      </div>

      <div className="w-full mt-10">
        <div className="mt-10 flex items-center justify-center h-full">
          <div className="flex flex-col space-y-3">
            <h3 className="text-2xl font-bold mb-4">User Details</h3>
            <Card className="rounded-full overflow-hidden w-[50px] h-[50px]">
              <img
                src={"https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jocelyn"}
                alt="user-avatar"
                className="h-[50px] w-[50px] object-cover"
              />
            </Card>
            <div className="space-y-2">
              <p>
                <strong>Username:</strong> {user.username}
              </p>
              <p>
                <strong>Email:</strong> {user.email}
              </p>
              <p>
                <strong>Name:</strong> {user.profile.name}
              </p>
              <p>
                <strong>Phone:</strong> {user.profile.phone}
              </p>
              <p>
                <strong>Role:</strong> {user.role}
              </p>
            </div>
            <Button
              type="button"
              onClick={() => {
                setIsEnrollModalOpen(true);
              }}
            >
              Enroll to batch <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEnrollModalOpen} onOpenChange={setIsEnrollModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enroll to batch</DialogTitle>
            <DialogDescription className="text-xs">
              Select the batch you want the student to enroll to.
            </DialogDescription>
          </DialogHeader>
          {batches?.length ? (
            <div>
              <Label htmlFor="batch">Batch</Label>
              <AsyncSelect
                cacheOptions
                value={selectedBatch}
                options={formattedBatches}
                defaultOptions={formattedBatches}
                placeholder="Search and select a batch"
                onChange={(selected) => setSelectedBatch(selected)}
              />
            </div>
          ) : (
            <div className="text-xs">No batches available.</div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEnrollToBatch}>Enroll</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserDetails;
