import { createRouter } from "../lib/create-router";
import { AppOpenAPI } from "../lib/types";
import index from "./index.routes";
import applications from "./applications/applications.index";
import stats from "./stats/stats.index";

export const registerRoutes = (app: AppOpenAPI) => {
  return app
    .route("/", index)
    .route("/applications", applications)
    .route("/stats", stats);
};

export const router = registerRoutes(createRouter().basePath("/"));
export type Router = typeof router;
