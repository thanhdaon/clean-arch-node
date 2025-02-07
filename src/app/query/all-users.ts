import type { User } from "~/app/query/types";

interface AllUsersRealModel {
  allUsers(): Promise<User[]>;
}

interface Dependencies {
  users: AllUsersRealModel;
}

export type QueryAllUsers = () => Promise<User[]>;

export function makeQueryAllUsers({ users }: Dependencies): QueryAllUsers {
  return async function allUsers() {
    return await users.allUsers();
  };
}
