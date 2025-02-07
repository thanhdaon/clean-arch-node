import { reset } from "drizzle-seed";
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "~/db/db";
import { users } from "~/db/schema";
import { makeUserRepository } from "~/adapters/drizzle-user-repository";
import { makeUser } from "~/domain/user";
import { eq } from "drizzle-orm";

beforeEach(async () => {
  await reset(db, { users });
});

const userRepository = makeUserRepository();

describe("allUsers", () => {
  it("should return all users", async () => {
    const insertedIds = await db
      .insert(users)
      .values([
        { id: "user1", role: "employee" },
        { id: "user2", role: "employer" },
        { id: "user3", role: "employer" },
      ])
      .$returningId();

    const results = await userRepository.allUsers();

    const allIncluded = insertedIds.every((id) => {
      return results.some((r) => r.uuid === id);
    });

    expect(allIncluded).toBe(true);
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
  });
});

describe("findById", () => {
  it("should find a user by id", async () => {
    await db.insert(users).values({ id: "test-id", role: "employer" });
    const user = await userRepository.findById("test-id");

    if (user === undefined) {
      expect.fail(`user test-id not found`);
    }

    expect(user.getUuid()).toBe("test-id");
    expect(user.getRole()).toBe("employer");
  });

  it("should return undefined if user is not found", async () => {
    const user = await userRepository.findById("non-existent-id");
    expect(user).toBeUndefined();
  });
});

describe("updateById", () => {
  it("should update user by id", async () => {
    await db.insert(users).values({ id: "test-id", role: "employee" });

    await userRepository.updateById("test-id", (user) => {
      user.changeRole("employer");
      return user;
    });

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, "test-id"),
    });

    if (updatedUser === undefined) {
      expect.fail("user test-id not found");
    }

    expect(updatedUser.role).toBe("employer");
  });

  it("should throw an error if updating a non-existent user", async () => {
    await expect(
      userRepository.updateById("non-existent-id", (user) => user)
    ).rejects.toThrow("user non-existent-id not found");
  });
});
