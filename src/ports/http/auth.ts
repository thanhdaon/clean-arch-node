import jwt from "jsonwebtoken";
import { env } from "~/common/env";
import { withTrace } from "~/common/with-trace";
import { makeUser } from "~/domain/user";
import type { User } from "~/domain/user/user";
import type { AppContext } from "~/ports/http/types";

function _getUserFromCtx(c: AppContext): User | undefined {
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

export const getUserFromCtx = withTrace(_getUserFromCtx, "userFromCtx");
