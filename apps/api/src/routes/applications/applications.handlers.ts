import { createDb } from "../../db";
import { AppRouteHandler } from "../../lib/types";
import { CreateRoute, ListRoute } from "./applications.routes";
import { applications } from "../../db/schema";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const db = createDb(c.env.DB);
  const applications = await db.query.applications.findMany();
  return c.json(applications, 200);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const db = createDb(c.env.DB);
  const application = c.req.valid("json");
  const [inserted] = await db
    .insert(applications)
    .values({
      ...application,
      id: crypto.randomUUID(),
      userId: "7668f6cc-4e90-4e8d-803f-3cd8fbe0358b",
    })
    .returning();
  return c.json(inserted, 200);
};
