import type { User } from "~/domain/user/user";
import type { ID } from "~/domain/id/id";

export type Status = "todo" | "inprogress" | "done" | "pending" | "rejected";

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
  uuid?: string;
  title: string;
  status: string;
  createdBy: string;
  assignedTo?: string;
  createdAt: Date;
  updatedAt?: Date;
};

export function buildMakeTask({ Id }: Dependencies) {
  function isValidStatus(status: string) {
    const options = ["todo", "inprogress", "done", "pending", "rejected"];
    return options.includes(status);
  }

  function isValidTitle(title: string) {
    return title.length > 0 && title.length <= 200;
  }

  function makeTask({
    uuid,
    title,
    status,
    createdBy,
    createdAt,
    assignedTo,
    updatedAt,
  }: TaskInit): Task {
    if (!isValidStatus(status)) {
      throw new Error(`status ${status} is invalid`);
    }

    if (!isValidTitle(title)) {
      throw new Error("task title cannot exceed 200 characters");
    }

    if (uuid === "" || uuid === undefined) {
      uuid = Id.newId();
    }

    return {
      getUuid: () => {
        return uuid;
      },
      getTitle: () => {
        return title;
      },
      getStatus: () => {
        return status as Status;
      },
      getCreatedBy: () => {
        return createdBy;
      },
      getAssignedTo: () => {
        return assignedTo;
      },
      getCreatedAt: () => {
        return createdAt;
      },
      getUpdatedAt: () => {
        return updatedAt;
      },
      isUpdateYet: () => {
        return updatedAt !== undefined;
      },
      assignTo: (user: User) => {
        if (assignedTo === user.getUuid()) {
          throw new Error(
            `task ${uuid} already assigned to user ${user.getUuid()}`
          );
        }

        assignedTo = user.getUuid();
        updatedAt = new Date();
      },
      changeStatue: (newStatus: Status) => {
        if (status === newStatus) {
          throw new Error(`task ${uuid} already in status ${status}`);
        }

        status = newStatus;
        updatedAt = new Date();
      },
      changeTitle: (newTitle: string) => {
        if (newTitle.length === 0) {
          throw new Error("task title can not be empty");
        }

        if (!isValidTitle(newTitle)) {
          throw new Error("task title cannot exceed 200 characters");
        }

        title = newTitle;
        updatedAt = new Date();
      },
    };
  }

  return makeTask;
}
