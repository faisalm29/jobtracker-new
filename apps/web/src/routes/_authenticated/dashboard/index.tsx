import { createFileRoute } from "@tanstack/react-router";
import { ApplicationStatusChart } from "@/components/ApplicationStatusChart";
import { applicationsQueryOptions } from "@/features/applications/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ActivePipelineCount } from "@/components/ActivePipelineCount";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.query(applicationsQueryOptions()),
  component: RouteComponent,
});

function RouteComponent() {
  const { data: applications } = useSuspenseQuery(applicationsQueryOptions());

  return (
    <main>
      <h1>Dashboard</h1>
      <ActivePipelineCount />
      <ApplicationStatusChart applications={applications} />
    </main>
  );
}
