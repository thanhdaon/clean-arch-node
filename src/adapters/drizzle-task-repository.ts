import { eq } from "drizzle-orm";
import { db } from "~/db/db";
import { users } from "~/db/schema";
import { makeUser } from "~/domain/user";
import type { User } from "~/domain/user/user";

async function add(user: User) {
  await db.insert(users).values({
    id: user.getUuid(),
    role: user.getRole(),
  });
}

async function findById(id: string) {
  const dbUser = await db.query.users.findFirst({
    where: eq(users.id, id),
  });

  if (dbUser === undefined) {
    return undefined;
  }

  return makeUser({ uuid: dbUser.id, role: dbUser.role });
}

async function updateById(id: string, updateFn: (u: User) => User) {}

export function makeUserRepository() {
  return Object.freeze({ add, findById, updateById });
}
