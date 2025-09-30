import { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";
import { userRoleEnum } from "@the-early-kickoff/db/schema";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: typeof userRoleEnum.enumValues[number];
    };
  }

  interface User extends DefaultUser {
    role: typeof userRoleEnum.enumValues[number];
    password?: string; // Add password field
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: typeof userRoleEnum.enumValues[number];
  }
}