import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user:
      | ({
          _id: string;
          fullName: string;
          email: string;
          role: "admin" | "user" | "employer";
          audit_coins?: number;
          balance?: number;
          accessToken?: string;
          refreshToken?: string;
        } & DefaultSession["user"])
      | null;
  }

  interface User extends DefaultUser {
    _id: string;
    fullName: string;
    email: string;
    role: "admin" | "user" | "employer";
    audit_coins?: number;
    balance?: number;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    _id?: string;
    fullName?: string;
    email?: string;
    role?: "admin" | "user" | "employer";
    audit_coins?: number;
    balance?: number;
    accessToken?: string;
    refreshToken?: string;
  }
}
