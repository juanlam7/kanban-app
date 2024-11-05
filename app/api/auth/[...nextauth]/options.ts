import { GraphQLClient } from "graphql-request";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      session.user = token as any;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
