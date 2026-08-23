import { OpenAPIHono, RouteConfig, RouteHandler, z } from "@hono/zod-openapi";

export interface AppEnv {
  Bindings: CloudflareBindings;
}

export type AppOpenAPI = OpenAPIHono<AppEnv, {}, "/">;
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, AppEnv>;

export type ZodSchema = z.ZodUnion | z.ZodObject | z.ZodArray<z.ZodType>;

export type ZodIssue = z.core.$ZodIssue;
