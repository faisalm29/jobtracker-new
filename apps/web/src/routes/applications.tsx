import { createFileRoute } from "@tanstack/react-router";
import apiClient from "@jobtracker/api-client";

export const Route = createFileRoute("/applications")({
  loader: async () => {
    const client = apiClient("/api");
    const res = await client.applications.$get();
    const [data] = await res.json();
    return data?.companyName ?? null;
  },
  component: RouteComponent,
});

function RouteComponent() {
  const company = Route.useLoaderData();
  return (
    <div>
      <h1>Applications</h1>
      <p>{company}</p>
    </div>
  );
}
