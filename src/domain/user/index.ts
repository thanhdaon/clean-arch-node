import { buildMakeUser } from "~/domain/user/user";
import { Id } from "~/domain/id";

export const makeUser = buildMakeUser({ Id });
