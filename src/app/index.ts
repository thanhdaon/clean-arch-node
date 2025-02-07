import type { CommandAddUser } from "~/app/command/add-user";
import type { QueryAllUsers } from "~/app/query/all-users";
import type { CommandCreateTask } from "./command/create-task";
import type { CommandAssignTask } from "./command/assign-task";

export type App = {
  command: {
    addUser: CommandAddUser;
    createTask: CommandCreateTask;
    assignTask: CommandAssignTask;
  };
  query: {
    allUsers: QueryAllUsers;
  };
};
