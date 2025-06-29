import type { TaskRepository, UserRepository } from "~/app/command/adapters";
import { BadRequestError, NotFoundError } from "~/domain/error";
import { makeTask } from "~/domain/task";

interface Dependencies {
  tasks: TaskRepository;
  users: UserRepository;
}

interface CreateTaskInput {
  title: string;
  createdBy: string;
}

export type CommandCreateTask = (input: CreateTaskInput) => Promise<void>;

export function makeCommandCreateTask({
  tasks,
  users,
}: Dependencies): CommandCreateTask {
  return async function addUser({ title, createdBy }: CreateTaskInput) {
    const author = await users.findById(createdBy);

    if (author === undefined) {
      throw new BadRequestError(`User ${createdBy} not found`);
    }

    const newTask = makeTask({
      title,
      status: "todo",
      createdBy,
      createdAt: new Date(),
    });

    await tasks.add(newTask);
  };
}
