export type UserRole = "employee" | "employer";

type UserInit = {
  uuid: string;
  role: UserRole;
};

export function makeUser(init: UserInit) {
  if (init.uuid === "") {
    throw new Error("missing user uuid");
  }

  return {
    getUuid: () => {
      return init.uuid;
    },
    getRole: () => {
      return init.role;
    },
    changeRole: (role: UserRole) => {
      if (init.role === role) {
        return;
      }
      init.role = role;
    },
  };
}

export type User = ReturnType<typeof makeUser>;
