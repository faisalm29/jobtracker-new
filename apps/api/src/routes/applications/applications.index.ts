import { createRouter } from "../../lib/create-router";
import * as routes from "./applications.routes";
import * as handlers from "./applications.handlers";

const router = createRouter()
  .openapi(routes.list, handlers.list)
  .openapi(routes.create, handlers.create)
  .openapi(routes.getOne, handlers.getOne);

export default router;
