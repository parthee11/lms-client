import { Field, Form } from "react-final-form";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  handleLoginSubmit: (data: LoginFormValues) => Promise<void>;
}

const LoginForm = ({ handleLoginSubmit }: LoginFormProps) => {
  const onSubmit = (values: LoginFormValues) => {
    handleLoginSubmit(values);
  };

  const validate = (values: LoginFormValues) => {
    const errors: Partial<LoginFormValues> = {};
    if (!values.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Password is required";
    }
    return errors;
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        <Form
          onSubmit={onSubmit}
          validate={validate}
          render={({ handleSubmit, submitting, pristine }) => (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <Field name="email">
                {({ input, meta }) => (
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <input
                      {...input}
                      type="email"
                      className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Enter your email"
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
                      className="w-full px-4 py-2 mt-1 text-sm border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                      placeholder="Enter your password"
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
                Login
              </button>
            </form>
          )}
        />
      </div>
    </div>
  );
};

export default LoginForm;
