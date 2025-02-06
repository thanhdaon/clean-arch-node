import type { User } from "~/domain/user/user";

export type Status = "todo" | "inprogress" | "done" | "pending";

type TaskInit = {
  uuid: string;
  title: string;
  status: Status;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export function makeTask(init: TaskInit) {
  return {
    getUuid: () => {
      return init.uuid;
    },
    getTitle: () => {
      return init.title;
    },
    getStatus: () => {
      return init.status;
    },
    getCreatedBy: () => {
      return init.createdBy;
    },
    getAssignedTo: () => {
      return init.assignedTo;
    },
    getCreatedAt: () => {
      return init.createdAt;
    },
    getUpdatedAt: () => {
      return init.updatedAt;
    },
    isUpdateYet: () => {
      return init.updatedAt !== undefined;
    },
    assignTo: (user: User) => {
      if (init.assignedTo === user.getUuid()) {
        throw new Error(
          `task ${init.uuid} already assigned to user ${user.getUuid()}`
        );
      }

      init.assignedTo = user.getUuid();
      init.updatedAt = new Date();
    },
    changeStatue: (status: Status) => {
      if (init.status === status) {
        throw new Error(`task ${init.uuid} already in status ${status}`);
      }

      init.status = status;
      init.updatedAt = new Date();
    },
    changeTitle: (title: string) => {
      if (title.length === 0) {
        throw new Error("task title can not be empty");
      }

      init.title = title;
      init.updatedAt = new Date();
    },
  };
}

export type Task = ReturnType<typeof makeTask>;
