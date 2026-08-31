import { ReasonPhrases } from "http-status-codes";
import { createMessageObjectSchema } from "./create-message-object";

export const ZOD_ERROR_MESSAGES = {
  REQUIRED: "Required",
  EXPECTED_NUMBER: "Expected number, received nan",
  NO_UPDATES: "No updates provided",
};

export const ZOD_ERROR_CODES = {
  INVALID_UPDATES: "invalid_updates",
};

export const notFoundSchema = createMessageObjectSchema(
  ReasonPhrases.NOT_FOUND
);
