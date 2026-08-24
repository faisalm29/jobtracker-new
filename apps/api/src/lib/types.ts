import { OpenAPIHono, RouteConfig, RouteHandler, z } from "@hono/zod-openapi";

export interface AppEnv {
  Bindings: {
    DB: D1Database;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
    CLOUDFLARE_ACCOUNT_ID: string;
    CLOUDFLARE_DATABASE_ID: string;
    CLOUDFLARE_D1_TOKEN: string;
  };
}

export type AppOpenAPI = OpenAPIHono<AppEnv, {}, "/">;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppEnv>;

export type ZodSchema = z.ZodUnion | z.ZodObject | z.ZodArray<z.ZodType>;

export type ZodIssue = z.core.$ZodIssue;
