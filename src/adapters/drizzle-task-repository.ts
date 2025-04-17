import { db } from "~/db/db";
import { tasks } from "~/db/schema";
import { makeTask } from "~/domain/task";
import type { Task } from "~/domain/task/task";

async function add(task: Task) {
  await db.insert(tasks).values({
    id: task.getUuid(),
    title: task.getTitle(),
    status: task.getStatus(),
    createdBy: task.getCreatedBy(),
    assignedTo: task.getAssignedTo(),
    createdAt: task.getCreatedAt(),
    updatedAt: task.getUpdatedAt(),
  });
}

async function updateById(id: string, updateFn: (u: Task) => Task) {
  await db.transaction(async (tx) => {
    const found = await tx.query.tasks.findFirst({
      where: { id },
    });

    if (found === undefined) {
      throw new Error(`task ${id} not found`);
    }

    const domainTask = makeTask({
      uuid: found.id,
      title: found.title,
      status: found.status,
      createdBy: found.createdBy,
      assignedTo: found.assignedTo ? found.assignedTo : undefined,
      createdAt: found.createdAt,
      updatedAt: found.updatedAt ? found.updatedAt : undefined,
    });
    const domainTaskUpdated = updateFn(domainTask);

    await tx.update(tasks).set({
      title: domainTaskUpdated.getTitle(),
      status: domainTaskUpdated.getStatus(),
      assignedTo: domainTaskUpdated.getAssignedTo(),
      updatedAt: domainTaskUpdated.getUpdatedAt(),
    });
  });
}

export function makeTaskRepository() {
  return Object.freeze({ add, updateById });
}
