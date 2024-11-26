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

export interface CreateBatchFormValues {
  batch_name: string;
  start_date: string;
  end_date: string;
}

const BatchForm = ({ create }: { create: boolean }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const batchData = state?.batch;

  const handleCreateBatchSubmit = async (data: CreateBatchFormValues) => {
    const submitData = {
      ...data,
      start_date: new Date(data.start_date).toISOString(),
      end_date: new Date(data.end_date).toISOString(),
    };
    try {
      if (create) {
        await createBatch(submitData);
        navigate("/dashboard");
      } else {
        await updateBatch(submitData, batchData?._id);
        navigate(`/batches`);
      }
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  const validate = (values: CreateBatchFormValues) => {
    const errors: Partial<CreateBatchFormValues> = {};
    if (!values.batch_name) {
      errors.batch_name = "Batch name is required";
    }
    if (!values.start_date) {
      errors.start_date = "Start date is required";
    }
    if (!values.end_date) {
      errors.end_date = "End date is required";
    }
    return errors;
  };

  console.log(batchData?.start_date, "date >>>");

  const initalValues: CreateBatchFormValues = {
    batch_name: batchData?.batch_name || "",
    start_date: batchData?.start_date
      ? convertDateString(batchData?.start_date)
      : "",
    end_date: batchData?.end_date ? convertDateString(batchData?.end_date) : "",
  };

  return (
    <Form
      onSubmit={handleCreateBatchSubmit}
      initialValues={initalValues}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Batch Name Field */}
          <Field name="batch_name">
            {({ input, meta }) => (
              <div>
                <Label htmlFor="name">Name</Label>
                <Input {...input} type="text" placeholder="Enter batch name" />
                {meta.touched && meta.error && (
                  <span className="text-xs text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* Start Date and Time Field */}
          <Field name="start_date">
            {({ input, meta }) => (
              <div>
                <Label htmlFor="start_date_time">Start date & time</Label>
                <Input
                  {...input}
                  className="!inline-block"
                  type="datetime-local"
                />
                {meta.touched && meta.error && (
                  <span className="text-xs text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* End Date and Time Field */}
          <Field name="end_date">
            {({ input, meta }) => (
              <div>
                <Label htmlFor="end_date_time">End date & time</Label>
                <Input
                  {...input}
                  className="!inline-block"
                  type="datetime-local"
                />
                {meta.touched && meta.error && (
                  <span className="text-xs text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* Submit Button */}
          <Button type="submit" disabled={submitting || pristine}>
            {create ? "Create" : "Update"}
          </Button>
        </form>
      )}
    />
  );
};

export default BatchForm;
