import { useInsertApplicationMutation } from "@/features/applications/queries";
import { insertApplicationsSchema } from "@jobtracker/api/schema";
import { Button } from "@jobtracker/ui/components/button";
import { Calendar } from "@jobtracker/ui/components/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@jobtracker/ui/components/popover";
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
import { z } from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

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

const insertApplicationsValidation = insertApplicationsSchema.extend({
  companyName: z.string().min(1, "Company name is required"),
  roleTitle: z.string().min(1, "Role title is required"),
  salary: z.number().positive("Salary must be a positve number").nullish(),
  jobUrl: z.url("Must be a valid URL").nullish(),
  deadline: z.date().nullish(),
  appliedDate: z.date().nullish(),
});

type InsertApplicationsSchema = z.infer<typeof insertApplicationsValidation>;

const defaultApplication: InsertApplicationsSchema = {
  companyName: "",
  roleTitle: "",
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

export const InsertApplicationForm = () => {
  const { mutateAsync, error } = useInsertApplicationMutation();

  const form = useForm({
    defaultValues: defaultApplication,
    validators: {
      onSubmit: insertApplicationsValidation,
    },
    onSubmit: async ({ value }) => {
      await mutateAsync(value);
    },
  });

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
            <form.Field
              name="companyName"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <>
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
                  </>
                );
              }}
            />
            <form.Field
              name="roleTitle"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <>
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
                  </>
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
                  <>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select
                      items={STATUS_OPTIONS}
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
                  </>
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
                  <>
                    <FieldLabel htmlFor={field.name}>Salary</FieldLabel>
                    <Input
                      id={field.name}
                      value={Number(field.state.value)}
                      type="number"
                      onChange={(e) =>
                        field.handleChange(e.target.valueAsNumber)
                      }
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </>
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
                  <>
                    <FieldLabel htmlFor={field.name}>Job URL</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value ?? ""}
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
            />

            {/* Source */}
            <form.Field
              name="source"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <>
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
                            <SelectItem key={source.value} value={source.value}>
                              {source.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </>
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
                  <>
                    <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value ?? ""}
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
            />

            {/* Job Type */}
            <form.Field
              name="jobType"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <>
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
                              key={jobType.value}
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
                  </>
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
                  <>
                    <FieldLabel htmlFor={field.name}>Deadline</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button variant="outline">
                            <CalendarIcon />
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
                          onSelect={(date) => field.handleChange(date ?? null)}
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </>
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
                  <>
                    <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value ?? ""}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </>
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
                  <>
                    <FieldLabel htmlFor={field.name}>Applied Date</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button variant="outline">
                            <CalendarIcon />
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
                          onSelect={(date) => field.handleChange(date ?? null)}
                        />
                      </PopoverContent>
                    </Popover>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </>
                );
              }}
            />
            <Field>
              <Button type="submit">Submit</Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
};

{
  /* <form.Field
              name="status"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <>
                    <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                    <Select
                      items={STATUS_OPTIONS}
                      value={field.state.value}
                      onValueChange={(val) => {
                        if (val) {
                          field.handleChange(val as typeof field.state.value);
                        }
                      }}
                    >
                      <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </>
                );
              }}
            /> */
}
