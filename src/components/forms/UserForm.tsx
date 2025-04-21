// @ts-nocheck
import { Field, Form } from "react-final-form";
import { createUser, updateUser } from "../../app/controllers/user/userController";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { convertDateString } from "@/app/utils";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export interface CreateEntityFormValues {
  _id: string;
  username: string;
  email: string;
  password: string;
  profile: {
    name: string;
    age: number;
    gender: string;
    dob: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      postalCode: string;
      country: string;
    };
  };
  role: string;
}

const CreateUserForm = ({ create }: { create: boolean }) => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { t } = useTranslation();
  const userData = state?.user;

  const handleCreateEntitySubmit = async (data: CreateEntityFormValues) => {
    try {
      const userDataToSubmit = { ...data };
      if (!create) delete userDataToSubmit.password;

      if (create) {
        await createUser(userDataToSubmit);
        toast.success(t("user_created_success", { name: data.username }));
      } else {
        await updateUser(userDataToSubmit, userData?._id);
        toast.success(t("user_updated_success", { name: data.username }));
      }

      navigate("/users");
    } catch (error) {
      const fallback = t(create ? "error_creating_student" : "error_updating_student");
      toast.error(error?.message || fallback);
    }
  };

  const validate = (values: CreateEntityFormValues) => {
    const errors: Partial<CreateEntityFormValues> = {};
    const { profile } = values;

    if (!values.username) errors.username = t("username_required");
    if (!values.email) {
      errors.email = t("email_required");
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = t("invalid_email");
    }
    if (create && !values.password) errors.password = t("password_required");

    const profileErrors: any = {};
    if (!profile?.name) profileErrors.name = t("name_required");
    if (!profile?.age) profileErrors.age = t("age_required");
    if (!profile?.gender) profileErrors.gender = t("gender_required");
    if (!profile?.dob) profileErrors.dob = t("dob_required");
    if (!profile?.phone) profileErrors.phone = t("phone_required");

    const addressErrors: any = {};
    if (!profile?.address?.street) addressErrors.street = t("street_required");
    if (!profile?.address?.city) addressErrors.city = t("city_required");
    if (!profile?.address?.state) addressErrors.state = t("state_required");
    if (!profile?.address?.postalCode) addressErrors.postalCode = t("postal_code_required");
    if (!profile?.address?.country) addressErrors.country = t("country_required");

    if (Object.keys(addressErrors).length) profileErrors.address = addressErrors;
    if (Object.keys(profileErrors).length) errors.profile = profileErrors;

    return errors;
  };

  const initialValues: CreateEntityFormValues = {
    username: userData?.username || "",
    email: userData?.email || "",
    password: "",
    profile: {
      name: userData?.profile?.name || "",
      age: userData?.profile?.age || 0,
      gender: userData?.profile?.gender || "",
      dob: userData?.profile?.dob ? convertDateString(userData?.profile?.dob, true) : "",
      phone: userData?.profile?.phone || "",
      address: {
        street: userData?.profile?.address?.street || "",
        city: userData?.profile?.address?.city || "",
        state: userData?.profile?.address?.state || "",
        postalCode: userData?.profile?.address?.postalCode || "",
        country: userData?.profile?.address?.country || "",
      },
    },
    role: userData?.role || "",
  };

  return (
    <Form
      onSubmit={handleCreateEntitySubmit}
      initialValues={initialValues}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 mb-4">
          {/* Text fields can be dynamically rendered here */}
          {[
            { name: "username", type: "text" },
            { name: "email", type: "email" },
            ...(create ? [{ name: "password", type: "password" }] : []),
          ].map(({ name, type }) => (
            <Field key={name} name={name}>
              {({ input, meta }) => (
                <div>
                  <label className="block text-sm font-medium" htmlFor={name}>
                    {t(name)}
                  </label>
                  <input
                    {...input}
                    id={name}
                    type={type}
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg"
                    placeholder={t(`enter_${name}`)}
                  />
                  {meta.touched && meta.error && (
                    <span className="text-sm text-red-500">{meta.error}</span>
                  )}
                </div>
              )}
            </Field>
          ))}

          {/* Profile fields */}
          {[
            "name",
            "age",
            "gender",
            "dob",
            "phone",
            "address.street",
            "address.city",
            "address.state",
            "address.postalCode",
            "address.country",
          ].map((field) => {
            const labelKey = field.split(".").pop();
            const name = `profile${field.includes(".") ? "[" + field.split(".").join("][") + "]" : `[${field}]`}`;

            return (
              <Field key={name} name={name}>
                {({ input, meta }) => (
                  <div>
                    <label className="block text-sm font-medium" htmlFor={name}>
                      {t(labelKey)}
                    </label>
                    <input
                      {...input}
                      id={name}
                      type={labelKey === "dob" ? "date" : "text"}
                      className="w-full px-4 py-2 mt-1 text-sm border rounded-lg"
                      placeholder={t(`enter_${labelKey}`)}
                    />
                    {meta.touched && meta.error && (
                      <span className="text-sm text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>
            );
          })}

          {/* Gender */}
          <Field name="profile[gender]">
            {({ input, meta }) => (
              <div>
                <label className="block text-sm font-medium">{t("gender")}</label>
                <select {...input} className="w-full px-4 py-2 mt-1 text-sm border rounded-lg">
                  <option value="">{t("select_gender")}</option>
                  <option value="male">{t("male")}</option>
                  <option value="female">{t("female")}</option>
                  <option value="other">{t("other")}</option>
                </select>
                {meta.touched && meta.error && (
                  <span className="text-sm text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          {/* Role */}
          <Field name="role">
            {({ input, meta }) => (
              <div>
                <label className="block text-sm font-medium">{t("role")}</label>
                <select {...input} className="w-full px-4 py-2 mt-1 text-sm border rounded-lg">
                  <option value="">{t("select_role")}</option>
                  <option value="admin">{t("admin")}</option>
                  <option value="student">{t("student")}</option>
                </select>
                {meta.touched && meta.error && (
                  <span className="text-sm text-red-500">{meta.error}</span>
                )}
              </div>
            )}
          </Field>

          <div className="col-span-3 mt-4">
            <Button type="submit" disabled={submitting || pristine}>
              {t(create ? "create" : "update")}
            </Button>
          </div>
        </form>
      )}
    />
  );
};

export default CreateUserForm;
