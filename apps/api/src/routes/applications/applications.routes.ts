import { createRoute, z } from "@hono/zod-openapi";
import {
  insertApplicationsSchema,
  selectApplicationsSchema,
} from "../../db/schema";
import { createErrorSchema } from "../../lib/create-error-schema";
import { jsonContent } from "../../lib/json-content";
import { jsonContentRequired } from "../../lib/json-content-required";
import { IdParamsSchema } from "../../lib/id-params";
import { StatusCodes } from "http-status-codes";
import { notFoundSchema } from "../../lib/constants";

const tags = ["Applications"];

export const list = createRoute({
  tags,
  path: "/",
  method: "get",
  responses: {
    [StatusCodes.OK as 200]: jsonContent(
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
    [StatusCodes.OK as 200]: jsonContent(
      selectApplicationsSchema,
      "The created job application."
    ),
    [StatusCodes.UNPROCESSABLE_ENTITY as 422]: jsonContent(
      createErrorSchema(insertApplicationsSchema),
      "The validation error(s)."
    ),
  },
});

export const getOne = createRoute({
  tags,
  path: "/{id}",
  method: "get",
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [StatusCodes.OK as 200]: jsonContent(
      selectApplicationsSchema,
      "The requested job application"
    ),
    [StatusCodes.NOT_FOUND as 404]: jsonContent(
      notFoundSchema,
      "Job application not found"
    ),
    [StatusCodes.UNPROCESSABLE_ENTITY as 422]: jsonContent(
      createErrorSchema(IdParamsSchema),
      "Invalid id error"
    ),
  },
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
