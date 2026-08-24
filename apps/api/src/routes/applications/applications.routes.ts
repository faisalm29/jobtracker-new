import { createRoute, z } from "@hono/zod-openapi";
import {
  insertApplicationsSchema,
  selectApplicationsSchema,
} from "../../db/schema";
import { createErrorSchema } from "../../lib/create-error-schema";
import { jsonContent } from "../../lib/json-content";
import { jsonContentRequired } from "../../lib/json-content-required";

const tags = ["Applications"];

export const list = createRoute({
  tags,
  path: "/",
  method: "get",
  responses: {
    200: jsonContent(
      z.array(selectApplicationsSchema),
      "The list of job applications"
    ),
  },
});

export const create = createRoute({
  tags,
  path: "/",
  method: "post",
  request: {
    body: jsonContentRequired(
      insertApplicationsSchema,
      "The job application to create."
    ),
  },
  responses: {
    200: jsonContent(selectApplicationsSchema, "The created job application."),
    422: jsonContent(
      createErrorSchema(insertApplicationsSchema),
      "The validation error(s)."
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
