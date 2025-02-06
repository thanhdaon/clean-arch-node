import type { UserRepository } from "~/app/command/adapters";
import { makeUser } from "~/domain/user";
import type { UserRole } from "~/domain/user/user";

interface Dependencies {
  users: UserRepository;
}

interface AddUserInput {
  role: UserRole;
}

export type CommandAddUser = (input: AddUserInput) => Promise<void>;

export function makeCommandAddUser({ users }: Dependencies): CommandAddUser {
  return async function addUser({ role }: AddUserInput) {
    const user = makeUser({ role });
    await users.add(user);
  };
}
