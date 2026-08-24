import { createRouter } from "./create-router";
import { AppOpenAPI } from "./types";
import { attachSession } from "../middlewares/attach-session";
import { requireAuth } from "../middlewares/require-auth";
import { createAuth } from "./auth";

const createApp = () => {
  const app = createRouter();

  app.use("*", attachSession);
  app.use("/applications/*", requireAuth);

  app.on(["POST", "GET"], "/api/auth/*", (c) =>
    createAuth(c.env).handler(c.req.raw)
  );

  return app;
};

export const createTestApp = <R extends AppOpenAPI>(router: R) => {
  return createApp().route("/", router);
};

export default createApp;
