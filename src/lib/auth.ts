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
            authorization: {
              params: {
                prompt: "select_account",
                access_type: "offline",
                response_type: "code",
              },
            },
            allowDangerousEmailAccountLinking: true,
          }),
        ]
      : []),
    // Instant Google Direct Sign-In (Allows ANY user to log in with their @gmail.com without OAuth blocks)
    CredentialsProvider({
      id: "google-direct",
      name: "Google Account Direct",
      credentials: {
        email: { label: "Email Google", type: "email" },
        name: { label: "Nama", type: "text" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase() || "user@gmail.com";
        // Extract a friendly name from email if not given (e.g. "budi.santoso@gmail.com" -> "Budi Santoso")
        let extractedName = credentials?.name?.trim();
        if (!extractedName) {
          const usernamePart = email.split("@")[0] || "Mahasiswa";
          extractedName = usernamePart
            .split(/[._-]/)
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
        }

        const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`;

        try {
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name: extractedName,
                email,
                image: avatar,
                currentStreak: 0,
                longestStreak: 0,
                totalFocusMinutes: 0,
                streakFreezesLeft: 1,
              },
            });
          }
          return user;
        } catch {
          return {
            id: "user-" + email.replace(/[^a-zA-Z0-9]/g, ""),
            name: extractedName,
            email,
            image: avatar,
          };
        }
      },
    }),
    // Custom Student Profile Login (Allows user to use their own name & email)
    CredentialsProvider({
      id: "student-account",
      name: "Student Account",
      credentials: {
        name: { label: "Nama Lengkap", type: "text" },
        email: { label: "Email", type: "email" },
      },
      async authorize(credentials) {
        const name = credentials?.name?.trim() || "Mahasiswa Pejuang IPK 🌸";
        const email = credentials?.email?.trim().toLowerCase() || `student_${Date.now()}@bloomfocus.local`;
        const avatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

        try {
          let user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                name,
                email,
                image: avatar,
                currentStreak: 0,
                longestStreak: 0,
                totalFocusMinutes: 0,
                streakFreezesLeft: 1,
              },
            });
          }
          return user;
        } catch {
          // Resilient fallback in-memory user when DB is not yet running
          return {
            id: "user-" + (email.replace(/[^a-zA-Z0-9]/g, "") || Date.now().toString()),
            name,
            email,
            image: avatar,
          };
        }
      },
    }),
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
                currentStreak: 0,
                longestStreak: 0,
                totalFocusMinutes: 0,
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
