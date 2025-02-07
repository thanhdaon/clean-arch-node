import type { CommandAddUser } from "~/app/command/add-user";
import type { QueryAllUsers } from "~/app/query/all-users";

export type App = {
  command: {
    addUser: CommandAddUser;
  };
  query: {
    allUsers: QueryAllUsers;
  };
};
