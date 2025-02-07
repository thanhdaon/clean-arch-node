import type { UserRepository } from "~/app/command/adapters";
import { makeUser } from "~/domain/user";

interface Dependencies {
  users: UserRepository;
}

interface AddUserInput {
  role: string;
}

export type CommandAddUser = (input: AddUserInput) => Promise<void>;

export function makeCommandAddUser({ users }: Dependencies): CommandAddUser {
  return async function addUser({ role }: AddUserInput) {
    const newUser = makeUser({ role });
    await users.add(newUser);
  };
}
