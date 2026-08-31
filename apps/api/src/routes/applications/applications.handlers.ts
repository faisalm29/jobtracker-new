import { createDb } from "../../db";
import { AppRouteHandler } from "../../lib/types";
import { CreateRoute, ListRoute, GetOneRoute } from "./applications.routes";
import { applications } from "../../db/schema";
import { and, eq } from "drizzle-orm";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { getSession } from "../../lib/get-session";

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
