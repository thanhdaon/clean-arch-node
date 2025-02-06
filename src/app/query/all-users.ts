import type { User } from "~/app/query/types";

interface AllUsersRealModel {
  AllUsers(): User[];
}

export function makeQueryAllUsers(users: AllUsersRealModel) {
  return async function allUsers() {
    return await users.AllUsers();
  };
}
