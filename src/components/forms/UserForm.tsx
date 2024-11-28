import { Field, Form } from "react-final-form";
import {
  createUser,
  updateUser,
} from "../../app/controllers/user/userController";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { convertDateString } from "@/app/utils";

export interface CreateEntityFormValues {
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
  const userData = state?.user;

  const handleCreateEntitySubmit = async (data: CreateEntityFormValues) => {
    try {
      const userDataToSubmit = { ...data };

      if (!create) {
        delete userDataToSubmit.password;
      }

      if (create) {
        await createUser(userDataToSubmit);
        navigate("/dashboard");
      } else {
        await updateUser(userDataToSubmit, userData?._id);
        navigate(`/users`);
      }
    } catch (error) {
      console.log("Error >>>", error);
    }
  };

  const validate = (values: CreateEntityFormValues) => {
    const errors: Partial<CreateEntityFormValues> = {};

    if (!values.username) errors.username = "Username is required";
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (create && !values.password) {
      errors.password = "Password is required";
    }

    const profileErrors: Partial<CreateEntityFormValues["profile"]> = {};
    if (!values.profile?.name) profileErrors.name = "Name is required";
    if (!values.profile?.age) profileErrors.age = "Age is required";
    if (!values.profile?.gender) profileErrors.gender = "Gender is required";
    if (!values.profile?.dob) profileErrors.dob = "Date of Birth is required";
    if (!values.profile?.phone)
      profileErrors.phone = "Phone number is required";

    const addressErrors: Partial<CreateEntityFormValues["profile"]["address"]> =
      {};
    if (!values.profile?.address?.street)
      addressErrors.street = "Street is required";
    if (!values.profile?.address?.city) addressErrors.city = "City is required";
    if (!values.profile?.address?.state)
      addressErrors.state = "State is required";
    if (!values.profile?.address?.postalCode)
      addressErrors.postalCode = "Postal Code is required";
    if (!values.profile?.address?.country)
      addressErrors.country = "Country is required";

    if (Object.keys(addressErrors).length)
      profileErrors.address = addressErrors;
    if (Object.keys(profileErrors).length) errors.profile = profileErrors;

    return errors;
  };

  // Initial values for the form, either from userData or default empty values
  const initialValues: CreateEntityFormValues = {
    username: userData?.username || "",
    email: userData?.email || "",
    password: "",
    profile: {
      name: userData?.profile?.name || "",
      age: userData?.profile?.age || 0,
      gender: userData?.profile?.gender || "",
      dob: userData?.profile?.dob
        ? convertDateString(userData?.profile?.dob, true)
        : "",
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

  console.log("init values >>>", initialValues);

  return (
    <Form
      onSubmit={handleCreateEntitySubmit}
      initialValues={initialValues}
      validate={validate}
      render={({ handleSubmit, submitting, pristine }) => (
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {/* Username Field */}
            <Field name="username">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    {...input}
                    type="text"
                    id="username"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter your username"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error ? "username-error" : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span id="username-error" className="text-sm text-red-500">
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            {/* Email Field */}
            <Field name="email">
              {({ input, meta }) => (
                <div>
                  <label className="block text-sm font-medium" htmlFor="email">
                    Email
                  </label>
                  <input
                    {...input}
                    type="email"
                    id="email"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter your email"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error ? "email-error" : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span id="email-error" className="text-sm text-red-500">
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            {/* Password Field */}
            {create && (
              <Field name="password">
                {({ input, meta }) => (
                  <div>
                    <label
                      className="block text-sm font-medium"
                      htmlFor="password"
                    >
                      Password
                    </label>
                    <input
                      {...input}
                      type="password"
                      id="password"
                      className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Enter your password"
                      aria-invalid={meta.touched && !!meta.error}
                      aria-describedby={
                        meta.touched && meta.error
                          ? "password-error"
                          : undefined
                      }
                    />
                    {meta.touched && meta.error && (
                      <span
                        id="password-error"
                        className="text-sm text-red-500"
                      >
                        {meta.error}
                      </span>
                    )}
                  </div>
                )}
              </Field>
            )}

            {/* Profile Fields */}
            <Field name="profile[name]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="profile-name"
                  >
                    Name
                  </label>
                  <input
                    {...input}
                    type="text"
                    id="profile-name"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter your name"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "profile-name-error"
                        : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span
                      id="profile-name-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            <Field name="profile[age]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="profile-age"
                  >
                    Age
                  </label>
                  <input
                    {...input}
                    type="number"
                    id="profile-age"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter your age"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "profile-age-error"
                        : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span
                      id="profile-age-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            <Field name="profile[gender]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="profile-gender"
                  >
                    Gender
                  </label>
                  <select
                    {...input}
                    id="profile-gender"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "profile-gender-error"
                        : undefined
                    }
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {meta.touched && meta.error && (
                    <span
                      id="profile-gender-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            <Field name="profile[dob]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="profile-dob"
                  >
                    Date of Birth
                  </label>
                  <input
                    {...input}
                    type="date"
                    id="profile-dob"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "profile-dob-error"
                        : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span
                      id="profile-dob-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            <Field name="profile[phone]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="profile-phone"
                  >
                    Phone
                  </label>
                  <input
                    {...input}
                    type="tel"
                    id="profile-phone"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter your phone number"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "profile-phone-error"
                        : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span
                      id="profile-phone-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            {/* Address Fields */}
            <Field name="profile[address][street]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="address-street"
                  >
                    Street
                  </label>
                  <input
                    {...input}
                    type="text"
                    id="address-street"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter street address"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "address-street-error"
                        : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span
                      id="address-street-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            <Field name="profile[address][city]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="address-city"
                  >
                    City
                  </label>
                  <input
                    {...input}
                    type="text"
                    id="address-city"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter city"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "address-city-error"
                        : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span
                      id="address-city-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            <Field name="profile[address][state]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="address-state"
                  >
                    State
                  </label>
                  <input
                    {...input}
                    type="text"
                    id="address-state"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter state"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "address-state-error"
                        : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span
                      id="address-state-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            <Field name="profile[address][postalCode]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="address-postalCode"
                  >
                    Postal Code
                  </label>
                  <input
                    {...input}
                    type="text"
                    id="address-postalCode"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter postal code"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "address-postalCode-error"
                        : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span
                      id="address-postalCode-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            <Field name="profile[address][country]">
              {({ input, meta }) => (
                <div>
                  <label
                    className="block text-sm font-medium"
                    htmlFor="address-country"
                  >
                    Country
                  </label>
                  <input
                    {...input}
                    type="text"
                    id="address-country"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter country"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error
                        ? "address-country-error"
                        : undefined
                    }
                  />
                  {meta.touched && meta.error && (
                    <span
                      id="address-country-error"
                      className="text-sm text-red-500"
                    >
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>

            {/* Role Field */}
            <Field name="role">
              {({ input, meta }) => (
                <div>
                  <label className="block text-sm font-medium" htmlFor="role">
                    Role
                  </label>
                  <select
                    {...input}
                    id="role"
                    className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    aria-invalid={meta.touched && !!meta.error}
                    aria-describedby={
                      meta.touched && meta.error ? "role-error" : undefined
                    }
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="student">Student</option>
                  </select>
                  {meta.touched && meta.error && (
                    <span id="role-error" className="text-sm text-red-500">
                      {meta.error}
                    </span>
                  )}
                </div>
              )}
            </Field>
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={submitting || pristine}>
            {create ? "Create" : "Update"}
          </Button>
        </form>
      )}
    />
  );
};

export default CreateUserForm;
