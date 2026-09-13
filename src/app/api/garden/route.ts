import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getTodayDateString } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || "demo-user-id";

    const todayStr = getTodayDateString();

    // Generate past 28 days
    const past28Days: string[] = [];
    for (let i = 27; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      past28Days.push(`${y}-${m}-${day}`);
    }

    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      const records = await prisma.streakRecord.findMany({
        where: {
          userId,
          date: { in: past28Days },
        },
      });

      const recordMap = new Map(records.map((r) => [r.date, r]));

      const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

      const gardenDays = past28Days.map((dateStr) => {
        const dateObj = new Date(dateStr);
        const dayName = daysOfWeek[dateObj.getDay()];
        const dayNumber = dateObj.getDate();
        const rec = recordMap.get(dateStr);

        return {
          date: dateStr,
          dayName,
          dayNumber,
          flowersCount: rec?.flowersCount || 0,
          minutesStudied: rec?.minutesStudied || 0,
          isFrozen: rec?.isFrozen || false,
          isToday: dateStr === todayStr,
        };
      });

      return NextResponse.json({
        currentStreak: user?.currentStreak || 0,
        longestStreak: user?.longestStreak || 0,
        totalFocusMinutes: user?.totalFocusMinutes || 0,
        streakFreezesLeft: user?.streakFreezesLeft ?? 1,
        gardenDays,
      });
    } catch {
      // Clean fresh response when DB not yet connected
      const daysOfWeek = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
      const gardenDays = past28Days.map((dateStr) => {
        const dateObj = new Date(dateStr);
        const dayName = daysOfWeek[dateObj.getDay()];
        const dayNumber = dateObj.getDate();

        return {
          date: dateStr,
          dayName,
          dayNumber,
          flowersCount: 0,
          minutesStudied: 0,
          isFrozen: false,
          isToday: dateStr === todayStr,
        };
      });

      return NextResponse.json({
        currentStreak: 0,
        longestStreak: 0,
        totalFocusMinutes: 0,
        streakFreezesLeft: 1,
        gardenDays,
      });
    }
  } catch (error) {
    console.error("Error fetching garden data:", error);
    return NextResponse.json({ error: "Failed to fetch garden" }, { status: 500 });
  }
}
