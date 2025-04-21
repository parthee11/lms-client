import { Field, Form } from "react-final-form";
import { registerAdmin } from "../../app/controllers/auth/authController";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { toast } from "sonner";

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
        navigate("/admin-login");
      }
    } catch (error) {
      toast.error('User already exists')
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
    <div className="w-ful">
      <Card className="mx-auto mt-10 w-[450px]">
        <CardHeader>
          <CardTitle className="font-bold text-xl">Register</CardTitle>
          <CardDescription>
            Provide your username, email and password to register your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username Field */}
                <Field name="username">
                  {({ input, meta }) => (
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        {...input}
                        type="text"
                        placeholder="Enter you username"
                      />
                      {meta.touched && meta.error && (
                        <span className="text-xs text-red-500">
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
                      <Label htmlFor="email">Email</Label>
                      <Input
                        {...input}
                        type="email"
                        placeholder="Enter you email"
                      />
                      {meta.touched && meta.error && (
                        <span className="text-xs text-red-500">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>

                {/* Password Field */}
                <Field name="password">
                  {({ input, meta }) => (
                    <div>
                      <Label htmlFor="password">Password</Label>
                      <Input
                        {...input}
                        type="password"
                        placeholder="Enter you password"
                      />
                      {meta.touched && meta.error && (
                        <span className="text-xs text-red-500">
                          {meta.error}
                        </span>
                      )}
                    </div>
                  )}
                </Field>

                {/* Submit Button */}
                <Button type="submit" disabled={submitting || pristine}>
                  Register
                </Button>
              </form>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterForm;
