import { Field, Form } from "react-final-form";
import { Button, buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Link } from "react-router-dom";

export interface LoginFormValues {
  email: string;
  password: string;
}

interface LoginFormProps {
  handleLoginSubmit: (data: LoginFormValues) => Promise<void>;
  isAdmin: boolean;
}

const LoginForm = ({ handleLoginSubmit, isAdmin }: LoginFormProps) => {
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
    <div className="w-full">
      <Card className="mx-auto mt-10 w-[450px]">
        <CardHeader>
          <CardTitle className="font-bold text-xl">
            {isAdmin ? "Admin" : "Student"} Login
          </CardTitle>
          <CardDescription>
            Provide your email and password to login into your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form
            onSubmit={onSubmit}
            validate={validate}
            render={({ handleSubmit, submitting, pristine }) => (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting || pristine}>
                    Login
                  </Button>
                  {isAdmin && (
                    <Link
                      to="/admin-register"
                      className={`${buttonVariants({ variant: "outline" })}`}
                    >
                      Register
                    </Link>
                  )}
                </div>
              </form>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
