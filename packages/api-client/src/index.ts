import type { Router } from "@jobtracker/api/routes";

import { hc } from "hono/client";

const client = hc<Router>("", {
  init: {
    credentials: "include",
  },
});
export type Client = typeof client;

export default (...args: Parameters<typeof hc>): Client => hc<Router>(...args);
