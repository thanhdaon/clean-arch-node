import type { TaskRepository } from "~/app/command/adapters";
import { makeTask } from "~/domain/task";

interface Dependencies {
  tasks: TaskRepository;
}

interface CreateTaskInput {
  title: string;
  createdBy: string;
}

export type CommandCreateTask = (input: CreateTaskInput) => Promise<void>;

export function makeCommandCreateTask({
  tasks,
}: Dependencies): CommandCreateTask {
  return async function addUser({ title, createdBy }: CreateTaskInput) {
    const newTask = makeTask({
      title,
      status: "todo",
      createdBy,
      createdAt: new Date(),
    });

    await tasks.add(newTask);
  };
}
