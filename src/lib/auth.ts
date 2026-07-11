import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "mock_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "mock_client_secret",
    }),
    CredentialsProvider({
      id: "super-admin",
      name: "Super Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findFirst({
          where: { email: credentials.email, role: "SUPER_ADMIN" }
        });

        if (user && user.password === credentials.password) {
          return user;
        }
        
        return null;
      }
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
          where: { mobileNumber: credentials.mobile, role: "STAFF" }
        });

        // Basic check for MVP (In production, use proper hashed PIN check)
        if (user && user.pin === credentials.pin) {
          if (user.isBlocked) {
            throw new Error("Your account has been blocked by the site owner.");
          }
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
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id;
      }
      
      // If we trigger an update or if the token is missing tenantId, fetch from DB
      if (token.id && (trigger === "update" || !token.tenantId)) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
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
