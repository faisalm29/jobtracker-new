import { createRouter } from "../../lib/create-router";
import * as routes from "./stats.routes";
import * as handlers from "./stats.handlers";

const router = createRouter().openapi(routes.stats, handlers.stats);

export default router;
