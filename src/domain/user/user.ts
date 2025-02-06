import type { ID } from "~/domain/id/id";

export type UserRole = "employee" | "employer";

export type User = {
  getUuid: () => string;
  getRole: () => UserRole;
  changeRole: (role: UserRole) => void;
};

type UserInit = {
  uuid?: string;
  role: UserRole;
};

type Dependencies = {
  Id: ID;
};

export function buildMakeUser({ Id }: Dependencies) {
  return function makeUser({ uuid, role }: UserInit): User {
    if (uuid === undefined || uuid === "") {
      uuid = Id.newId();
    }

    return {
      getUuid: () => {
        return uuid;
      },
      getRole: () => {
        return role;
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
