import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    // Instant One-Click Demo Mode (ensures app can be evaluated & tested zero-friction)
    CredentialsProvider({
      id: "demo-student",
      name: "Demo Student",
      credentials: {},
      async authorize() {
        const demoEmail = "demo.student@bloomfocus.app";
        try {
          let user = await prisma.user.findUnique({
            where: { email: demoEmail },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name: "Sakura Student 🌸",
                email: demoEmail,
                image: "https://api.dicebear.com/7.x/bottts/svg?seed=bloom-bunny",
                currentStreak: 3,
                longestStreak: 7,
                totalFocusMinutes: 125,
                streakFreezesLeft: 1,
              },
            });
          }
          return user;
        } catch {
          // Fallback in-memory user if DB is not yet connected during early build
          return {
            id: "demo-user-id",
            name: "Sakura Student 🌸",
            email: demoEmail,
            image: "https://api.dicebear.com/7.x/bottts/svg?seed=bloom-bunny",
          };
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as { id?: string }).id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "bloomfocus-dev-secret-super-aesthetic-2026",
};
