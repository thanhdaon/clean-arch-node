import { describe, it, expect, vi } from "vitest";
import { buildMakeUser } from "~/domain/user/user";
import type { ID } from "~/domain/id/id";

const mockId: ID = {
  newId: vi.fn(() => "mocked-uuid"),
  isValidId: vi.fn((id: string) => true),
};

describe("domain/User", () => {
  const makeUser = buildMakeUser({ Id: mockId });

  it("should create a user with a provided UUID", () => {
    const user = makeUser({ uuid: "1234", role: "employee" });
    expect(user.getUuid()).toBe("1234");
    expect(user.getRole()).toBe("employee");
  });

  it("should generate a UUID if none is provided", () => {
    const user = makeUser({ uuid: "", role: "employer" });
    expect(user.getUuid()).toBe("mocked-uuid");
    expect(user.getRole()).toBe("employer");
  });

  it("should change the role when changeRole is called", () => {
    const user = makeUser({ uuid: "1234", role: "employee" });
    user.changeRole("employer");
    expect(user.getRole()).toBe("employer");
  });

  it("should not change the role if it is the same", () => {
    const user = makeUser({ uuid: "1234", role: "employee" });
    user.changeRole("employee");
    expect(user.getRole()).toBe("employee");
  });
});
