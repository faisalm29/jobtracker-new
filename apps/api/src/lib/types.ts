import { OpenAPIHono, RouteConfig, RouteHandler, z } from "@hono/zod-openapi";
import { createAuth } from "./auth";

export interface AppEnv {
  Variables: {
    session: ReturnType<typeof createAuth>["$Infer"]["Session"] | null;
    auth: string;
  };
  Bindings: {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_DATABASE_ID: string;
    CLOUDFLARE_D1_TOKEN: string;
  };
}

export type AuthenticatedAppEnv = Omit<AppEnv, "Variables"> & {
  Variables: Omit<AppEnv["Variables"], "session"> & {
    session: NonNullable<AppEnv["Variables"]["session"]>;
  };
};

// export interface AuthenticatedAppEnv extends Omit<AppEnv, "Variables"> {
//   Variables: Omit<AppEnv["Variables"], "session"> & {
//     session: NonNullable<AppEnv["Variables"]["session"]>;
//   };
// }

export type AppOpenAPI = OpenAPIHono<AppEnv, {}, "/">;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<
  R,
  AuthenticatedAppEnv
>;

export type ZodSchema = z.ZodUnion | z.ZodObject | z.ZodArray<z.ZodType>;

export type ZodIssue = z.core.$ZodIssue;
