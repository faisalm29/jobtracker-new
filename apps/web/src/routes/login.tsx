import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
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
import { Button, buttonVariants } from "@jobtracker/ui/components/button";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@jobtracker/ui/components/alert";
import { cn } from "@jobtracker/ui/lib/utils";
import { authClient } from "../lib/auth-client";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { TriangleAlert } from "lucide-react";

interface Account {
  email: string;
  password: string;
}

const defaultAccount: Account = {
  email: "",
  password: "",
};

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const { data: session } = await authClient.getSession();

    if (session) {
      throw redirect({
        to: "/applications",
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: defaultAccount,
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: async ({ value }) => {
      setIsLoading(true);
      const { error } = await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },

        {
          onSuccess: () => {
            navigate({ to: "/applications" });
          },
        }
      );

      if (error) {
        setServerError(error.message ?? "Login failed. Please try again.");
        setIsLoading(false);
      }

      setIsLoading(false);
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
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
}
