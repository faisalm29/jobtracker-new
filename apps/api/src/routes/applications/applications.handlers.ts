import { createDb } from "../../db";
import { AppRouteHandler } from "../../lib/types";
import {
  CreateRoute,
  ListRoute,
  GetOneRoute,
  PatchRoute,
  RemoveRoute,
} from "./applications.routes";
import { applications } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getSession } from "../../lib/get-session";
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from "../../lib/constants";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = createDb(c.env.DB);
  const user = getSession(c).user;
  const results = await db.query.applications.findMany({
    where: eq(applications.userId, user.id),
  });
  return c.json(results, 200);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = createDb(c.env.DB);
  const user = getSession(c).user;
  const application = c.req.valid("json");
  const [inserted] = await db
    .insert(applications)
    .values({
      ...application,
      id: crypto.randomUUID(),
      userId: user.id,
    })
    .returning();
  return c.json(inserted, 200);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
  const db = createDb(c.env.DB);
  const user = getSession(c).user;
  const { id } = c.req.valid("param");

  const result = await db.query.applications.findFirst({
    where: and(eq(applications.id, id), eq(applications.userId, user.id)),
  });

  if (!result) {
    return c.json(
      {
        message: ReasonPhrases.NOT_FOUND,
      },
      StatusCodes.NOT_FOUND
    );
  }

  return c.json(result, 200);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
  const db = createDb(c.env.DB);
  const user = getSession(c).user;
  const { id } = c.req.valid("param");
  const updates = c.req.valid("json");

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES,
            },
          ],
          name: "ZodError",
        },
      },
      StatusCodes.UNPROCESSABLE_ENTITY
    );
  }

  const [application] = await db
    .update(applications)
    .set(updates)
    .where(and(eq(applications.id, id), eq(applications.userId, user.id)))
    .returning();

  if (!application) {
    return c.json(
      {
        message: ReasonPhrases.NOT_FOUND,
      },
      StatusCodes.NOT_FOUND
    );
  }

  return c.json(application, StatusCodes.OK);
};

export const remove: AppRouteHandler<RemoveRoute> = async (c) => {
  const db = createDb(c.env.DB);
  const user = getSession(c).user;
  const { id } = c.req.valid("param");

  const result: D1Response = await db
    .delete(applications)
    .where(and(eq(applications.id, id), eq(applications.userId, user.id)));

  if (result.meta.changes === 0) {
    return c.json(
      {
        message: ReasonPhrases.NOT_FOUND,
      },
      StatusCodes.NOT_FOUND
    );
  }

  return c.body(null, StatusCodes.NO_CONTENT);
};
