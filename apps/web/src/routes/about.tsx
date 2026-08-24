import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@jobtracker/ui/components/button";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <div className="p-2">
      <h1>Hello from About!</h1>
      <Button type="button" variant="destructive">
        Button
      </Button>
    </div>
  );
}
