import { createRouter } from "../lib/create-router";
import { AppOpenAPI } from "../lib/types";
import index from "./index.routes";
import applications from "./applications/applications.index";

export const registerRoutes = (app: AppOpenAPI) => {
  return app.route("/", index).route("/applications", applications);
};

export const router = registerRoutes(createRouter().basePath("/"));
export type Router = typeof router;
