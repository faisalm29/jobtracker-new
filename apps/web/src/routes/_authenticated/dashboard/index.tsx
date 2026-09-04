import { createFileRoute } from "@tanstack/react-router";
import { ApplicationStatusChart } from "@/components/ApplicationStatusChart";
import { statsQueryOptions } from "@/features/applications/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ActivePipelineCount } from "@/components/ActivePipelineCount";
import { StatCard } from "@/components/StatCard";
import { RecentApplications } from "@/components/RecentApplications";

import { StaleApplications } from "@/components/StaleApplications";
import { ApplicationsChart } from "@/components/ApplicationsChart";
import { TimeInStage } from "@/components/TimeInStage";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.query(statsQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data } = useSuspenseQuery(statsQueryOptions());

  return (
    <main>
      <h1>Dashboard</h1>
      <ActivePipelineCount totalActivePipeline={data.activePipelineCount} />
      <StatCard
        label="Response Rate"
        value={data.responseRate !== null ? `${data.responseRate}%` : "-"}
        subtitle={
          data.responseRate !== null
            ? `${data.responseMeta.responded} of ${data.responseMeta.total} applicaitons`
            : "No applications yet"
        }
      />
      <RecentApplications recentApplications={data.recentApplications} />
      <StaleApplications applications={data.staleApplications} />
      <ApplicationsChart data={data.applicationsByMonth} />
      <TimeInStage applications={data.timeInStage} />
      <ApplicationStatusChart breakdown={data.breakdown} />
    </main>
  );
}
