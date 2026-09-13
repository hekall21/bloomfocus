"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/soundEngine";
import { Sparkles, Heart, BookOpen, Send } from "lucide-react";

interface ReflectionModalProps {
  isOpen: boolean;
  subject: string;
  durationMinutes: number;
  onSave: (data: { reflectionNote: string; mood: string }) => Promise<void>;
  onClose: () => void;
}

const MOODS = [
  { id: "bloom", label: "Paham Banget 🌸", icon: "🌸" },
  { id: "light", label: "Ada Pencerahan 💡", icon: "💡" },
  { id: "steady", label: "Lumayan Oke 🍵", icon: "🍵" },
  { id: "tired", label: "Capek tapi Selesai 😴", icon: "😴" },
];

export function ReflectionModal({
  isOpen,
  subject,
  durationMinutes,
  onSave,
  onClose,
}: ReflectionModalProps) {
  const [reflection, setReflection] = useState("");
  const [selectedMood, setSelectedMood] = useState("bloom");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire celebration chimes and multi-color pastel confetti
      soundEngine.playChime("finish");
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#FDA4AF", "#F472B6", "#E9D5FF", "#DCFCE7", "#FEF08A"],
        });
      } catch {
        // canvas-confetti fallback
      }
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playChime("click");
    setIsSubmitting(true);
    try {
      await onSave({
        reflectionNote: reflection.trim() || "Sesi fokus berhasil diselesaikan dengan baik! ✨",
        mood: selectedMood,
      });
      onClose();
      setReflection("");
    } catch (err) {
      console.error("Failed to save reflection:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bloom-slate-900/40 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 shadow-kawaii-lg border border-pink-200/80"
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-pink-100 text-pink-500 border border-pink-200 shadow-sm animate-breathe">
              <Sparkles className="w-8 h-8 fill-pink-300" />
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-bloom-slate-800 tracking-tight">
              Yeeay! Sesi Belajar Tuntas 🌸
            </h3>
            <p className="text-xs sm:text-sm text-bloom-slate-500">
              Kamu baru saja menyelesaikan{" "}
              <span className="font-bold text-pink-600">{durationMinutes} menit</span> fokus untuk mata kuliah{" "}
              <span className="font-bold text-bloom-slate-700 bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-200">
                {subject}
              </span>
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Question prompt */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-bloom-slate-700 mb-2 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-pink-500" />
                <span>1 hal terpenting yang kamu pahami di sesi ini?</span>
              </label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Contoh: Mengerti konsep integral substitusi di teorema 3.2, jangan lupa perhatikan turunan bagian dalamnya..."
                rows={3}
                className="w-full p-3.5 bg-pink-50/40 border border-pink-200 rounded-2xl text-xs sm:text-sm text-bloom-slate-800 placeholder-bloom-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 transition"
                autoFocus
              />
              <p className="mt-1 text-[11px] text-bloom-slate-400 italic">
                Catatan ini otomatis disimpan ke Buku Catatan Refleksi untuk kamu baca kilat sebelum ujian! 📖
              </p>
            </div>

            {/* Mood selector */}
            <div>
              <label className="block text-xs sm:text-sm font-bold text-bloom-slate-700 mb-2 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-pink-500" />
                <span>Bagaimana perasaanmu setelah sesi ini?</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {MOODS.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => {
                      soundEngine.playChime("click");
                      setSelectedMood(m.id);
                    }}
                    className={`p-2.5 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1 transition ${
                      selectedMood === m.id
                        ? "bg-pink-100 border-pink-400 text-pink-700 shadow-sm scale-102"
                        : "bg-white border-pink-100 text-bloom-slate-600 hover:bg-pink-50/60"
                    }`}
                  >
                    <span className="text-xl">{m.icon}</span>
                    <span className="text-[11px]">{m.label.split(" ")[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit buttons */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-2xl text-xs font-bold text-bloom-slate-500 hover:bg-pink-50 transition"
              >
                Lewati Refleksi
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-kawaii hover:shadow-kawaii-lg transition transform active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Menyimpan...</span>
                ) : (
                  <>
                    <span>Simpan & Petik Bunga</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
