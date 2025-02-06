import type { User } from "~/domain/user/user";
import type { ID } from "~/domain/id/id";

export type Status = "todo" | "inprogress" | "done" | "pending";

export type Task = {
  getUuid: () => string;
  getTitle: () => string;
  getStatus: () => Status;
  getCreatedBy: () => string;
  getAssignedTo: () => string | undefined;
  getCreatedAt: () => Date;
  getUpdatedAt: () => Date | undefined;
  isUpdateYet: () => boolean;
  assignTo: (user: User) => void;
  changeStatue: (status: Status) => void;
  changeTitle: (title: string) => void;
};

type Dependencies = {
  Id: ID;
};

type TaskInit = {
  uuid: string;
  title: string;
  status: Status;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export function buildMakeTask({ Id }: Dependencies) {
  function makeTask(data: TaskInit): Task {
    if (data.uuid === "") {
      data.uuid = Id.newId();
    }

    return {
      getUuid: () => {
        return data.uuid;
      },
      getTitle: () => {
        return data.title;
      },
      getStatus: () => {
        return data.status;
      },
      getCreatedBy: () => {
        return data.createdBy;
      },
      getAssignedTo: () => {
        return data.assignedTo;
      },
      getCreatedAt: () => {
        return data.createdAt;
      },
      getUpdatedAt: () => {
        return data.updatedAt;
      },
      isUpdateYet: () => {
        return data.updatedAt !== undefined;
      },
      assignTo: (user: User) => {
        if (data.assignedTo === user.getUuid()) {
          throw new Error(
            `task ${data.uuid} already assigned to user ${user.getUuid()}`
          );
        }

        data.assignedTo = user.getUuid();
        data.updatedAt = new Date();
      },
      changeStatue: (status: Status) => {
        if (data.status === status) {
          throw new Error(`task ${data.uuid} already in status ${status}`);
        }

        data.status = status;
        data.updatedAt = new Date();
      },
      changeTitle: (title: string) => {
        if (title.length === 0) {
          throw new Error("task title can not be empty");
        }

        data.title = title;
        data.updatedAt = new Date();
      },
    };
  }

  return makeTask;
}
