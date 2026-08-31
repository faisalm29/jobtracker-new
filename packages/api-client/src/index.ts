import type { Router } from "@jobtracker/api/routes";

import { hc } from "hono/client";

const client = hc<Router>("");
export type Client = typeof client;

export const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<Router>(...args);
