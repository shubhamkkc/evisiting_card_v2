import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // --- Check Super Admin ---
        const adminEmail = process.env.ADMIN_EMAIL ?? "admin@evisitingcard.com";
        const adminPassword = process.env.ADMIN_PASSWORD;

        if (credentials.email === adminEmail && credentials.password === adminPassword) {
          return { id: "admin", name: "Admin", email: credentials.email, role: "admin" };
        }

        // --- Check Business Owner ---
        // Use type assertion to handle out-of-sync Prisma types
        const business = await (prisma.business as any).findUnique({
          where: { ownerEmail: credentials.email },
        });

        if (business && business.ownerPassword) {
          const isValid = await bcrypt.compare(credentials.password, business.ownerPassword);
          if (isValid) {
            return {
              id: business.id,
              name: business.ownerName || business.businessName,
              email: credentials.email,
              role: "owner",
              businessId: business.id,
            };
          }
        }

        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET ?? "fallback-dev-secret-do-not-use-in-prod",
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.businessId = (user as any).businessId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).businessId = token.businessId;
      }
      return session;
    },
  },
};
