import { describe, it, expect } from "vitest";
import { makeUser } from "~/domain/user/user";

describe("makeUser", () => {
  it("should create a user with valid uuid and role", () => {
    const user = makeUser({ uuid: "1234", role: "employee" });
    expect(user.getUuid()).toBe("1234");
    expect(user.getRole()).toBe("employee");
  });

  it("should throw an error when uuid is empty", () => {
    expect(() => makeUser({ uuid: "", role: "employer" })).toThrow(
      "missing user uuid"
    );
  });

  it("should change the role when a new role is provided", () => {
    const user = makeUser({ uuid: "5678", role: "employee" });
    user.changeRole("employer");
    expect(user.getRole()).toBe("employer");
  });

  it("should not change the role if the new role is the same as the current role", () => {
    const user = makeUser({ uuid: "9012", role: "employer" });
    user.changeRole("employer");
    expect(user.getRole()).toBe("employer");
  });
});
