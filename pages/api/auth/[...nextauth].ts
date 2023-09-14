import NextAuth, { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "@/lib/api/db";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "process";

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;
    }
  }
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    id_token: unknown,
    roles: Array<string>,
    isAdmin: boolean
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: Array<string>,
    isAdmin: boolean
  }
}

const stgOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Email",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Email" }
      },
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }
        const user = await prisma.member.findFirst({
          where: {
            email: credentials.email
          }
        })
        if (user) {
          return user;
        } else {
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, user}) {
      return {...token, ...user};
    }
  }
};

const defaultOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env["GOOGLE_CLIENT_ID"],
      clientSecret: process.env["GOOGLE_CLIENT_SECRET"],
    })
  ],
  callbacks: {
    async signIn({ user: { email }, credentials }) {
      return !!await prisma.member.count({
        where: { email: email ?? "" }
      });
    },
    async jwt({ token, account }) {
      // Persist the id_token to the token
      if (account) {
        token.id_token = account.id_token;
      }

      let member = await prisma.member.findFirst({ where: { email: token.email ?? "" }, include: { roles: true } });
      // we think that member here is not undefined because `singIn` should have caught anyone not in the database.
      // token.roles = member!.roles.map(r => r.name);
      token.isAdmin = member!.roles.find(r => r.name === "admin") != undefined;

      return token;
    },
    async session({ session, token }) {
      // Send send the id_token to the client
      session.id_token = token.id_token;

      // session.roles = token.roles;
      session.isAdmin = token.isAdmin;

      return session;
    }
  }
};

export const authOptions: AuthOptions = process.env.BUILD_ENV === "stg" ? stgOptions : defaultOptions;

export default NextAuth(authOptions);