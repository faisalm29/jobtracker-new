import type { ApplicationSummarySchema } from "@jobtracker/api/schema";
import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";

const STATUS_COLORS: Record<string, string> = {
  saved: "bg-slate-100 text-slate-600",
  applied: "bg-blue-100 text-blue-700",
  interviewing: "bg-yellow-100 text-yellow-700",
  offered: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
  accepted: "bg-emerald-100 text-emerald-700",
};

interface RecentApplicationsProps {
  recentApplications: ApplicationSummarySchema[];
}

export const RecentApplications = ({
  recentApplications,
}: RecentApplicationsProps) => {
  if (recentApplications.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No applications yet.</p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {recentApplications.map((app) => (
        <Link
          key={app.id}
          to="/applications/$id/edit"
          params={{ id: app.id }}
          className="flex items-center justify-between rounded-md border px-4 py-3 transition-colors hover:bg-muted"
        >
          <div className="flex flex-col">
            <span className="text-sm font-medium">{app.companyName}</span>
            <span className="text-xs text-muted-foreground">
              {app.roleTitle}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[app.status]}`}
            >
              {app.status}
            </span>
            <span className="text-xs whitespace-nowrap text-muted-foreground">
              {formatDistanceToNow(new Date(app.updatedAt ?? app.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};
