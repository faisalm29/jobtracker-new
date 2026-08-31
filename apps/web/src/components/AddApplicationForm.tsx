import type { PatchApplicationsSchema } from "@jobtracker/api/schema";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@jobtracker/ui/components/alert";
import { Button, buttonVariants } from "@jobtracker/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@jobtracker/ui/components/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@jobtracker/ui/components/field";
import { Input } from "@jobtracker/ui/components/input";
import { TriangleAlert } from "lucide-react";

const defaultApplication: PatchApplicationsSchema = {
  companyName: null,
  roleTitle: null,
  status: "saved",
  salary: null,
  jobUrl: null,
  source: null,
  location: null,
  jobType: null,
  deadline: null,
  notes: null,
  appliedDate: null,
};

export const AddApplicationForm = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>New Application</CardTitle>
        <CardDescription>
          Fill up the form below to add a job application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
        >
          <FieldGroup>
            {serverError && (
              <Field>
                <Alert variant="destructive">
                  <TriangleAlert />
                  <AlertTitle>Login Failed</AlertTitle>
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              </Field>
            )}
            <form.Field
              name="email"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      type="text"
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </>
                );
              }}
            ></form.Field>
            <form.Field
              name="password"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <>
                    <div className="flex items-center">
                      <FieldLabel htmlFor={field.name}>Password</FieldLabel>
                      <a
                        href="#"
                        className={cn(
                          buttonVariants({ variant: "link" }),
                          "ml-auto p-0 text-primary"
                        )}
                      >
                        Forgot your password?
                      </a>
                    </div>
                    <Input
                      id={field.name}
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </>
                );
              }}
            ></form.Field>
            <Field>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
