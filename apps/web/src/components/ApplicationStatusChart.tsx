import type { ChartConfig } from "@jobtracker/ui/components/chart";
import { HorizontalBarChart } from "@jobtracker/ui/components/HorizontalBarChart";

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

type StatusBreakdown = Partial<Record<(typeof STATUS_ORDER)[number], number>>;

interface ApplicationStatusChartProps {
  breakdown: StatusBreakdown;
}

export const ApplicationStatusChart = ({
  breakdown,
}: ApplicationStatusChartProps) => {
  const data = STATUS_ORDER.filter(
    (status) => (breakdown[status] ?? 0) > 0
  ).map((status) => ({
    label: status,
    value: breakdown[status] ?? 0,
    fill: `var(--color-${status})`,
  }));

  return (
    <HorizontalBarChart
      title="Applications by Status"
      description="Your current pipeline breakdown"
      data={data}
      config={chartConfig}
    />
  );
};
