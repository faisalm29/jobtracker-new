import {
  queryOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { hcWithType } from "@jobtracker/api-client";
import {
  type InsertApplicationsSchema,
  type PatchApplicationsSchema,
} from "@jobtracker/api/schema";

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

export const useInsertApplicationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: InsertApplicationsSchema) => {
      const res = await client.applications.$post({
        json: data,
      });

      if (!res.ok) throw new Error("Failed to create application.");

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
    },
  });
};

export const useUpdateApplicationMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: PatchApplicationsSchema;
    }) => {
      const res = await client.applications[":id"].$patch({
        param: { id },
        json: data,
      });

      if (!res.ok) throw new Error("Failed to update application.");

      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({
        queryKey: ["applications", variables.id],
      });
      queryClient.invalidateQueries({ queryKey: ["stats"] });
    },
  });
};

export const statsQueryOptions = () =>
  queryOptions({
    queryKey: ["stats"],
    queryFn: async () => {
      const res = await client.stats.$get();
      if (!res.ok) throw new Error("Failed to fetch stats for dashboard.");
      const { data } = await res.json();
      return data;
    },
  });

export type Application = Awaited<
  ReturnType<
    NonNullable<ReturnType<typeof applicationsQueryOptions>["queryFn"]>
  >
>[number];
