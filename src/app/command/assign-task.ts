import type { TaskRepository, UserRepository } from "~/app/command/adapters";
import { withTrace } from "~/common/with-trace";
import type { User } from "~/domain/user/user";

interface Deps {
  tasks: TaskRepository;
  users: UserRepository;
}

interface AssignTaskInput {
  taskId: string;
  assigneeId: string;
  assigner: User;
}

export type CommandAssignTask = (input: AssignTaskInput) => Promise<void>;

export function makeCommandAssignTask(deps: Deps): CommandAssignTask {
  async function assignTask(input: AssignTaskInput) {
    if (!input.assigner.canAssignTask()) {
      throw new Error(`user ${input.assigner.getUuid()} can not assign task`);
    }

    const assignee = await deps.users.findById(input.assigneeId);
    if (assignee === undefined) {
      throw new Error(`user ${input.assigneeId} not found`);
    }

    await deps.tasks.updateById(input.taskId, (task) => {
      task.assignTo(assignee);
      return task;
    });
  }

  return withTrace(assignTask, "cmd.assignTask");
}
