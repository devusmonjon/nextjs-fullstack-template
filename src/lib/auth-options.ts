import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";
import User from "@/database/user.model";
import { compare } from "bcrypt";
import {
  centralResumeLogin,
  centralResumeRegister,
  mapCentralResumeSession,
} from "@/lib/central-auth";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const email = String(credentials?.email || "").trim().toLowerCase();
        const password = String(credentials?.password || "");

        if (!email || !password) {
          return null;
        }

        const localUser = await User.findOne({ email });
        const localPasswordValid = localUser
          ? await compare(password, localUser.password)
          : false;

        try {
          const central = await centralResumeLogin({
            identifier: email,
            password,
          });

          return mapCentralResumeSession(central);
        } catch {
          if (!localUser || !localPasswordValid) {
            return null;
          }

          try {
            await centralResumeRegister({
              login: email,
              password,
              displayName: localUser.fullName,
              links: [
                {
                  project: "audit-resume",
                  localUserId: localUser._id.toString(),
                  role: localUser.role,
                  profileSnapshot: {
                    fullName: localUser.fullName,
                    email: localUser.email,
                    role: localUser.role,
                  },
                },
              ],
            });

            const central = await centralResumeLogin({
              identifier: email,
              password,
            });

            return mapCentralResumeSession(central);
          } catch {
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.fullName = user.fullName;
        token.email = user.email;
        token.role = user.role;
        token.audit_coins = user.audit_coins;
        token.balance = user.balance;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (!session.user) {
        return session;
      }

      session.user = {
        ...session.user,
        _id: token._id as string,
        email: token.email as string,
        fullName: token.fullName as string,
        role: token.role as "admin" | "user" | "employer",
        audit_coins: token.audit_coins as number | undefined,
        balance: token.balance as number | undefined,
        accessToken: token.accessToken as string | undefined,
        refreshToken: token.refreshToken as string | undefined,
      };

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
};
