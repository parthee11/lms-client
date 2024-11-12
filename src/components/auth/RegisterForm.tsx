import { Field, Form } from "react-final-form";
import { registerAdmin } from "../../app/controllers/auth/authController";
import { useNavigate } from "react-router-dom";

export interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}

const RegisterForm = () => {
  const navigate = useNavigate();
  const onSubmit = async (values: RegisterFormValues) => {
    try {
      const response = await registerAdmin(values);
      if (response?.status === 201) {
        navigate('/admin-login')
      }
    } catch (error) {
      console.error("Error registering admin:", error?.response?.data || error);
    }
  };

  const validate = (values: RegisterFormValues) => {
    const errors: Partial<RegisterFormValues> = {};

    if (!values.username) {
      errors.username = "Username is required";
    } else if (values.username.length < 3) {
      errors.username = "Username must be at least 3 characters long";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }

    if (!values.password) {
      errors.password = "Password is required";
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }

    return errors;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Register</h2>
        <Form
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit, submitting, pristine }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <Field name="username">
                {({ input, meta }) => (
                  <div>
                    <label className="block text-sm font-medium">
                      Username
                    </label>
                    <input
                      {...input}
                      type="text"
                      placeholder="Enter your username"
                      className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {meta.touched && meta.error && (
                      <span className="text-sm text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              {/* Email Field */}
              <Field name="email">
                {({ input, meta }) => (
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      {...input}
                      type="email"
                      placeholder="Enter your email"
                      className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    {meta.touched && meta.error && (
                      <span className="text-sm text-red-500">{meta.error}</span>
                    )}
                  </div>
                )}
              </Field>

              {/* Password Field */}
              <Field name="password">
                {({ input, meta }) => (
                  <div>
                    <label className="block text-sm font-medium">
                      Password
                    </label>
                    <input
                      {...input}
                      type="password"
                      placeholder="Enter your password"
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
                Register
              </button>
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default RegisterForm;
