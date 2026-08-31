import type { ChartConfig } from "@jobtracker/ui/components/chart";
import { HorizontalBarChart } from "@jobtracker/ui/components/HorizontalBarChart";
import type { SelectApplicationsSchema } from "@jobtracker/api/schema";

const STATUS_ORDER = [
  "saved",
  "applied",
  "interviewing",
  "offered",
  "accepted",
  "rejected",
  "withdrawn",
] as const;

const chartConfig = {
  count: { label: "Applications" },
  saved: { label: "Saved", color: "var(--chart-1)" },
  applied: { label: "Applied", color: "var(--chart-2)" },
  interviewing: { label: "Interviewing", color: "var(--chart-3)" },
  offered: { label: "Offered", color: "var(--chart-4)" },
  accepted: { label: "Accepted", color: "var(--chart-5)" },
  rejected: { label: "Rejected", color: "var(--chart-1)" },
  withdrawn: { label: "Withdrawn", color: "var(--chart-2)" },
} satisfies ChartConfig;

const getStatusCounts = (applications: SelectApplicationsSchema[]) => {
  const counts = Object.fromEntries(STATUS_ORDER.map((s) => [s, 0]));

  for (const app of applications) {
    if (app.status && app.status in counts) {
      counts[app.status]++;
    }
  }

  return STATUS_ORDER.map((status) => ({
    label: status,
    value: counts[status],
    fill: `var(--color-${status})`,
  }));
};

interface ApplicationStatusChartProps {
  applications: SelectApplicationsSchema[];
}

export const ApplicationStatusChart = ({
  applications,
}: ApplicationStatusChartProps) => {
  return (
    <HorizontalBarChart
      title="Applications by Status"
      description="Your current pipeline breakdown"
      data={getStatusCounts(applications)}
      config={chartConfig}
    />
  );
};
