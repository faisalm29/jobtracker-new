import type { ApplicationSummarySchema } from "@jobtracker/api/schema";
import { Link } from "@tanstack/react-router";
import { Clock } from "lucide-react";

const URGENCY_THRESHOLDS = {
  interviewing: {
    warn: 5,
    danger: 10,
  },
  offered: {
    warn: 3,
    danger: 7,
  },
} as const;

const getUrgencyClass = (status: string, days: number) => {
  const threshold =
    URGENCY_THRESHOLDS[status as keyof typeof URGENCY_THRESHOLDS];
  if (!threshold) return "text-muted-foreground";
  if (days >= threshold.danger) return "text-red-500 font-semibold";
  if (days >= threshold.warn) return "text-orange-500 front-medium";
  return "text-muted-foreground";
};

const STATUS_COLORS: Record<"interviewing" | "offered", string> = {
  interviewing: "bg-yellow-100 text-yellow-700",
  offered: "bg-green-100 text-green-700",
};

type Applications = ApplicationSummarySchema & {
  stageEnteredAt: string | null;
  daysInStage: number;
};

interface TimeInStageProps {
  applications: Applications[];
}

export const TimeInStage = ({ applications }: TimeInStageProps) => {
  if (applications.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No active interviews or offers.
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
          className="flex items-center justify-between rounded-md border px-4 py-3 transition-colors hover:bg-muted"
        >
          <div className="flex items-center gap-3">
            <Clock className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex flex-col">
              <span className="text-sm font-medium">{app.companyName}</span>
              <span className="text-xs text-muted-foreground">
                {app.roleTitle}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[app.status as "interviewing" | "offered"]}`}
            >
              {app.status}
            </span>
            <span
              className={`text-xs whitespace-nowrap ${getUrgencyClass(app.status, app.daysInStage)}`}
            >
              {app.daysInStage}d in stage
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};
