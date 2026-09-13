"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookMarked, X, Search, Calendar, Clock, Tag } from "lucide-react";

export interface ReflectionEntry {
  id: string;
  subject: string;
  durationMinutes: number;
  reflectionNote: string;
  mood: string;
  completedAt: string;
}

interface ReflectionLogDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  reflections: ReflectionEntry[];
}

export function ReflectionLogDrawer({
  isOpen,
  onClose,
  reflections,
}: ReflectionLogDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState<string>("all");

  const subjects = Array.from(new Set(reflections.map((r) => r.subject)));

  const filteredReflections = reflections.filter((item) => {
    const matchesSearch =
      item.reflectionNote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject =
      selectedSubject === "all" || item.subject === selectedSubject;
    return matchesSearch && matchesSubject;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-bloom-slate-900/40 backdrop-blur-xs">
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="w-full max-w-md bg-white/95 backdrop-blur-2xl h-full shadow-2xl flex flex-col border-l border-pink-200"
        >
          {/* Drawer Header */}
          <div className="p-6 border-b border-pink-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-pink-100 text-pink-600 rounded-2xl">
                <BookMarked className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-bloom-slate-800">
                  Buku Catatan Refleksi
                </h3>
                <p className="text-xs text-bloom-slate-500">
                  Kumpulan insight 1-kalimat sebelum ujian
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-bloom-slate-400 hover:text-bloom-slate-600 rounded-full hover:bg-pink-50 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Subject Filter */}
          <div className="p-4 border-b border-pink-50 space-y-3 bg-pink-50/30">
            <div className="relative">
              <Search className="w-4 h-4 text-bloom-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari konsep, rumus, atau catatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-pink-200 rounded-xl text-xs text-bloom-slate-700 placeholder-bloom-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>

            {subjects.length > 0 && (
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => setSelectedSubject("all")}
                  className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                    selectedSubject === "all"
                      ? "bg-pink-500 text-white shadow-xs"
                      : "bg-white text-bloom-slate-600 border border-pink-100 hover:bg-pink-50"
                  }`}
                >
                  Semua ({reflections.length})
                </button>
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubject(sub)}
                    className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                      selectedSubject === sub
                        ? "bg-pink-500 text-white shadow-xs"
                        : "bg-white text-bloom-slate-600 border border-pink-100 hover:bg-pink-50"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reflection Cards List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filteredReflections.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <div className="text-4xl">🌸</div>
                <p className="text-xs font-semibold text-bloom-slate-500">
                  Belum ada catatan refleksi yang sesuai.
                </p>
                <p className="text-[11px] text-bloom-slate-400 max-w-xs mx-auto">
                  Selesaikan sesi fokus pertamamu untuk mencatat insight penting!
                </p>
              </div>
            ) : (
              filteredReflections.map((item) => (
                <div
                  key={item.id}
                  className="bg-white/90 border border-pink-100 rounded-2xl p-4 shadow-sm hover:border-pink-300 hover:shadow-kawaii-sm transition space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg bg-pink-50 text-pink-600 border border-pink-200 text-[11px] font-bold">
                      <Tag className="w-3 h-3" />
                      <span>{item.subject}</span>
                    </span>

                    <span className="text-[10px] text-bloom-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{item.durationMinutes} m</span>
                    </span>
                  </div>

                  <p className="text-xs font-medium text-bloom-slate-800 leading-relaxed bg-pink-50/20 p-2.5 rounded-xl border border-pink-100/60">
                    &ldquo;{item.reflectionNote}&rdquo;
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-bloom-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{item.completedAt}</span>
                    </span>
                    <span>
                      {item.mood === "bloom"
                        ? "🌸 Paham Banget"
                        : item.mood === "light"
                        ? "💡 Pencerahan"
                        : item.mood === "steady"
                        ? "🍵 Lumayan"
                        : "😴 Lelah"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
