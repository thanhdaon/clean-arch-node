import type { Task } from "~/domain/task/task";

async function add(task: Task) {}

async function updateById(id: string, updateFn: (u: Task) => Task) {}

export function makeTaskRepository() {
  return Object.freeze({ add, updateById });
}
