import { describe, it, expect, vi } from "vitest";
import { Id } from "~/domain/id";

describe("domain/ID", () => {
  it("should generate and validate its own ID", () => {
    const id = Id.newId();
    expect(Id.isValidId(id)).toBe(true);
  });

  it("should invalidate a different ID", () => {
    expect(Id.isValidId("some-other-id")).toBe(false);
  });
});
