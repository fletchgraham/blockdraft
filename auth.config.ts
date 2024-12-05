// import CredentialsProvider from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

// note the credentials provider can't be here for edge compatibility
// see https://authjs.dev/guides/edge-compatibility

export default {
  providers: [
    GitHub,
    Google,
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     username: { label: "Username", type: "text", placeholder: "Username" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     throw new Error("Password validation must run on Node.js runtime");
    //   },
    // }),
  ],
};
