"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import { Sparkles, Shield, Flame, Clock, Award, Info } from "lucide-react";

export interface GardenDayData {
  date: string; // "YYYY-MM-DD"
  dayName: string; // "Sen", "Sel", etc.
  dayNumber: number;
  flowersCount: number;
  minutesStudied: number;
  isFrozen: boolean;
  isToday: boolean;
}

interface FlowerGardenProps {
  currentStreak: number;
  longestStreak: number;
  totalFocusMinutes: number;
  streakFreezesLeft: number;
  gardenDays: GardenDayData[];
  onToggleStreakFreeze?: (date: string) => Promise<void>;
}

export function FlowerGarden({
  currentStreak,
  longestStreak,
  totalFocusMinutes,
  streakFreezesLeft,
  gardenDays,
  onToggleStreakFreeze,
}: FlowerGardenProps) {
  const [hoveredDay, setHoveredDay] = useState<GardenDayData | null>(null);
  const [isFreezing, setIsFreezing] = useState(false);

  const totalHours = (totalFocusMinutes / 60).toFixed(1);
  const totalBlooms = gardenDays.reduce((acc, curr) => acc + curr.flowersCount, 0);

  const handleStreakFreezeClick = async () => {
    if (streakFreezesLeft <= 0) {
      alert("Kamu sudah menggunakan kuota Streak Freeze minggu ini! Yuk luangkan 1 sesi fokus 🌸");
      return;
    }

    const today = gardenDays.find((d) => d.isToday);
    if (!today) return;

    if (confirm("Gunakan 1x Streak Freeze untuk melindungi streak belajarmu hari ini? ❄️")) {
      soundEngine.playChime("freeze");
      setIsFreezing(true);
      try {
        if (onToggleStreakFreeze) {
          await onToggleStreakFreeze(today.date);
        }
      } finally {
        setIsFreezing(false);
      }
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* 4 Cute Stat Highlights */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Stat 1: Current Streak */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white/85 backdrop-blur-xl border border-pink-200/80 rounded-3xl p-4 shadow-kawaii-sm flex items-center gap-3"
        >
          <div className="p-3 bg-rose-100/90 text-rose-500 rounded-2xl">
            <Flame className="w-6 h-6 fill-rose-400" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-bloom-slate-400 uppercase tracking-wider">
              Streak Aktif
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-bloom-slate-800">
              {currentStreak}{" "}
              <span className="text-xs font-semibold text-rose-500">Hari</span>
            </h4>
          </div>
        </motion.div>

        {/* Stat 2: Total Blooms */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white/85 backdrop-blur-xl border border-pink-200/80 rounded-3xl p-4 shadow-kawaii-sm flex items-center gap-3"
        >
          <div className="p-3 bg-pink-100/90 text-pink-500 rounded-2xl">
            <Sparkles className="w-6 h-6 fill-pink-300" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-bloom-slate-400 uppercase tracking-wider">
              Bunga Mekar
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-bloom-slate-800">
              {totalBlooms}{" "}
              <span className="text-xs font-semibold text-pink-500">Kuntum</span>
            </h4>
          </div>
        </motion.div>

        {/* Stat 3: Total Study Hours */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white/85 backdrop-blur-xl border border-pink-200/80 rounded-3xl p-4 shadow-kawaii-sm flex items-center gap-3"
        >
          <div className="p-3 bg-purple-100/90 text-purple-500 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-bloom-slate-400 uppercase tracking-wider">
              Waktu Belajar
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-bloom-slate-800">
              {totalHours}{" "}
              <span className="text-xs font-semibold text-purple-500">Jam</span>
            </h4>
          </div>
        </motion.div>

        {/* Stat 4: Longest Streak */}
        <motion.div
          whileHover={{ y: -3 }}
          className="bg-white/85 backdrop-blur-xl border border-pink-200/80 rounded-3xl p-4 shadow-kawaii-sm flex items-center gap-3"
        >
          <div className="p-3 bg-amber-100/90 text-amber-500 rounded-2xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-bloom-slate-400 uppercase tracking-wider">
              Rekor Terbaik
            </p>
            <h4 className="text-xl sm:text-2xl font-black text-bloom-slate-800">
              {longestStreak}{" "}
              <span className="text-xs font-semibold text-amber-500">Hari</span>
            </h4>
          </div>
        </motion.div>
      </div>

      {/* Visual Garden Bed & Interactive Flower Pasture */}
      <div className="bg-gradient-to-b from-white/90 via-pink-50/40 to-emerald-50/30 backdrop-blur-2xl border border-pink-200/80 rounded-4xl p-6 sm:p-8 shadow-kawaii relative overflow-hidden">
        {/* Header & Streak Freeze Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-pink-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🌷</span>
              <h3 className="text-lg sm:text-xl font-black text-bloom-slate-800">
                Taman Bunga Akuntabilitas (Streak Garden)
              </h3>
            </div>
            <p className="text-xs text-bloom-slate-500 mt-1">
              Setiap sesi fokus yang kamu selesaikan akan menumbuhkan sekuntum bunga mekar di kebunmu.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleStreakFreezeClick}
              disabled={streakFreezesLeft <= 0 || isFreezing}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold border transition shadow-sm ${
                streakFreezesLeft > 0
                  ? "bg-cyan-50 border-cyan-200 text-cyan-700 hover:bg-cyan-100 hover:border-cyan-300"
                  : "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              title="Aktifkan Streak Freeze jika ada urusan kampus / sakit agar streak tidak hangus"
            >
              <Shield className="w-4 h-4 text-cyan-500" />
              <span>
                Streak Freeze ({streakFreezesLeft}x tersisa)
              </span>
            </button>
          </div>
        </div>

        {/* The 28-Day Flower Garden Grid */}
        <div className="mt-6">
          <div className="grid grid-cols-7 gap-2 sm:gap-3">
            {gardenDays.map((day) => {
              const hasBloomed = day.flowersCount > 0;
              const isToday = day.isToday;
              const isFrozen = day.isFrozen;

              return (
                <div
                  key={day.date}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  className={`group relative flex flex-col items-center justify-center p-2 sm:p-3 rounded-2xl border transition-all cursor-pointer ${
                    isToday
                      ? "ring-2 ring-pink-400 bg-pink-100/60 border-pink-300"
                      : hasBloomed
                      ? "bg-white/80 border-pink-200 hover:bg-pink-50/70 hover:shadow-kawaii-sm"
                      : isFrozen
                      ? "bg-cyan-50/70 border-cyan-200"
                      : "bg-pink-50/20 border-pink-100/50 hover:bg-white/60"
                  }`}
                >
                  <span className="text-[10px] font-bold text-bloom-slate-400 mb-1">
                    {day.dayName} {day.dayNumber}
                  </span>

                  {/* Flower Graphic per Status */}
                  <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                    {hasBloomed ? (
                      <motion.div
                        animate={{ rotate: [-2, 2, -2] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="text-xl sm:text-2xl filter drop-shadow-sm"
                      >
                        {day.flowersCount >= 3 ? "🌺" : day.flowersCount === 2 ? "🌸" : "🌷"}
                      </motion.div>
                    ) : isFrozen ? (
                      <div className="text-xl sm:text-2xl filter drop-shadow-sm">
                        ❄️
                      </div>
                    ) : (
                      <div className="text-lg opacity-40 group-hover:opacity-80 transition">
                        🌱
                      </div>
                    )}
                  </div>

                  {/* Indicator count */}
                  <span
                    className={`text-[9px] font-extrabold mt-1 ${
                      hasBloomed
                        ? "text-pink-600"
                        : isFrozen
                        ? "text-cyan-600"
                        : "text-bloom-slate-300"
                    }`}
                  >
                    {hasBloomed ? `${day.flowersCount} 🌸` : isFrozen ? "Freeze" : "Rehat"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Tooltip Bar */}
        <div className="mt-5 p-3 rounded-2xl bg-white/70 border border-pink-100 text-xs flex items-center justify-between text-bloom-slate-600">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-pink-400" />
            {hoveredDay ? (
              <span>
                <strong className="text-bloom-slate-800">{hoveredDay.date}</strong>:{" "}
                {hoveredDay.flowersCount > 0 ? (
                  <>
                    Tuntas <strong className="text-pink-600">{hoveredDay.minutesStudied} menit</strong>{" "}
                    ({hoveredDay.flowersCount} bunga mekar! 🎉)
                  </>
                ) : hoveredDay.isFrozen ? (
                  "Hari ini dilindungi Streak Freeze ❄️"
                ) : (
                  "Belum ada sesi fokus di hari ini 🌱"
                )}
              </span>
            ) : (
              <span>Arahkan kursor ke tiap petak taman untuk melihat rincian belajar harian.</span>
            )}
          </div>

          <div className="hidden sm:flex items-center gap-3 text-[11px] text-bloom-slate-500">
            <span className="flex items-center gap-1">🌷 1 Sesi</span>
            <span className="flex items-center gap-1">🌸 2 Sesi</span>
            <span className="flex items-center gap-1">🌺 3+ Sesi</span>
            <span className="flex items-center gap-1">❄️ Frozen</span>
          </div>
        </div>
      </div>
    </div>
  );
}
