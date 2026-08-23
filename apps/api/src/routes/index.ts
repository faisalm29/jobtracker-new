import { createRouter } from "../lib/create-router";
import { AppOpenAPI } from "../lib/types";
import applications from "./applications/applications.index";

export const registerRoutes = (app: AppOpenAPI) => {
  return app.route("/applications", applications);
};

export const router = registerRoutes(createRouter().basePath("/"));
export type Router = typeof router;
