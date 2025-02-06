import cuid from "@paralleldrive/cuid2";
import type { ID } from "~/domain/id/id";

export const Id: ID = Object.freeze({
  newId: cuid.createId,
  isValidId: cuid.isCuid,
});
