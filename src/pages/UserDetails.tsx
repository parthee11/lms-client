import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import Header from "../components/common/Header";
import _ from "lodash";
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
import { useTranslation } from "react-i18next";

const UserDetails = () => {
  const { state } = useLocation();
  const user = state?.user;
  const batches = useSelector(selectBatches);
  const [formattedBatches, setFormattedBatches] = useState<{ label: string; value: string }[]>([]);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<{ label: string; value: string }>();

  const { t } = useTranslation();

  useEffect(() => {
    if (user && batches) {
      const _formattedBatches = batches.map((batch) => ({
        label: batch.batch_name,
        value: batch._id,
      }));
      setFormattedBatches(_formattedBatches);
    }
  }, [user, batches]);

  if (!user) return <div>{t("no_user_details")}</div>;

  const handleEnrollToBatch = async () => {
    if (!selectedBatch) {
      alert(t("select_batch_warning"));
      return;
    }

    try {
      await enrollToBatch(selectedBatch.value, [user._id]);
      alert(t("user_enrolled_success"));
      setIsEnrollModalOpen(false);
    } catch (error) {
      console.error("Enrollment Error >>>", error);
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
            <h3 className="text-2xl font-bold mb-4">{t("user_details")}</h3>
            <Card className="rounded-full overflow-hidden w-[50px] h-[50px]">
              <img
                src={"https://api.dicebear.com/9.x/fun-emoji/svg?seed=Jocelyn"}
                alt="user-avatar"
                className="h-[50px] w-[50px] object-cover"
              />
            </Card>
            <div className="space-y-2">
              <p>
                <strong>{t("username")}:</strong> {user.username}
              </p>
              <p>
                <strong>{t("email")}:</strong> {user.email}
              </p>
              <p>
                <strong>{t("name")}:</strong> {user.profile.name}
              </p>
              <p>
                <strong>{t("phone")}:</strong> {user.profile.phone}
              </p>
              <p>
                <strong>{t("role")}:</strong> {user.role}
              </p>
            </div>
            <Button type="button" onClick={() => setIsEnrollModalOpen(true)}>
              {t("enroll_to_batch")} <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isEnrollModalOpen} onOpenChange={setIsEnrollModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("enroll_to_batch")}</DialogTitle>
            <DialogDescription className="text-xs">
              {t("select_batch_description")}
            </DialogDescription>
          </DialogHeader>
          {batches?.length ? (
            <div>
              <Label htmlFor="batch">{t("batch")}</Label>
              <AsyncSelect
                cacheOptions
                value={selectedBatch}
                options={formattedBatches}
                defaultOptions={formattedBatches}
                placeholder={t("search_and_select_batch")}
                onChange={(selected) => selected && setSelectedBatch(selected)}
              />
            </div>
          ) : (
            <div className="text-xs">{t("no_batches_available")}</div>
          )}
          <DialogFooter>
            <Button type="submit" onClick={handleEnrollToBatch}>
              {t("enroll")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserDetails;
