import { db } from "~/db/db";
import { task } from "~/db/schema/others";
import { makeTask } from "~/domain/task";
import type { Task } from "~/domain/task/task";

async function add(newTask: Task) {
  await db.insert(task).values({
    id: newTask.getUuid(),
    title: newTask.getTitle(),
    status: newTask.getStatus(),
    createdBy: newTask.getCreatedBy(),
    assignedTo: newTask.getAssignedTo(),
    createdAt: newTask.getCreatedAt(),
    updatedAt: newTask.getUpdatedAt(),
  });
}

async function updateById(id: string, updateFn: (u: Task) => void) {
  await db.transaction(async (tx) => {
    const found = await tx.query.task.findFirst({
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
    
    await updateFn(domainTask);

    await tx.update(task).set({
      title: domainTask.getTitle(),
      status: domainTask.getStatus(),
      assignedTo: domainTask.getAssignedTo(),
      updatedAt: domainTask.getUpdatedAt(),
    });
  });
}

export function makeTaskRepository() {
  return Object.freeze({ add, updateById });
}
