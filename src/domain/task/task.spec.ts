import { describe, it, expect, vi } from "vitest";
import { buildMakeTask } from "~/domain/task/task";
import type { ID } from "~/domain/id/id";
import type { User } from "~/domain/user/user";

const mockId: ID = {
  newId: vi.fn(() => "mocked-task-uuid"),
  isValidId: vi.fn((id: string) => id.length > 0),
};

describe("domain/Task", () => {
  const makeTask = buildMakeTask({ Id: mockId });

  it("should create a task with a provided UUID", () => {
    const task = makeTask({
      uuid: "1234",
      title: "Test Task",
      status: "todo",
      createdBy: "user123",
      createdAt: new Date(),
    });
    expect(task.getUuid()).toBe("1234");
    expect(task.getTitle()).toBe("Test Task");
    expect(task.getStatus()).toBe("todo");
    expect(task.getCreatedBy()).toBe("user123");
  });

  it("should generate a UUID if none is provided", () => {
    const task = makeTask({
      uuid: "",
      title: "Auto ID Task",
      status: "pending",
      createdBy: "user456",
      createdAt: new Date(),
    });
    expect(task.getUuid()).toBe("mocked-task-uuid");
  });

  it("should allow changing the title", () => {
    const task = makeTask({
      uuid: "5678",
      title: "Old Title",
      status: "inprogress",
      createdBy: "user789",
      createdAt: new Date(),
    });
    task.changeTitle("New Title");
    expect(task.getTitle()).toEqual("New Title");
  });

  it("should throw error when title exceeds 200 characters", () => {
    const longTitle = "a".repeat(201);
    expect(() =>
      makeTask({
        uuid: "5678",
        title: longTitle,
        status: "todo",
        createdBy: "user789",
        createdAt: new Date(),
      })
    ).toThrow("task title cannot exceed 200 characters");

    const task = makeTask({
      uuid: "5678",
      title: "Valid Title",
      status: "todo",
      createdBy: "user789",
      createdAt: new Date(),
    });
    expect(() => task.changeTitle(longTitle)).toThrow(
      "task title cannot exceed 200 characters"
    );
  });

  it("should allow changing the status", () => {
    const task = makeTask({
      uuid: "91011",
      title: "Status Task",
      status: "todo",
      createdBy: "user999",
      createdAt: new Date(),
    });
    task.changeStatue("done");
    expect(task.getStatus()).toBe("done");
  });

  it("should assign the task to a user", () => {
    const mockUser: User = {
      getUuid: () => "user123",
      getRole: () => "employee",
      changeRole: () => {},
      canAssignTask: () => true,
    };
    const task = makeTask({
      uuid: "121314",
      title: "Assign Task",
      status: "todo",
      createdBy: "user555",
      createdAt: new Date(),
    });
    task.assignTo(mockUser);
    expect(task.getAssignedTo()).toBe("user123");
  });
});
