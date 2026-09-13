import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getTodayDateString } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || "demo-user-id";

    const body = await req.json();
    const { subject, durationMinutes, reflectionNote, mood } = body;

    const todayDate = getTodayDateString();

    try {
      // 1. Create StudySession record
      const studySession = await prisma.studySession.create({
        data: {
          userId,
          subject: subject || "Fokus Mandiri",
          durationMinutes: Number(durationMinutes) || 25,
          reflectionNote: reflectionNote || null,
          mood: mood || "bloom",
        },
      });

      // 2. Upsert StreakRecord for today
      const streakRecord = await prisma.streakRecord.upsert({
        where: {
          userId_date: {
            userId,
            date: todayDate,
          },
        },
        update: {
          flowersCount: { increment: 1 },
          minutesStudied: { increment: Number(durationMinutes) || 25 },
        },
        create: {
          userId,
          date: todayDate,
          flowersCount: 1,
          minutesStudied: Number(durationMinutes) || 25,
          isFrozen: false,
        },
      });

      // 3. Update User cumulative totals and streaks
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user) {
        const newTotalMinutes = user.totalFocusMinutes + (Number(durationMinutes) || 25);
        const newStreak = user.currentStreak === 0 ? 1 : user.currentStreak;
        const newLongest = Math.max(user.longestStreak, newStreak);

        await prisma.user.update({
          where: { id: userId },
          data: {
            totalFocusMinutes: newTotalMinutes,
            currentStreak: newStreak,
            longestStreak: newLongest,
          },
        });
      }

      return NextResponse.json({
        success: true,
        session: studySession,
        streakRecord,
      });
    } catch (dbError) {
      console.warn("DB not connected or offline, returning fallback mock response:", dbError);
      return NextResponse.json({
        success: true,
        mock: true,
        session: {
          id: "mock-" + Date.now(),
          userId,
          subject,
          durationMinutes,
          reflectionNote,
          mood,
          completedAt: new Date().toISOString(),
        },
      });
    }
  } catch (error) {
    console.error("Failed to process session:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || "demo-user-id";

    try {
      const sessions = await prisma.studySession.findMany({
        where: { userId },
        orderBy: { completedAt: "desc" },
        take: 30,
      });

      return NextResponse.json({ sessions });
    } catch {
      // Fallback demo data
      return NextResponse.json({
        sessions: [
          {
            id: "1",
            subject: "Kalkulus Bab 3",
            durationMinutes: 25,
            reflectionNote: "Paham aturan rantai turunan dan limit kontinuitas.",
            mood: "bloom",
            completedAt: new Date(Date.now() - 3600000).toISOString(),
          },
          {
            id: "2",
            subject: "Algoritma & Pemrograman",
            durationMinutes: 50,
            reflectionNote: "Berhasil implementasi binary search tree di C++.",
            mood: "light",
            completedAt: new Date(Date.now() - 86400000).toISOString(),
          },
        ],
      });
    }
  } catch {
    return NextResponse.json({ error: "Failed to fetch sessions" }, { status: 500 });
  }
}
