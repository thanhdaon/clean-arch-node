import type { UserRepository } from "~/app/command/adapters";
import { makeUser } from "~/domain/user";

interface Dependencies {
  users: UserRepository;
}

interface AddUserInput {
  role: string;
  name: string;
  email: string;
  password: string;
}

export type CommandAddUser = (input: AddUserInput) => Promise<void>;

export function makeCommandAddUser({ users }: Dependencies): CommandAddUser {
  async function addUser({ role, name, email, password }: AddUserInput) {
    const newUser = makeUser({ role, name, email, password });
    await users.add(newUser);
  }

  return addUser;
}
