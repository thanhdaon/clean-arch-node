import { reset } from "drizzle-seed";
import { beforeEach, describe, expect, it } from "vitest";
import { db } from "~/db/db";
import { users } from "~/db/schema";

beforeEach(async () => {
  await reset(db, { users });
});

describe("add", () => {
  it("should add a new task", async () => {
    expect(1).toBe(1);
  });
});
