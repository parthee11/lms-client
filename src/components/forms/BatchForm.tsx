import { Field, Form } from "react-final-form";
import {
  createBatch,
  updateBatch,
} from "../../app/controllers/batch/batchController";
import { useLocation, useNavigate } from "react-router-dom";
import { convertDateString } from "../../app/utils";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export interface CreateBatchFormValues {
  batch_name: string;
  start_date: string;
  end_date: string;
}

const BatchForm = ({ create }: { create: boolean }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const batchData = state?.batch;
  const { t } = useTranslation();

  const handleCreateBatchSubmit = async (data: CreateBatchFormValues) => {
    const submitData = {
      ...data,
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
    };
    try {
      if (create) {
        await createBatch(submitData);
        toast.success(t("batch_created_success", { name: data.batch_name }));
        navigate("/batches");
      } else {
        await updateBatch(submitData, batchData?._id);
        toast.success(t("batch_updated_success", { name: data.batch_name }));
        navigate(`/batches`);
      }
    } catch (error) {
      toast.error(t(create ? "batch_create_error" : "batch_update_error"));
    }
  };

  const validate = (values: CreateBatchFormValues) => {
    const errors: Partial<CreateBatchFormValues> = {};
    if (!values.batch_name) {
      errors.batch_name = t("batch_name_required");
    }
    if (!values.start_date) {
      errors.start_date = t("start_date_required");
    }
    if (!values.end_date) {
      errors.end_date = t("end_date_required");
    }
    return errors;
  };

  const initalValues: CreateBatchFormValues = {
    batch_name: batchData?.batch_name || "",
    start_date: batchData?.start_date ? convertDateString(batchData?.start_date) : "",
    end_date: batchData?.end_date ? convertDateString(batchData?.end_date) : "",
  };

  return (
    <Form
      onSubmit={handleCreateBatchSubmit}
      initialValues={initalValues}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Batch Name */}
          <Field name="batch_name">
            {({ input, meta }) => (
              <div>
                <Label htmlFor="name">{t("name")}</Label>
                <Input {...input} type="text" placeholder={t("enter_batch_name")} />
                {meta.touched && meta.error && (
                  <span className="text-xs text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* Start Date */}
          <Field name="start_date">
            {({ input, meta }) => (
              <div>
                <Label htmlFor="start_date_time">{t("start_date_time")}</Label>
                <Input {...input} type="datetime-local" />
                {meta.touched && meta.error && (
                  <span className="text-xs text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* End Date */}
          <Field name="end_date">
            {({ input, meta }) => (
              <div>
                <Label htmlFor="end_date_time">{t("end_date_time")}</Label>
                <Input {...input} type="datetime-local" />
                {meta.touched && meta.error && (
                  <span className="text-xs text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* Submit */}
          <Button type="submit" disabled={submitting || pristine}>
            {create ? t("create") : t("update")}
          </Button>
        </form>
      )}
    />
  );
};

export default BatchForm;
