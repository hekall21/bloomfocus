"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";
import { CuteFocusTimer } from "@/components/timer/CuteFocusTimer";
import { FlowerGarden, GardenDayData } from "@/components/garden/FlowerGarden";
import { StudentNotebookDrawer } from "@/components/notes/StudentNotebookDrawer";
import { TimetableSchedule } from "@/components/schedule/TimetableSchedule";
import { TaskManager } from "@/components/tasks/TaskManager";
import { AmbientPlayer } from "@/components/audio/AmbientPlayer";
import { soundEngine } from "@/lib/soundEngine";
import { Sparkles, Flower2, Timer, Calendar, CheckSquare, Heart } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const { data: session } = useSession();

  // Active view tab: "timer" | "schedule" | "tasks" | "garden"
  const [activeTab, setActiveTab] = useState<"timer" | "schedule" | "tasks" | "garden">("timer");

  // Subject synchronized from schedule or task cards
  const [targetSubject, setTargetSubject] = useState("");

  // Notebook drawer state
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);

  // Garden data state
  const [currentStreak, setCurrentStreak] = useState(3);
  const [longestStreak, setLongestStreak] = useState(7);
  const [totalFocusMinutes, setTotalFocusMinutes] = useState(125);
  const [streakFreezesLeft, setStreakFreezesLeft] = useState(1);
  const [gardenDays, setGardenDays] = useState<GardenDayData[]>([]);

  // Load garden on mount or when user changes
  useEffect(() => {
    fetchGardenData();
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

  // Called when user finishes focus timer
  const handleSessionComplete = async (data: {
    subject: string;
    durationMinutes: number;
    reflectionNote: string;
    mood: string;
  }) => {
    // Optimistic UI update
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

  // Cross-feature: 1-click focus from schedule or task card
  const handleStartFocus = (subjectTitle: string) => {
    soundEngine.playChime("start");
    setTargetSubject(subjectTitle);
    setActiveTab("timer");
    window.scrollTo({ top: 0, behavior: "smooth" });
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
            <span>Ruang Belajar Estetik &amp; Akuntabilitas Mahasiswa</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-bloom-slate-800 tracking-tight">
            Fokus Belajar Lebih Tenang,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600">
              Tumbuhkan Bungamu 🌸
            </span>
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-bloom-slate-500">
            Kombinasi Pomodoro santai, jadwal mandiri sepekan, manajemen PR &amp; proyek, serta kebun bunga streak agar kuliahmu teratur dan sukses.
          </p>
        </div>

        {/* View Switcher Pills */}
        <div className="flex justify-center">
          <div className="flex flex-wrap items-center justify-center p-1.5 bg-white/90 backdrop-blur-md rounded-3xl border border-pink-200/80 shadow-kawaii-sm gap-1">
            {/* Tab 1: Timer */}
            <button
              onClick={() => {
                soundEngine.playChime("click");
                setActiveTab("timer");
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "timer"
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-bloom-slate-600 hover:text-pink-600 hover:bg-pink-50/50"
              }`}
            >
              <Timer className="w-4 h-4" />
              <span>Meja Belajar &amp; Timer</span>
            </button>

            {/* Tab 2: Jadwal Mandiri */}
            <button
              onClick={() => {
                soundEngine.playChime("click");
                setActiveTab("schedule");
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "schedule"
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-bloom-slate-600 hover:text-pink-600 hover:bg-pink-50/50"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Jadwal Mandiri 📅</span>
            </button>

            {/* Tab 3: Tugas & PR */}
            <button
              onClick={() => {
                soundEngine.playChime("click");
                setActiveTab("tasks");
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "tasks"
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-bloom-slate-600 hover:text-pink-600 hover:bg-pink-50/50"
              }`}
            >
              <CheckSquare className="w-4 h-4" />
              <span>Tugas &amp; PR 📝</span>
            </button>

            {/* Tab 4: Kebun Streak */}
            <button
              onClick={() => {
                soundEngine.playChime("click");
                setActiveTab("garden");
              }}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                activeTab === "garden"
                  ? "bg-pink-500 text-white shadow-sm"
                  : "text-bloom-slate-600 hover:text-pink-600 hover:bg-pink-50/50"
              }`}
            >
              <Flower2 className="w-4 h-4" />
              <span>Taman Bunga (Streak) 🌸</span>
            </button>
          </div>
        </div>

        {/* Dynamic View Sections */}
        <AnimatePresence mode="wait">
          {activeTab === "timer" && (
            <motion.div
              key="timer-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="space-y-8"
            >
              {/* Cute Focus Timer Desk */}
              <CuteFocusTimer
                initialSubject={targetSubject}
                onSessionComplete={handleSessionComplete}
                onSubjectChange={(val) => setTargetSubject(val)}
                onOpenNotebook={() => setIsNotebookOpen(true)}
              />

              {/* Quick Teaser row below timer: Quick jump to Schedule & Tasks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Jadwal Quick Teaser */}
                <div className="p-4 bg-white/70 backdrop-blur-xl border border-pink-100 rounded-3xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📅</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-bloom-slate-800">
                        Jadwal Belajar Sepekan
                      </h4>
                      <p className="text-[11px] text-bloom-slate-500">
                        Atur jam kuliah &amp; agenda dari Senin hingga Minggu.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playChime("click");
                      setActiveTab("schedule");
                    }}
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-200 transition"
                  >
                    Buka →
                  </button>
                </div>

                {/* Tugas & PR Quick Teaser */}
                <div className="p-4 bg-white/70 backdrop-blur-xl border border-pink-100 rounded-3xl flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📝</span>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-bloom-slate-800">
                        Tugas &amp; Project Tracker
                      </h4>
                      <p className="text-[11px] text-bloom-slate-500">
                        Pantau deadline PR &amp; proyek dengan countdown otomatis.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      soundEngine.playChime("click");
                      setActiveTab("tasks");
                    }}
                    className="text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-3 py-1.5 rounded-xl border border-pink-200 transition"
                  >
                    Buka →
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "schedule" && (
            <motion.div
              key="schedule-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <TimetableSchedule onStartFocus={handleStartFocus} />
            </motion.div>
          )}

          {activeTab === "tasks" && (
            <motion.div
              key="tasks-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <TaskManager onStartFocus={handleStartFocus} />
            </motion.div>
          )}

          {activeTab === "garden" && (
            <motion.div
              key="garden-tab"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
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
        </AnimatePresence>
      </main>

      {/* Floating Lo-Fi and Ambient Sound Player */}
      <AmbientPlayer />

      {/* Slide-over Study Notebook Drawer */}
      <StudentNotebookDrawer
        isOpen={isNotebookOpen}
        onClose={() => setIsNotebookOpen(false)}
        defaultCourse={targetSubject}
      />

      {/* Cozy Footer */}
      <footer className="mt-auto border-t border-pink-100/80 py-6 text-center text-xs text-bloom-slate-400">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center gap-1">
            Dibuat dengan penuh cinta <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400" /> untuk mahasiswa pejuang IPK 4.0.
          </p>
          <p className="text-[11px]">
            BloomFocus v1.2 • Next.js 14 • Tailwind CSS • Jadwal Mandiri &amp; Task Tracker
          </p>
        </div>
      </footer>
    </div>
  );
}
