import { EditApplicationForm } from "@/components/EditApplicationForm";
import { applicationQueryOptions } from "@/features/applications/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/applications/$id/edit")({
  loader: async ({ context: { queryClient }, params: { id } }) =>
    queryClient.query(applicationQueryOptions(id)),
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: application } = useSuspenseQuery(applicationQueryOptions(id));
  return (
    <main className="container mx-auto max-w-2xl py-6">
      <EditApplicationForm application={application} />
    </main>
  );
}
