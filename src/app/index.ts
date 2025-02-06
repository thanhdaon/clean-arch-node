import type { CommandAddUser } from "~/app/command/add-user";

export type App = {
  command: {
    addUser: CommandAddUser;
  };
};
