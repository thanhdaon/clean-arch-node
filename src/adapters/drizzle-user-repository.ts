import { eq } from "drizzle-orm";
import type { User as QueryUser } from "~/app/query/types";
import { db } from "~/db/db";
import { user } from "~/db/schema/auth";
import { makeUser } from "~/domain/user";
import type { User } from "~/domain/user/user";

async function allUsers(): Promise<QueryUser[]> {
  const dbUsers = await db.query.user.findMany();
  return dbUsers.map((u) => ({ uuid: u.id, role: u.role }));
}

async function add(newUser: User) {
  await db.insert(user).values({
    id: newUser.getUuid(),
    role: newUser.getRole(),
  });
}

async function findById(id: string) {
  const dbUser = await db.query.user.findFirst({
    where: { id },
  });

  if (dbUser === undefined) {
    return undefined;
  }

  return makeUser({ uuid: dbUser.id, role: dbUser.role });
}

async function updateById(id: string, updateFn: (u: User) => User) {
  await db.transaction(async (tx) => {
    const found = await tx.query.user.findFirst({
      where: { id },
    });

    if (found === undefined) {
      throw new Error(`user ${id} not found`);
    }

    const domainUser = makeUser({ uuid: found.id, role: found.role });
    const domainUserUpdated = updateFn(domainUser);

    await tx.update(user).set({
      role: domainUserUpdated.getRole(),
    });
  });
}

async function deleteById(id: string) {
  await db.delete(user).where(eq(user.id, id));
}

export function makeUserRepository() {
  return Object.freeze({ allUsers, add, findById, updateById, deleteById });
}
