"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { CuteFocusTimer } from "@/components/timer/CuteFocusTimer";
import { FlowerGarden, GardenDayData } from "@/components/garden/FlowerGarden";
import { ReflectionLogDrawer, ReflectionEntry } from "@/components/reflections/ReflectionLogDrawer";
import { AmbientPlayer } from "@/components/audio/AmbientPlayer";
import { soundEngine } from "@/lib/soundEngine";
import { Sparkles, Flower2, Timer, Heart } from "lucide-react";
import { motion } from "framer-motion";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const { data: session } = useSession();

  // Active view tab: "timer" or "garden"
  const [activeTab, setActiveTab] = useState<"timer" | "garden">("timer");

  // Notebook drawer state
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  // Garden data state
  const [currentStreak, setCurrentStreak] = useState(3);
  const [longestStreak, setLongestStreak] = useState(7);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(125);
  const [streakFreezesLeft, setStreakFreezesLeft] = useState(1);
  const [gardenDays, setGardenDays] = useState<GardenDayData[]>([]);

  // Reflections state
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);

  // Load garden & sessions on mount or when user changes
  useEffect(() => {
    fetchGardenData();
    fetchReflections();
  }, [session]);

  const fetchGardenData = async () => {
    try {
      const res = await fetch("/api/garden");
      if (res.ok) {
        const data = await res.json();
        setCurrentStreak(data.currentStreak);
        setLongestStreak(data.longestStreak);
        setTotalFocusMinutes(data.totalFocusMinutes);
        setStreakFreezesLeft(data.streakFreezesLeft);
        setGardenDays(data.gardenDays);
      }
    } catch (err) {
      console.warn("Could not fetch garden data:", err);
    }
  };

  const fetchReflections = async () => {
    try {
      const res = await fetch("/api/sessions");
      if (res.ok) {
        const data = await res.json();
        if (data.sessions) {
          const formatted: ReflectionEntry[] = data.sessions.map((s: {
            id: string;
            subject: string;
            durationMinutes: number;
            reflectionNote?: string;
            mood?: string;
            completedAt: string;
          }) => ({
            id: s.id,
            subject: s.subject,
            durationMinutes: s.durationMinutes,
            reflectionNote: s.reflectionNote || "Sesi belajar selesai dengan fokus.",
            mood: s.mood || "bloom",
            completedAt: new Date(s.completedAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }),
          }));
          setReflections(formatted);
        }
      }
    } catch (err) {
      console.warn("Could not fetch sessions:", err);
    }
  };

  // Called when user finishes focus timer and reflection
  const handleSessionComplete = async (data: {
    subject: string;
    durationMinutes: number;
    reflectionNote: string;
    mood: string;
  }) => {
    // Optimistic UI update
    const newEntry: ReflectionEntry = {
      id: "local-" + Date.now(),
      subject: data.subject,
      durationMinutes: data.durationMinutes,
      reflectionNote: data.reflectionNote,
      mood: data.mood,
      completedAt: "Baru saja",
    };
    setReflections((prev) => [newEntry, ...prev]);
    setTotalFocusMinutes((prev) => prev + data.durationMinutes);

    // Persist to database
    try {
      await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      // Refresh garden bed
      fetchGardenData();
    } catch (err) {
      console.error("Failed to save session to API:", err);
    }
  };

  // Called when user triggers streak freeze
  const handleToggleStreakFreeze = async (date: string) => {
    try {
      const res = await fetch("/api/freeze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date }),
      });
      if (res.ok) {
        setStreakFreezesLeft((prev) => Math.max(0, prev - 1));
        setGardenDays((prev) =>
          prev.map((d) => (d.date === date ? { ...d, isFrozen: true } : d))
        );
      }
    } catch (err) {
      console.error("Failed to toggle freeze:", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bloom-cream relative overflow-x-hidden">
      {/* Background Soft Pastel Aurora Glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-pink-100/50 via-rose-50/20 to-transparent pointer-events-none blur-3xl -z-10" />

      {/* Top Navigation */}
      <Navbar
        onOpenNotebook={() => setIsNotebookOpen(true)}
        currentStreak={currentStreak}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
        {/* Cozy Hero Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100/80 border border-pink-200 text-pink-700 text-xs font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 fill-pink-400" />
            <span>Ruang Belajar Estetik & Akuntabilitas Mahasiswa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-bloom-slate-800 tracking-tight">
            Fokus Belajar Lebih Tenang,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600">
              Tumbuhkan Bungamu 🌸
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-bloom-slate-500">
            Kombinasi Pomodoro santai, maskot BloomBunny yang menemani, dan kebun bunga akuntabilitas agar streak belajarmu tidak putus.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex justify-center">
          <div className="flex items-center p-1.5 bg-white/90 backdrop-blur-md rounded-2xl border border-pink-200/80 shadow-kawaii-sm">
            <button
              onClick={() => {
                soundEngine.playChime("click");
                setActiveTab("timer");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "timer"
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-bloom-slate-600 hover:text-pink-600 hover:bg-pink-50/50"
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>Meja Belajar & Timer</span>
            </button>

            <button
              onClick={() => {
                soundEngine.playChime("click");
                setActiveTab("garden");
              }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === "garden"
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-bloom-slate-600 hover:text-pink-600 hover:bg-pink-50/50"
              }`}
            >
              <Flower2 className="w-4 h-4" />
              <span>Taman Bunga (Streak)</span>
            </button>
          </div>
        </div>

        {/* Dynamic View Sections */}
        {activeTab === "timer" ? (
          <motion.div
            key="timer-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
            className="space-y-8"
          >
            {/* Cute Focus Timer Desk */}
            <CuteFocusTimer onSessionComplete={handleSessionComplete} />

            {/* Quick Teaser for Flower Garden below timer */}
            <div className="p-4 sm:p-5 bg-white/70 backdrop-blur-xl border border-pink-100 rounded-3xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <span className="text-3xl">🌷</span>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-bloom-slate-800">
                    Streak Garden: {currentStreak} Hari Berturut-turut!
                  </h4>
                  <p className="text-[11px] text-bloom-slate-500">
                    {totalFocusMinutes} menit telah kamu dedikasikan untuk masa depanmu.
                  </p>
                </div>
              </div>

              <button
                onClick={() => {
                  soundEngine.playChime("click");
                  setActiveTab("garden");
                }}
                className="text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-200 transition"
              >
                Lihat Kebun →
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="garden-tab"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* 28-Day Flower Garden Heatmap & Stats */}
            <FlowerGarden
              currentStreak={currentStreak}
              longestStreak={longestStreak}
              totalFocusMinutes={totalFocusMinutes}
              streakFreezesLeft={streakFreezesLeft}
              gardenDays={gardenDays}
              onToggleStreakFreeze={handleToggleStreakFreeze}
            />
          </motion.div>
        )}
      </main>

      {/* Floating Lo-Fi and Ambient Sound Player */}
      <AmbientPlayer />

      {/* Slide-over Reflection Log Drawer */}
      <ReflectionLogDrawer
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        reflections={reflections}
      />

      {/* Cozy Footer */}
      <footer className="mt-auto border-t border-pink-100/80 py-6 text-center text-xs text-bloom-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1">
            Dibuat dengan penuh cinta <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" /> untuk mahasiswa pejuang IPK 4.0.
          </p>
          <p className="text-[11px]">
            BloomFocus v1.0 • Next.js 14 • Tailwind CSS • Prisma PostgreSQL
          </p>
        </div>
      </footer>
    </div>
  );
}
