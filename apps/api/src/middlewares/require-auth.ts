import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../lib/types";
import { StatusCodes } from "http-status-codes";

export const requireAuth = createMiddleware<AppEnv>(async (c, next) => {
  const session = c.get("session");

  if (!session) {
    return c.json(
      {
        error: "Unauthorized",
      },
      StatusCodes.UNAUTHORIZED
    );
  }

  await next();
});
