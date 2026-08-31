// import type { Application } from "../features/applications/queries";
import type { SelectApplicationsSchema } from "@jobtracker/api/schema";

const STATUS_LABELS: Record<string, string> = {
  saved: "Saved",
  applied: "Applied",
  interviewing: "Interviewing",
  offered: "Offered",
  accepted: "Accepted",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

const STATUS_ORDER = [
  "saved",
  "applied",
  "interviewing",
  "offered",
  "accepted",
  "rejected",
  "withdrawn",
];

export const getStatusCounts = (applications: SelectApplicationsSchema[]) => {
  const counts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]));

  for (const app of applications) {
    if (app.status && app.status in counts) {
      counts[app.status]++;
    }
  }

  return STATUS_ORDER.map((status) => ({
    status: STATUS_LABELS[status],
    count: counts[status],
  }));
};
