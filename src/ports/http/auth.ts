import jwt from "jsonwebtoken";
import { env } from "~/common/env";
import { makeUser } from "~/domain/user";
import type { User } from "~/domain/user/user";
import type { AppContext } from "~/ports/http/types";

export function getUserFormContext(c: AppContext): User | undefined {
  const token = c.req.header("Authorization")?.split(" ")[1];
  if (token === "" || token === undefined) {
    return undefined;
  }

  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (typeof decoded === "string") {
    return undefined;
  }

  return makeUser({ uuid: decoded.userUuid, role: decoded.userRole });
}
