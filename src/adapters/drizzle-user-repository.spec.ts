import { faker } from "@faker-js/faker";
import { eq, inArray } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { makeUserRepository } from "~/adapters/drizzle-user-repository";
import { db } from "~/db/db";
import { user } from "~/db/schema/auth";
import { makeUser } from "~/domain/user";
import type { UserRole } from "~/domain/user/user";

type InsertUser = typeof user.$inferInsert;

const userRepository = makeUserRepository();

function mockUser({ role = "employee" }: { role?: UserRole } = {}): InsertUser {
  return {
    role,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    emailVerified: false,
    emailVerifiedAt: null,
    image: faker.image.url(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
  };
}

describe("allUsers", () => {
  it("should return all users", async () => {
    const insertedResults = await db
      .insert(user)
      .values([mockUser(), mockUser(), mockUser()])
      .$returningId();

    const insertedIds = insertedResults.map((r) => r.id);

    const results = await userRepository.allUsers();

    const allIncluded = insertedIds.every((id) => {
      return results.some((r) => r.uuid === id);
    });

    expect(allIncluded).toBe(true);

    await db.delete(user).where(inArray(user.id, insertedIds));
  });
});

describe("add", () => {
  it("should add a new user", async () => {
    const newUser = makeUser({
      role: "employee",
      name: "test-name",
      email: "test-email",
      emailVerified: false,
      emailVerifiedAt: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await userRepository.add(newUser);

    const dbUser = await db.query.user.findFirst({
      where: { id: newUser.getUuid() },
    });

    if (dbUser === undefined) {
      expect.fail(`user ${newUser.getUuid()} not found`);
    }

    expect(dbUser.id).toBe(newUser.getUuid());
    expect(dbUser.role).toBe(newUser.getRole());

    await db.delete(user).where(eq(user.id, newUser.getUuid()));
  });
});

describe("findById", () => {
  it("should find a user by id", async () => {
    const insertedResults = await db
      .insert(user)
      .values(mockUser({ role: "employer" }))
      .$returningId();

    const insertedIds = insertedResults.map((r) => r.id);

    const foundUser = await userRepository.findById(insertedIds[0]);

    if (foundUser === undefined) {
      expect.fail(`user test-id not found`);
    }

    expect(foundUser.getUuid()).toBe(insertedIds[0]);
    expect(foundUser.getRole()).toBe("employer");

    await db.delete(user).where(inArray(user.id, insertedIds));
  });

  it("should return undefined if user is not found", async () => {
    const user = await userRepository.findById("non-existent-id");
    expect(user).toBeUndefined();
  });
});

describe("updateById", () => {
  it("should update user by id", async () => {
    const insertedResults = await db
      .insert(user)
      .values(mockUser({ role: "employee" }))
      .$returningId();
    const insertedIds = insertedResults.map((r) => r.id);

    await userRepository.updateById(insertedIds[0], (user) => {
      user.changeRole("employer");
      return user;
    });

    const updatedUser = await db.query.user.findFirst({
      where: { id: insertedIds[0] },
    });

    if (updatedUser === undefined) {
      expect.fail("user test-id not found");
    }

    expect(updatedUser.role).toBe("employer");

    await db.delete(user).where(inArray(user.id, insertedIds));
  });

  it("should throw an error if updating a non-existent user", async () => {
    await expect(
      userRepository.updateById("non-existent-id", (user) => user)
    ).rejects.toThrow("user non-existent-id not found");
  });
});

describe("deleteById", () => {
  it("should delete a user by id", async () => {
    const insertedResults = await db
      .insert(user)
      .values(mockUser({ role: "employee" }))
      .$returningId();
    const insertedIds = insertedResults.map((r) => r.id);

    await userRepository.deleteById(insertedIds[0]);

    const deletedUser = await db.query.user.findFirst({
      where: { id: insertedIds[0] },
    });

    expect(deletedUser).toBeUndefined();

    await db.delete(user).where(inArray(user.id, insertedIds));
  });
});
