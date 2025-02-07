import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { makeTaskRepository } from "~/adapters/drizzle-task-repository";
import { db } from "~/db/db";
import { tasks, users } from "~/db/schema";
import { Id } from "~/domain/id";
import { makeTask } from "~/domain/task";

const taskRepository = makeTaskRepository();

describe("add", () => {
  it("should add a new task", async () => {
    const [{ id }] = await db
      .insert(users)
      .values({ id: Id.newId(), role: "employee" })
      .$returningId();

    const task = makeTask({
      title: "Test Task",
      status: "pending",
      createdBy: id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await taskRepository.add(task);

    const dbTask = await db.query.tasks.findFirst({
      where: (fields, { eq }) => eq(fields.id, task.getUuid()),
    });

    if (dbTask === undefined) {
      expect.fail("Task not found");
    }

    expect(dbTask.id).toEqual(task.getUuid());
    expect(dbTask.title).toEqual(task.getTitle());
    expect(dbTask.status).toEqual(task.getStatus());
    expect(dbTask.createdBy).toEqual(task.getCreatedBy());
    expect(dbTask.assignedTo).toBeNull();
    expect(dbTask.createdAt).toEqual(task.getCreatedAt());
    expect(dbTask.updatedAt).toEqual(task.getUpdatedAt());

    await db.delete(users).where(eq(users.id, id));
  });
});

describe("updateById function", () => {
  it("should update task by id", async () => {
    const [{ id: creatorId }] = await db
      .insert(users)
      .values({ id: Id.newId(), role: "employee" })
      .$returningId();

    const [{ id: taskId }] = await db
      .insert(tasks)
      .values({
        id: Id.newId(),
        title: "Initial Task",
        status: "pending",
        createdBy: creatorId,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .$returningId();

    await taskRepository.updateById(taskId, (task) => {
      task.changeTitle("Updated Task");
      task.changeStatue("done");
      return task;
    });

    const updatedTask = await db.query.tasks.findFirst({
      where: eq(tasks.id, taskId),
    });

    if (updatedTask === undefined) {
      expect.fail("task not found");
    }
    expect(updatedTask.title).toBe("Updated Task");
    expect(updatedTask.status).toBe("done");

    await db.delete(tasks).where(eq(tasks.id, taskId));
    await db.delete(users).where(eq(users.id, creatorId));
  });

  it("should throw an error if updating a non-existent task", async () => {
    await expect(
      taskRepository.updateById("non-existent-id", (task) => task)
    ).rejects.toThrow("task non-existent-id not found");
  });
});
