import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Rectangle,
} from "recharts";
import type { BarShapeProps } from "recharts";

export interface MonthlyData {
  period: string;
  count: number;
}

interface ApplicationsChartProps {
  data: MonthlyData[];
}

// Tooltip receives the full data entry via payload[0].payload
interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number; payload: MonthlyData }[];
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-sm shadow-md">
      <p className="font-medium">{payload[0].payload.period}</p>
      <p className="text-muted-foreground">{payload[0].value} applications</p>
    </div>
  );
};

const getCssVariable = (variable: string) => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
};

const formatPeriodLabel = (period: string) => {
  const [year, month] = period.split("-");
  return new Date(Number(year), Number(month) - 1).toLocaleString("default", {
    month: "short",
  });
};

export function ApplicationsChart({ data = [] }: ApplicationsChartProps) {
  const maxCount = Math.max(...data.map((d) => d.count), 0);

  const primary = `${getCssVariable("--chart-2")}`;
  const primaryMuted = `${getCssVariable("--chart-2")} / 0.5`;
  const muted = `${getCssVariable("--muted")}`;

  const CustomBar = (props: BarShapeProps) => {
    const { count } = props as BarShapeProps & { count: number };
    const fill =
      count === 0 ? muted : count === maxCount ? primary : primaryMuted;

    return <Rectangle {...props} fill={fill} />;
  };

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart
        data={data}
        barSize={20}
        margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
      >
        <XAxis
          dataKey="period"
          tickFormatter={formatPeriodLabel}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
        <Bar dataKey="count" radius={[4, 4, 0, 0]} shape={CustomBar} />
      </BarChart>
    </ResponsiveContainer>
  );
}
