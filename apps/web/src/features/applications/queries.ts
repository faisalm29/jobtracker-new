import { queryOptions } from "@tanstack/react-query";
import { hcWithType } from "@jobtracker/api-client";

const client = hcWithType("http://localhost:8787", {
  init: {
    credentials: "include",
  },
});

export const applicationsQueryOptions = () =>
  queryOptions({
    queryKey: ["applications"],
    queryFn: async () => {
      // await new Promise((resolve) => setTimeout(resolve, 3000));
      const res = await client.applications.$get();
      if (!res.ok) throw new Error("Failed to fetch applications.");
      return res.json();
    },
  });

export const applicationQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["applications", id],
    queryFn: async () => {
      const res = await client.applications[":id"].$get({
        param: {
          id,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch applications.");

      return res.json();
    },
  });

export type Application = Awaited<
  ReturnType<
    NonNullable<ReturnType<typeof applicationsQueryOptions>["queryFn"]>
  >
>[number];
