import { authClient } from "@/lib/auth-client";
import { Button, buttonVariants } from "@jobtracker/ui/components/button";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { applicationsQueryOptions } from "@/features/applications/queries";

export const Route = createFileRoute("/_authenticated/applications/")({
  loader: ({ context: { queryClient } }) =>
    queryClient.query(applicationsQueryOptions()),
  pendingComponent: () => <div>Loading...</div>,
  errorComponent: ({ error }) => <div>Error: {error.message}</div>,
  component: RouteComponent,
});

function RouteComponent() {
  const { session } = Route.useRouteContext();
  const { data: applications } = useSuspenseQuery(applicationsQueryOptions());
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
      <main>
        <ul>
          {applications.map((application) => (
            <li>
              <h1>{application.companyName}</h1>
              <p>{application.roleTitle}</p>
              <a
                href={`/applications/${application.id}`}
                className={buttonVariants({ variant: "secondary" })}
              >
                Detail
              </a>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
