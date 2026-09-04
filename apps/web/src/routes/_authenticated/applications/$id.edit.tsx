import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/applications/$id/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/_authenticated/applications/$id/edit"!</div>;
}
