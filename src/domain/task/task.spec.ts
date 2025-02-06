import { describe, it, expect } from "vitest";
import { makeTask, type Status } from "~/domain/task/task";

const sampleTaskData = {
  uuid: "123e4567-e89b-12d3-a456-426614174000",
  title: "Test Task",
  status: "todo" as Status,
  createdBy: "user1",
  assignedTo: "user2",
  createdAt: new Date("2024-02-06T12:00:00Z"),
  updatedAt: new Date("2024-02-07T12:00:00Z"),
};

describe("makeTask", () => {
  it("should create a task with correct properties", () => {
    const task = makeTask(sampleTaskData);

    expect(task.getUuid()).toBe(sampleTaskData.uuid);
    expect(task.getTitle()).toBe(sampleTaskData.title);
    expect(task.getStatus()).toBe(sampleTaskData.status);
    expect(task.getCreatedBy()).toBe(sampleTaskData.createdBy);
    expect(task.getAssignedTo()).toBe(sampleTaskData.assignedTo);
    expect(task.getCreatedAt()).toEqual(sampleTaskData.createdAt);
    expect(task.getUpdatedAt()).toEqual(sampleTaskData.updatedAt);
  });

  it("should handle missing optional properties", () => {
    const minimalTaskData = {
      uuid: "456e7890-e12b-34d5-a678-910111213141",
      title: "Minimal Task",
      status: "pending" as Status,
      createdBy: "user3",
      createdAt: new Date("2024-02-06T15:00:00Z"),
    };

    const task = makeTask(minimalTaskData);

    expect(task.getAssignedTo()).toBeUndefined();
    expect(task.getUpdatedAt()).toBeUndefined();
  });
});
