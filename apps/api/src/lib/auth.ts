import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db, createDb } from "../db";
import { bearer, openAPI } from "better-auth/plugins";
import type { AppEnv } from "./types";
import * as schema from "../db/schema";

// use this just for better auth schema generation
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    schema,
    provider: "sqlite",
    usePlural: true,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [bearer(), openAPI()],
  trustedOrigins: ["http://localhost:5173"],
});

// use inside hono handlers where we can access cloudflare d1 binding
export const createAuth = (env: AppEnv["Bindings"]) => {
  return betterAuth({
    database: drizzleAdapter(createDb(env.DB), {
      schema,
      provider: "sqlite",
      usePlural: true,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [bearer(), openAPI()],
    trustedOrigins: ["http://localhost:5173"],
  });
};
