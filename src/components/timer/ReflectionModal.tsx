"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { soundEngine } from "@/lib/soundEngine";
import { Sparkles, Coffee, BookOpen, CheckCircle2, Play } from "lucide-react";

interface ReflectionModalProps {
  isOpen: boolean;
  subject: string;
  durationMinutes: number;
  onSave: (data: { reflectionNote: string; mood: string }) => Promise<void>;
  onClose: () => void;
  onOpenNotebook?: () => void;
}

export function ReflectionModal({
  isOpen,
  subject,
  durationMinutes,
  onSave,
  onClose,
  onOpenNotebook,
}: ReflectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Fire celebration chimes and multi-color pastel confetti
      soundEngine.playChime("finish");
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
          colors: ["#FDA4AF", "#F472B6", "#E9D5FF", "#DCFCE7", "#FEF08A"],
        });
      } catch {
        // canvas-confetti fallback
      }
    }
  }, [isOpen]);

  const handleFinishAndBreak = async () => {
    soundEngine.playChime("click");
    setIsSubmitting(true);
    try {
      await onSave({
        reflectionNote: `Selesai fokus ${durationMinutes} menit.`,
        mood: "bloom",
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinishAndTakeNotes = async () => {
    soundEngine.playChime("finish");
    setIsSubmitting(true);
    try {
      await onSave({
        reflectionNote: `Selesai fokus ${durationMinutes} menit.`,
        mood: "bloom",
      });
      onClose();
      if (onOpenNotebook) {
        onOpenNotebook();
      }
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
          className="w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-4xl p-6 sm:p-8 shadow-kawaii-lg border border-pink-200/80 text-center relative"
        >
          {/* Header Icon */}
          <div className="inline-flex p-3.5 rounded-3xl bg-gradient-to-tr from-pink-400 to-rose-300 text-white shadow-kawaii mb-3">
            <span className="text-3xl">🌸</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black text-bloom-slate-800 tracking-tight">
            Yeeay! Sesi Belajar Tuntas ✨
          </h3>

          <p className="text-xs sm:text-sm text-bloom-slate-500 mt-1.5">
            Kamu baru saja menyelesaikan{" "}
            <span className="font-extrabold text-pink-600">{durationMinutes} menit</span> fokus{" "}
            {subject ? (
              <>
                untuk target{" "}
                <span className="font-bold text-bloom-slate-700 bg-pink-50 px-2 py-0.5 rounded-lg border border-pink-200">
                  {subject}
                </span>
              </>
            ) : (
              "belajar mandiri"
            )}
            . 1 bunga baru mekar di kebunmu! 🌷
          </p>

          {/* Action choices */}
          <div className="mt-6 space-y-2.5">
            {/* Break Button */}
            <button
              onClick={handleFinishAndBreak}
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-kawaii transition flex items-center justify-center gap-2"
            >
              <Coffee className="w-4 h-4" />
              <span>Mulai Waktu Istirahat (Rehat Sejenak 🍵)</span>
            </button>

            {/* Take Notes in Notebook Button */}
            <button
              onClick={handleFinishAndTakeNotes}
              disabled={isSubmitting}
              className="w-full py-3 px-4 bg-pink-50 hover:bg-pink-100 text-pink-700 font-bold text-xs rounded-2xl border border-pink-200 transition flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Tulis Catatan di Buku Catatan 📖</span>
            </button>

            {/* Continue straight */}
            <button
              onClick={handleFinishAndBreak}
              disabled={isSubmitting}
              className="w-full py-2 text-bloom-slate-400 hover:text-bloom-slate-600 font-semibold text-xs transition"
            >
              Tutup &amp; Siapkan Sesi Berikutnya
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
