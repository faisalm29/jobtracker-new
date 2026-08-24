import { ReasonPhrases } from "http-status-codes";
import { createMessageObjectSchema } from "./create-message-object";

export const notFoundSchema = createMessageObjectSchema(
  ReasonPhrases.NOT_FOUND
);
