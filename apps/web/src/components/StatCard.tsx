import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@jobtracker/ui/components/card";

interface StatCardProps {
  label: string;
  value: string;
  subtitle: string;
}

export const StatCard = ({ label, value, subtitle }: StatCardProps) => {
  return (
    <div className="grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {value}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">{label}</div>
          <div className="text-muted-foreground">{subtitle}</div>
        </CardFooter>
      </Card>
    </div>
  );
};
