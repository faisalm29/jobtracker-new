import { authClient } from "@/lib/auth-client";
import { Button } from "@jobtracker/ui/components/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_authenticated/applications/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const logout = async () => {
    setIsLoading(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          navigate({
            to: "/login",
          });
        },
      },
    });
    setIsLoading(false);
  };
  return (
    <div>
      <h1>Applications</h1>
      <p>Welcome, {session.user.name}</p>
      <Button
        type="button"
        variant="destructive"
        disabled={isLoading}
        onClick={logout}
      >
        {isLoading ? "Logging out..." : "Logout"}
      </Button>
    </div>
  );
}
