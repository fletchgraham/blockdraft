import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "./lib/mongodb";
import { getCollection } from "./lib/db";
import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";

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
  providers: [
    ...authConfig.providers,
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "Username" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials;

        const userCollection = await getCollection("users");
        const user = await userCollection.findOne({ username });

        if (!user) {
          throw new Error("Invalid username or password");
        }

        const isPasswordValid = bcrypt.compareSync(password, user.password);
        if (!isPasswordValid) {
          throw new Error("Invalid username or password");
        }

        return { id: user._id.toString(), username: user.username };
      },
    }),
  ],
});
