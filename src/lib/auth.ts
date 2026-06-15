import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Mobile & PIN",
      credentials: {
        mobile: { label: "Mobile Number", type: "text" },
        pin: { label: "4-Digit PIN", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.mobile || !credentials?.pin) return null;
        
        // Find staff user by mobile number
        const user = await prisma.user.findFirst({
          where: { mobile: credentials.mobile, role: "STAFF" }
        });

        // Basic check for MVP (In production, use proper hashed PIN check)
        if (user && user.pin === credentials.pin) {
          return user;
        }
        
        return null;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        
        // Fetch the latest user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { tenantId: true, role: true }
        });

        if (dbUser) {
          token.tenantId = dbUser.tenantId;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.tenantId = token.tenantId as string | null;
        session.user.role = token.role as string;
      }
      return session;
    }
  }
};
