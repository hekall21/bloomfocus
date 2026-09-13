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

    const body = await req.json().catch(() => ({}));
    const dateToFreeze = body.date || getTodayDateString();

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (user && user.streakFreezesLeft <= 0) {
        return NextResponse.json(
          { error: "No streak freezes remaining this week" },
          { status: 400 }
        );
      }

      // Upsert streak record as frozen
      await prisma.streakRecord.upsert({
        where: {
          userId_date: {
            userId,
            date: dateToFreeze,
          },
        },
        update: {
          isFrozen: true,
        },
        create: {
          userId,
          date: dateToFreeze,
          isFrozen: true,
          flowersCount: 0,
          minutesStudied: 0,
        },
      });

      if (user && user.streakFreezesLeft > 0) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            streakFreezesLeft: { decrement: 1 },
          },
        });
      }

      return NextResponse.json({ success: true, isFrozen: true });
    } catch {
      return NextResponse.json({ success: true, mock: true, isFrozen: true });
    }
  } catch {
    return NextResponse.json({ error: "Failed to apply streak freeze" }, { status: 500 });
  }
}
