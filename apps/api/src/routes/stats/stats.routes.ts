import { createRoute, z } from "@hono/zod-openapi";
import { StatusCodes } from "http-status-codes";
import { jsonContent } from "../../lib/json-content";
import { selectStatsSchema } from "../../db/schema";

const tags = ["Dashboard"];

export const stats = createRoute({
  tags,
  path: "/",
  method: "get",
  responses: {
    [StatusCodes.OK as 200]: jsonContent(
      selectStatsSchema,
      "Dashboard statistics"
    ),
  },
});

export type StatsRoute = typeof stats;
