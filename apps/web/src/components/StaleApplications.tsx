import type { ApplicationSummarySchema } from "@jobtracker/api/schema";
import { Link } from "@tanstack/react-router";
import { AlertCircle } from "lucide-react";

type StaleApplications = ApplicationSummarySchema & {
  daysSinceActivity: number;
};

interface StaleApplicationsProps {
  applications: StaleApplications[];
}

export const StaleApplications = ({ applications }: StaleApplicationsProps) => {
  if (applications.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No neglected applications. You're on top of things.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {applications.map((app) => (
        <Link
          key={app.id}
          to="/applications/$id/edit"
          params={{ id: app.id }}
          className="flex items-center justify-between rounded-md border border-orange-200 px-4 py-3 transition-colors hover:bg-orange-50"
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="size-4 shrink-0 text-orange-400" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{app.companyName}</span>
              <span className="text-xs text-muted-foreground">
                {app.roleTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-medium whitespace-nowrap text-orange-600">
              {app.daysSinceActivity}d no activity
            </span>
            <span className="text-xs text-muted-foreground">{app.status}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
