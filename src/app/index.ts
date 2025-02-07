import type { CommandAddUser } from "~/app/command/add-user";
import type { QueryAllUsers } from "~/app/query/all-users";
import type { CommandCreateTask } from "./command/create-task";

export type App = {
  command: {
    addUser: CommandAddUser;
    createTask: CommandCreateTask;
  };
  query: {
    allUsers: QueryAllUsers;
  };
};
