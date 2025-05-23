import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      _id: string;
      fullName: string;
      email: string;
      role: string;
    } & DefaultSession["user"] | null;
  }

  interface User extends DefaultUser {
    _id: string;
    fullName: string;
    email: string;
    role: string;
  }
}
