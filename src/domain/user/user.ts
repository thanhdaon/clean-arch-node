import type { ID } from "~/domain/id/id";

export type UserRole = "employee" | "employer";

export type User = {
  getUuid: () => string;
  getRole: () => UserRole;
  changeRole: (role: UserRole) => void;
};

type UserInit = {
  uuid: string;
  role: UserRole;
};

type Dependencies = {
  Id: ID;
};

export function buildMakeUser({ Id }: Dependencies) {
  return function makeUser(data: UserInit): User {
    if (data.uuid === "") {
      data.uuid = Id.newId();
    }

    return {
      getUuid: () => {
        return data.uuid;
      },
      getRole: () => {
        return data.role;
      },
      changeRole: (role: UserRole) => {
        if (data.role === role) {
          return;
        }
        data.role = role;
      },
    };
  };
}
