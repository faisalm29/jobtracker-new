import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";
import { env } from "cloudflare:workers";

// use for generating the better auth schema
export const db = drizzle(env.DB, {
  schema,
});

// use inside hono handlers where we can access cloudflare d1 binding
export const createDb = (dbBinding: D1Database) => {
  return drizzle(dbBinding, {
    schema,
  });
};
