import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/mongodb";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: MongoDBAdapter(client),
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        // Add additional data to the JWT token
        token.userId = user.id;
      }
      return token;
    },
    session: async ({ session, token }) => {
      // Add the data from the JWT token to the session
      session.user.userId = token.userId;

      return session;
    },
  },
  session: { strategy: "jwt" },
  ...authConfig,
});
