"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import { formatTime } from "@/lib/utils";
import { BloomMascot, MascotState } from "@/components/mascot/BloomMascot";
import { ReflectionModal } from "@/components/timer/ReflectionModal";
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Coffee,
  Sparkles,
  Settings2,
  Tag,
} from "lucide-react";

type TimerMode = "focus" | "shortBreak" | "longBreak";

interface TimerSettings {
  focusDuration: number; // in minutes
  shortBreakDuration: number;
  longBreakDuration: number;
}

const DEFAULT_SUBJECTS = [
  "Kalkulus Bab 3",
  "Algoritma & Pemrograman",
  "Basis Data Lanjutan",
  "UKM & BEM Paperwork",
  "Tugas Akhir / Skripsi",
  "Persiapan Sidang",
];

interface CuteFocusTimerProps {
  onSessionComplete?: (data: {
    subject: string;
    durationMinutes: number;
    reflectionNote: string;
    mood: string;
  }) => Promise<void>;
}

export function CuteFocusTimer({ onSessionComplete }: CuteFocusTimerProps) {
  const [mode, setMode] = useState<TimerMode>("focus");
  const [settings, setSettings] = useState<TimerSettings>({
    focusDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
  });

  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [subject, setSubject] = useState("Kalkulus Bab 3");
  const [customSubjectInput, setCustomSubjectInput] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [lastFinishedDuration, setLastFinishedDuration] = useState(25);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Total seconds for current mode
  const getTotalSeconds = (currentMode: TimerMode) => {
    switch (currentMode) {
      case "focus":
        return settings.focusDuration * 60;
      case "shortBreak":
        return settings.shortBreakDuration * 60;
      case "longBreak":
        return settings.longBreakDuration * 60;
    }
  };

  // Switch mode handler
  const handleSwitchMode = React.useCallback(
    (newMode: TimerMode) => {
      soundEngine.playChime("click");
      setIsRunning(false);
      setMode(newMode);
      switch (newMode) {
        case "focus":
          setTimeLeft(settings.focusDuration * 60);
          break;
        case "shortBreak":
          setTimeLeft(settings.shortBreakDuration * 60);
          break;
        case "longBreak":
          setTimeLeft(settings.longBreakDuration * 60);
          break;
      }
    },
    [settings]
  );

  // Toggle play/pause
  const handleTogglePlay = () => {
    if (!isRunning) {
      soundEngine.playChime("start");
      setIsRunning(true);
    } else {
      soundEngine.playChime("click");
      setIsRunning(false);
    }
  };

  // Reset timer
  const handleReset = () => {
    soundEngine.playChime("click");
    setIsRunning(false);
    setTimeLeft(getTotalSeconds(mode));
  };

  // When timer hits 0:00
  const handleTimerComplete = React.useCallback(() => {
    if (mode === "focus") {
      setLastFinishedDuration(settings.focusDuration);
      setShowReflectionModal(true);
    } else {
      soundEngine.playChime("finish");
      handleSwitchMode("focus");
    }
  }, [mode, settings.focusDuration, handleSwitchMode]);

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleTimerComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, handleTimerComplete]);

  // Skip / fast finish
  const handleSkipOrFinish = () => {
    if (confirm("Ingin menyelesaikan sesi ini sekarang?")) {
      soundEngine.playChime("click");
      setIsRunning(false);
      handleTimerComplete();
    }
  };

  const handleSaveReflection = async (data: { reflectionNote: string; mood: string }) => {
    if (onSessionComplete) {
      await onSessionComplete({
        subject,
        durationMinutes: lastFinishedDuration,
        reflectionNote: data.reflectionNote,
        mood: data.mood,
      });
    }
    // Switch to break after focus session completes
    handleSwitchMode("shortBreak");
  };

  // Calculate percentage for cute progress ring
  const totalSeconds = getTotalSeconds(mode);
  const progressPercent = ((totalSeconds - timeLeft) / totalSeconds) * 100;

  // Mascot state resolution
  let mascotState: MascotState = "studying";
  if (showReflectionModal) {
    mascotState = "celebrate";
  } else if (mode === "shortBreak" || mode === "longBreak") {
    mascotState = "break";
  }

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center">
      {/* Mode Selector Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-pink-100/70 backdrop-blur-md rounded-full border border-pink-200/80 shadow-sm mb-6">
        <button
          onClick={() => handleSwitchMode("focus")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mode === "focus"
              ? "bg-white text-pink-600 shadow-sm shadow-pink-200"
              : "text-bloom-slate-600 hover:text-pink-600"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          <span>Fokus ({settings.focusDuration}m)</span>
        </button>

        <button
          onClick={() => handleSwitchMode("shortBreak")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mode === "shortBreak"
              ? "bg-white text-emerald-600 shadow-sm shadow-emerald-200"
              : "text-bloom-slate-600 hover:text-emerald-600"
          }`}
        >
          <Coffee className="w-3.5 h-3.5 text-emerald-500" />
          <span>Istirahat ({settings.shortBreakDuration}m)</span>
        </button>

        <button
          onClick={() => handleSwitchMode("longBreak")}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all ${
            mode === "longBreak"
              ? "bg-white text-purple-600 shadow-sm shadow-purple-200"
              : "text-bloom-slate-600 hover:text-purple-600"
          }`}
        >
          <Coffee className="w-3.5 h-3.5 text-purple-500" />
          <span>Rehat Panjang ({settings.longBreakDuration}m)</span>
        </button>
      </div>

      {/* Main Study Card */}
      <motion.div
        layout
        className={`w-full bg-white/85 backdrop-blur-2xl rounded-4xl p-6 sm:p-10 shadow-kawaii border transition-all relative ${
          isRunning
            ? "border-pink-300 ring-4 ring-pink-100/60 shadow-pink-200/50"
            : "border-pink-200/80 hover:shadow-kawaii-lg"
        }`}
      >
        {/* Subject Tag Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-pink-100/70">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-pink-500" />
            <span className="text-xs font-bold text-bloom-slate-400">Target Belajar:</span>

            {showCustomInput ? (
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  placeholder="Ketik mata kuliah..."
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && customSubjectInput.trim()) {
                      setSubject(customSubjectInput.trim());
                      setShowCustomInput(false);
                      setCustomSubjectInput("");
                    }
                  }}
                  className="px-2.5 py-1 text-xs bg-pink-50 border border-pink-300 rounded-lg text-bloom-slate-800 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (customSubjectInput.trim()) setSubject(customSubjectInput.trim());
                    setShowCustomInput(false);
                  }}
                  className="text-[10px] font-bold text-pink-600 hover:underline px-1"
                >
                  OK
                </button>
              </div>
            ) : (
              <select
                value={subject}
                onChange={(e) => {
                  if (e.target.value === "custom") {
                    setShowCustomInput(true);
                  } else {
                    setSubject(e.target.value);
                  }
                }}
                className="text-xs font-bold text-bloom-slate-700 bg-pink-50/70 hover:bg-pink-100/60 border border-pink-200 rounded-xl px-2.5 py-1 cursor-pointer focus:outline-none transition"
              >
                {DEFAULT_SUBJECTS.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
                <option value="custom">+ Tulis Subjek Lain...</option>
              </select>
            )}
          </div>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-1.5 text-bloom-slate-400 hover:text-pink-500 rounded-xl hover:bg-pink-50 transition"
            title="Kustomisasi Durasi Waktu"
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Settings Panel Drawer */}
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-5 p-4 bg-pink-50/70 border border-pink-200 rounded-2xl text-xs space-y-3"
          >
            <p className="font-bold text-bloom-slate-700">Atur Waktu Pomodoro (Menit):</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <span className="text-[11px] text-bloom-slate-500">Fokus:</span>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={settings.focusDuration}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 25;
                    setSettings({ ...settings, focusDuration: v });
                    if (mode === "focus" && !isRunning) setTimeLeft(v * 60);
                  }}
                  className="w-full mt-1 px-2 py-1 bg-white border border-pink-200 rounded-lg text-center font-bold text-bloom-slate-700"
                />
              </div>
              <div>
                <span className="text-[11px] text-bloom-slate-500">Istirahat:</span>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.shortBreakDuration}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 5;
                    setSettings({ ...settings, shortBreakDuration: v });
                    if (mode === "shortBreak" && !isRunning) setTimeLeft(v * 60);
                  }}
                  className="w-full mt-1 px-2 py-1 bg-white border border-pink-200 rounded-lg text-center font-bold text-bloom-slate-700"
                />
              </div>
              <div>
                <span className="text-[11px] text-bloom-slate-500">Rehat Panjang:</span>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={settings.longBreakDuration}
                  onChange={(e) => {
                    const v = parseInt(e.target.value) || 15;
                    setSettings({ ...settings, longBreakDuration: v });
                    if (mode === "longBreak" && !isRunning) setTimeLeft(v * 60);
                  }}
                  className="w-full mt-1 px-2 py-1 bg-white border border-pink-200 rounded-lg text-center font-bold text-bloom-slate-700"
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Mascot Centerpiece */}
        <div className="flex justify-center mb-4">
          <BloomMascot
            state={mascotState}
            subject={subject}
            isPaused={!isRunning && timeLeft < totalSeconds}
          />
        </div>

        {/* Timer Countdown Display with Breathing Pulse */}
        <div className="text-center my-4">
          <motion.div
            animate={isRunning ? { scale: [1, 1.025, 1] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="inline-block"
          >
            <h1 className="text-6xl sm:text-7xl font-black tracking-tight text-bloom-slate-800 drop-shadow-sm font-mono">
              {formatTime(timeLeft)}
            </h1>
          </motion.div>

          {/* Cute Progress Bar */}
          <div className="w-48 sm:w-64 mx-auto mt-3 h-2.5 bg-pink-100 rounded-full overflow-hidden p-0.5">
            <motion.div
              className={`h-full rounded-full transition-all duration-300 ${
                mode === "focus"
                  ? "bg-gradient-to-r from-pink-400 to-rose-400"
                  : "bg-gradient-to-r from-emerald-400 to-teal-400"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={handleReset}
            className="p-3 text-bloom-slate-400 hover:text-bloom-slate-600 hover:bg-pink-50 rounded-2xl transition border border-transparent hover:border-pink-200"
            title="Ulangi Waktu"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <motion.button
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.94 }}
            onClick={handleTogglePlay}
            className={`px-8 py-4 rounded-3xl font-extrabold text-white text-base shadow-kawaii hover:shadow-kawaii-lg transition flex items-center gap-2.5 ${
              isRunning
                ? "bg-amber-400 hover:bg-amber-500 shadow-amber-200"
                : "bg-gradient-to-r from-pink-400 via-rose-400 to-pink-500 hover:from-pink-500 hover:to-rose-600 shadow-pink-200"
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white" />
                <span>Mulai Fokus</span>
              </>
            )}
          </motion.button>

          <button
            onClick={handleSkipOrFinish}
            className="p-3 text-bloom-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-2xl transition border border-transparent hover:border-pink-200"
            title="Selesaikan Sesi Sekarang"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </motion.div>

      {/* Post-Session Reflection Modal */}
      <ReflectionModal
        isOpen={showReflectionModal}
        subject={subject}
        durationMinutes={lastFinishedDuration}
        onSave={handleSaveReflection}
        onClose={() => {
          setShowReflectionModal(false);
          handleSwitchMode("shortBreak");
        }}
      />
    </div>
  );
}
