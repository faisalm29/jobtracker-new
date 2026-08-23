import { hc } from "hono/client";
import type { Router } from "../index";

const client = hc<Router>("http://localhost:8787");
const res = await client.applications.$post({
  json: {
    companyName: "DoCheck",
    roleTitle: "Content Writer",
  },
});
// const data = await res.json();
