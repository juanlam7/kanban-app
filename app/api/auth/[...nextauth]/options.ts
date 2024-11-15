import { GraphQLClient } from "graphql-request";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

interface LoginResponse {
  login: {
    value: string;
    id: string;
    name: string;
    username: string;
    email: string;
  };
}

const graphqlClient = new GraphQLClient(process.env.GRAPHQL_ENDPOINT!);

const mutation = `
    mutation Login($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        value
        id
        name
        username
        email
      }
    }
`;

export const options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const variables = {
            username: credentials?.username,
            password: credentials?.password,
          };

          const data: LoginResponse = await graphqlClient.request(
            mutation,
            variables
          );

          if (data) {
            return {
              id: data.login.id,
              name: data.login.name,
              username: data.login.username,
              email: data.login.email,
              token: data.login.value,
            };
          }

          return null;
        } catch (error) {
          console.error("Error during login:", error);
          return null;
        }
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
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account?.provider === "google") {
        token.idToken = account.id_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.idToken = token.idToken;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
