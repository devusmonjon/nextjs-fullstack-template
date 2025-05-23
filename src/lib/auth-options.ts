import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "./mongoose";
import User from "@/database/user.model";
import { compare, hash } from "bcrypt";

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
        // console.log(credentials);
        const user = await User.findOne({ email: credentials?.email });

        if (user) {
          const isPasswordValid = await compare(
            credentials?.password || "",
            user.password
          );

          if (isPasswordValid) {
            return user;
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      await connectToDatabase();
      const isExistingUser = await User.findOne({
        email: session.user?.email,
      });

      console.log(session.user, "email");

      session.user = {
        _id: isExistingUser?._id,
        email: isExistingUser?.email,
        fullName: isExistingUser?.fullName,
        role: isExistingUser?.role,
      };

      console.log(session);

      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
  session: { strategy: "jwt" },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,

  // pages for customize
  // pages: {
  //   signIn: "/auth/signin",
  //   signOut: "/auth/signout",
  //   error: "/auth/error", // Error code passed in query string as ?error=
  //   verifyRequest: "/auth/verify-request", // (used for check email message)
  //   newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  // },
};
