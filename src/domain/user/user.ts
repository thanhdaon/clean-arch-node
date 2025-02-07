import type { ID } from "~/domain/id/id";

export type UserRole = "employee" | "employer";

export type User = {
  getUuid: () => string;
  getRole: () => UserRole;
  changeRole: (role: UserRole) => void;
};

type UserInit = {
  uuid?: string;
  role: string;
};

type Dependencies = {
  Id: ID;
};

export function buildMakeUser({ Id }: Dependencies) {
  return function makeUser({ uuid, role }: UserInit): User {
    if (role !== "employee" && role !== "employer") {
      throw new Error(`invalid role ${role}`);
    }

    if (uuid === undefined || uuid === "") {
      uuid = Id.newId();
    }

    return {
      getUuid: () => {
        return uuid;
      },
      getRole: () => {
        return role as UserRole;
      },
      changeRole: (newRole: UserRole) => {
        if (role === newRole) {
          return;
        }
        role = newRole;
      },
    };
  };
}
