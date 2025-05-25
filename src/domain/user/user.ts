import type { ID } from "~/domain/id/id";

export type UserRole = "employee" | "employer";

export type User = {
  getUuid: () => string;
  getName: () => string;
  setName: (name: string) => void;
  getEmail: () => string;
  setEmail: (email: string) => void;
  isEmailVerified: () => boolean;
  getEmailVerifiedAt: () => Date | null;
  verifyEmail: () => void;
  getImage: () => string | null;
  setImage: (image: string) => void;
  getCreatedAt: () => Date;
  getUpdatedAt: () => Date;
  getRole: () => UserRole;
  changeRole: (role: UserRole) => void;
  canAssignTask: () => boolean;
};

type UserInit = {
  uuid?: string;
  role: string;
  name: string;
  email: string;
  emailVerified: boolean;
  emailVerifiedAt: Date | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

type Dependencies = {
  Id: ID;
};

export function buildMakeUser({ Id }: Dependencies) {
  return function makeUser({
    uuid,
    role,
    name,
    email, 
    emailVerified,
    emailVerifiedAt,
    image,
    createdAt,
    updatedAt,
  }: UserInit): User {
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
      getName: () => {
        return name;
      },
      setName: (newName: string) => {
        name = newName;
      },
      getEmail: () => {
        return email;
      },
      setEmail: (newEmail: string) => {
        email = newEmail;
      },
      isEmailVerified: () => {
        return emailVerified;
      },
      getEmailVerifiedAt: () => {
        return emailVerifiedAt;
      },
      verifyEmail: () => {
        emailVerified = true;
        emailVerifiedAt = new Date();
      },
      getImage: () => {
        return image;
      },
      setImage: (newImage: string) => {
        image = newImage;
      },
      getCreatedAt: () => {
        return createdAt;
      },
      getUpdatedAt: () => {
        return updatedAt;
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
      canAssignTask: () => {
        return role === "employer";
      },
    };
  };
}
