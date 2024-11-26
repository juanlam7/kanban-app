import { auth } from "@/lib/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (credentials) {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              credentials.email,
              credentials.password
            );

            const user = userCredential.user;
            if (user) {
              return {
                id: user.uid,
                email: user.email,
                token: await user.getIdToken(),
              };
            }
            return null;
          } catch (error) {
            console.error("Firebase authentication error:", error);
            return null;
          }
        }
        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/es/login",
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account?.provider === "google") {
        token.idToken = account.id_token;
      }

      if (user && user.token) {
        token.idToken = user.token;
      }

      return token;
    },
    async session({ session, token }) {
      session = {
        ...session,
        idToken: token.idToken,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
