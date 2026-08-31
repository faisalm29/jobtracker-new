import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "./chart";

interface BarChartItem {
  label: string;
  value: number;
  fill?: string;
}

interface HorizontalBarChartProps {
  title: string;
  description?: string;
  data: BarChartItem[];
  config: ChartConfig;
}

export const HorizontalBarChart = ({
  config,
  data,
  title,
  description,
}: HorizontalBarChartProps) => {
  const chartData = data.map((item) => ({
    label: item.label,
    value: item.value,
    fill: item.fill,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={config}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey="label"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                config[value as keyof typeof config]?.label ?? value
              }
            />
            <XAxis dataKey="value" type="number" hide allowDecimals={false} />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
