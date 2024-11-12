import { Field, Form } from "react-final-form";
import {
  createBatch,
  updateBatch,
} from "../../app/controllers/batch/batchController";
import { useLocation, useNavigate } from "react-router-dom";
import { convertDateString } from "../../app/utils";

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
      const response = create
        ? await createBatch(submitData)
        : await updateBatch(submitData, batchData?._id);
      if (create) navigate("/dashboard");
      else navigate(`/batches`);
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
                <label className="block text-sm font-medium">Batch Name</label>
                <input
                  {...input}
                  type="text"
                  className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter batch name"
                />
                {meta.touched && meta.error && (
                  <span className="text-sm text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* Start Date and Time Field */}
          <Field name="start_date">
            {({ input, meta }) => (
              <div>
                <label className="block text-sm font-medium">
                  Start Date & Time
                </label>
                <input
                  {...input}
                  type="datetime-local"
                  className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                {meta.touched && meta.error && (
                  <span className="text-sm text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* End Date and Time Field */}
          <Field name="end_date">
            {({ input, meta }) => (
              <div>
                <label className="block text-sm font-medium">
                  End Date & Time
                </label>
                <input
                  {...input}
                  type="datetime-local"
                  className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                />
                {meta.touched && meta.error && (
                  <span className="text-sm text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting || pristine}
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 disabled:bg-gray-300"
          >
            {create ? "Create Batch" : "Update Batch"}
          </button>
        </form>
      )}
    />
  );
};

export default BatchForm;
