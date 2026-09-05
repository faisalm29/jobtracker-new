import {
  useUpdateApplicationMutation,
  type Application,
} from "@/features/applications/queries";
import { insertApplicationsSchema } from "@jobtracker/api/schema";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@jobtracker/ui/components/alert";
import { Button } from "@jobtracker/ui/components/button";
import { Calendar } from "@jobtracker/ui/components/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@jobtracker/ui/components/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@jobtracker/ui/components/select";
import { Textarea } from "@jobtracker/ui/components/textarea";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { CalendarIcon, TriangleAlert, XIcon } from "lucide-react";
import { z } from "zod";

const STATUS_OPTIONS = [
  { value: "saved", label: "Saved" },
  { value: "applied", label: "Applied" },
  { value: "interviewing", label: "Interviewing" },
  { value: "offered", label: "Offered" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "withdrawn", label: "Withdrawn" },
] as const;

const SOURCE_OPTIONS = [
  { value: null, label: "Select a source" },
  { value: "linkedin", label: "Linkedin" },
  { value: "glassdor", label: "Glassdor" },
  { value: "referal", label: "Referal" },
  { value: "company_website", label: "Company Website" },
  { value: "other", label: "Other" },
] as const;

const JOBTYPE_OPTIONS = [
  { value: null, label: "Select a job type" },
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
] as const;

export const editApplicationsValidation = insertApplicationsSchema.extend({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  salary: z.number().positive("Salary must be a positive number").nullish(),
  jobUrl: z.url("Must be a valid URL").nullish(),
  deadline: z.date().nullish(),
  appliedDate: z.date().nullish(),
});

export type EditApplicationsSchema = z.infer<typeof editApplicationsValidation>;

interface EditApplicationFormProps {
  application: Application;
}

export const EditApplicationForm = ({
  application,
}: EditApplicationFormProps) => {
  const { mutateAsync, isPending, error } = useUpdateApplicationMutation();
  const navigate = useNavigate();

  const defaultValues: EditApplicationsSchema = {
    companyName: application.companyName,
    roleTitle: application.roleTitle,
    status: application.status,
    salary: application.salary ?? null,
    jobUrl: application.jobUrl ?? null,
    source: application.source ?? null,
    location: application.location ?? null,
    jobType: application.jobType ?? null,
    deadline: application.deadline ? new Date(application.deadline) : null,
    notes: application.notes ?? null,
    appliedDate: application.appliedDate
      ? new Date(application.appliedDate)
      : null,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: editApplicationsValidation,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync({
        id: application.id,
        data: value,
      });

      navigate({
        to: "/applications/$id",
        params: { id: application.id },
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Application</CardTitle>
        <CardDescription>
          Update the application details for {application.companyName}
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
            {error && (
              <Field>
                <Alert variant="destructive">
                  <TriangleAlert className="size-4" />
                  <AlertTitle>Update Failed</AlertTitle>
                  <AlertDescription>{error.message}</AlertDescription>
                </Alert>
              </Field>
            )}

            {/* Company Name */}
            <form.Field
              name="companyName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Company Name</FieldLabel>
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
                  </Field>
                );
              }}
            />

            {/* Role Title */}
            <form.Field
              name="roleTitle"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Role Title</FieldLabel>
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
                  </Field>
                );
              }}
            />

            {/* Status */}
            <form.Field
              name="status"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select
                      items={STATUS_OPTIONS}
                      value={field.state.value}
                      onValueChange={(value) => {
                        if (value) {
                          field.handleChange(value as typeof field.state.value);
                        }
                      }}
                    >
                      <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Statuses</SelectLabel>
                          {STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Salary */}
            <form.Field
              name="salary"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Salary</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value ?? ""}
                      type="number"
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value === "" || isNaN(e.target.valueAsNumber)
                            ? null
                            : e.target.valueAsNumber
                        )
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Job URL */}
            <form.Field
              name="jobUrl"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Job URL</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value ?? ""}
                      type="text"
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value.trim() === ""
                            ? null
                            : e.target.value.trim()
                        )
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Source */}
            <form.Field
              name="source"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Source</FieldLabel>
                    <Select
                      items={SOURCE_OPTIONS}
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value as typeof field.state.value);
                      }}
                    >
                      <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sources</SelectLabel>
                          {SOURCE_OPTIONS.map((source) => (
                            <SelectItem
                              key={String(source.value)}
                              value={source.value}
                            >
                              {source.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Location */}
            <form.Field
              name="location"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value ?? ""}
                      type="text"
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value.trim() === ""
                            ? null
                            : e.target.value.trim()
                        )
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Job Type */}
            <form.Field
              name="jobType"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Job Type</FieldLabel>
                    <Select
                      items={JOBTYPE_OPTIONS}
                      value={field.state.value}
                      onValueChange={(value) => {
                        field.handleChange(value as typeof field.state.value);
                      }}
                    >
                      <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Job Types</SelectLabel>
                          {JOBTYPE_OPTIONS.map((jobType) => (
                            <SelectItem
                              key={String(jobType.value)}
                              value={jobType.value}
                            >
                              {jobType.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Deadline */}
            <form.Field
              name="deadline"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Deadline</FieldLabel>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              variant="outline"
                              className="flex-1 justify-start"
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {field.state.value
                                ? format(field.state.value, "PPP")
                                : "Pick a date"}
                            </Button>
                          }
                        />
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              field.state.value
                                ? new Date(field.state.value)
                                : undefined
                            }
                            onSelect={(date) =>
                              field.handleChange(date ?? null)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      {field.state.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => field.handleChange(null)}
                          title="Clear deadline"
                        >
                          <XIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Notes */}
            <form.Field
              name="notes"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value ?? ""}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value.trim() === "" ? null : e.target.value
                        )
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Applied Date */}
            <form.Field
              name="appliedDate"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Applied Date</FieldLabel>
                    <div className="flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger
                          render={
                            <Button
                              variant="outline"
                              className="flex-1 justify-start"
                            >
                              <CalendarIcon className="mr-2 size-4" />
                              {field.state.value
                                ? format(field.state.value, "PPP")
                                : "Pick a date"}
                            </Button>
                          }
                        />
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={
                              field.state.value
                                ? new Date(field.state.value)
                                : undefined
                            }
                            onSelect={(date) =>
                              field.handleChange(date ?? null)
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      {field.state.value && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => field.handleChange(null)}
                          title="Clear applied date"
                        >
                          <XIcon className="size-4" />
                        </Button>
                      )}
                    </div>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />

            {/* Action buttons */}
            <Field className="flex flex-row justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate({
                    to: "/applications/$id",
                    params: { id: application.id },
                  })
                }
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};
