import { applicationQueryOptions } from "@/features/applications/queries";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/applications/$id")({
  loader: ({ context: { queryClient }, params: { id } }) =>
    queryClient.query(applicationQueryOptions(id)),
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();
  const { data: application } = useSuspenseQuery(applicationQueryOptions(id));

  return (
    <main>
      <h1>{application.roleTitle}</h1>
      <p>{application.companyName}</p>
    </main>
  );
}
