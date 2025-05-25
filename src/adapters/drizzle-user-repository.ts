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
    name: newUser.getName(),
    email: newUser.getEmail(),
    emailVerified: newUser.isEmailVerified(),
    emailVerifiedAt: newUser.getEmailVerifiedAt(),
    image: newUser.getImage(),
    createdAt: newUser.getCreatedAt(),
    updatedAt: newUser.getCreatedAt(),
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

  return makeUser({
    uuid: dbUser.id,
    role: dbUser.role,
    name: dbUser.name,
    email: dbUser.email,
    emailVerified: dbUser.emailVerified,
    emailVerifiedAt: dbUser.emailVerifiedAt,
    image: dbUser.image,
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
  });
}

async function updateById(id: string, updateFn: (u: User) => User) {
  await db.transaction(async (tx) => {
    const found = await tx.query.user.findFirst({
      where: { id },
    });

    if (found === undefined) {
      throw new Error(`user ${id} not found`);
    }

    const domainUser = makeUser({
      uuid: found.id,
      role: found.role,
      name: found.name,
      email: found.email,
      emailVerified: found.emailVerified,
      emailVerifiedAt: found.emailVerifiedAt,
      image: found.image,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt,
    });
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
