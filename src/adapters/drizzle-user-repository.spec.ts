import { eq, inArray } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { makeUserRepository } from "~/adapters/drizzle-user-repository";
import { db } from "~/db/db";
import { users } from "~/db/schema";
import { Id } from "~/domain/id";
import { makeUser } from "~/domain/user";

const userRepository = makeUserRepository();

describe("allUsers", () => {
  it("should return all users", async () => {
    const insertedResults = await db
      .insert(users)
      .values([
        { id: Id.newId(), role: "employee" },
        { id: Id.newId(), role: "employer" },
        { id: Id.newId(), role: "employer" },
      ])
      .$returningId();

    const insertedIds = insertedResults.map((r) => r.id);

    const results = await userRepository.allUsers();

    const allIncluded = insertedIds.every((id) => {
      return results.some((r) => r.uuid === id);
    });

    expect(allIncluded).toBe(true);

    await db.delete(users).where(inArray(users.id, insertedIds));
  });
});

describe("add", () => {
  it("should add a new user", async () => {
    const user = makeUser({ role: "employee" });
    await userRepository.add(user);

    const dbUser = await db.query.users.findFirst({
      where: eq(users.id, user.getUuid()),
    });

    if (dbUser === undefined) {
      expect.fail(`user ${user.getUuid()} not found`);
    }

    expect(dbUser.id).toBe(user.getUuid());
    expect(dbUser.role).toBe(user.getRole());

    await db.delete(users).where(eq(users.id, user.getUuid()));
  });
});

describe("findById", () => {
  it("should find a user by id", async () => {
    const insertedResults = await db
      .insert(users)
      .values({ id: Id.newId(), role: "employer" })
      .$returningId();
    const insertedIds = insertedResults.map((r) => r.id);

    const user = await userRepository.findById(insertedIds[0]);

    if (user === undefined) {
      expect.fail(`user test-id not found`);
    }

    expect(user.getUuid()).toBe(insertedIds[0]);
    expect(user.getRole()).toBe("employer");

    await db.delete(users).where(inArray(users.id, insertedIds));
  });

  it("should return undefined if user is not found", async () => {
    const user = await userRepository.findById("non-existent-id");
    expect(user).toBeUndefined();
  });
});

describe("updateById", () => {
  it("should update user by id", async () => {
    const insertedResults = await db
      .insert(users)
      .values({ id: Id.newId(), role: "employee" })
      .$returningId();
    const insertedIds = insertedResults.map((r) => r.id);

    await userRepository.updateById(insertedIds[0], (user) => {
      user.changeRole("employer");
      return user;
    });

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, insertedIds[0]),
    });

    if (updatedUser === undefined) {
      expect.fail("user test-id not found");
    }

    expect(updatedUser.role).toBe("employer");

    await db.delete(users).where(inArray(users.id, insertedIds));
  });

  it("should throw an error if updating a non-existent user", async () => {
    await expect(
      userRepository.updateById("non-existent-id", (user) => user)
    ).rejects.toThrow("user non-existent-id not found");
  });
});
