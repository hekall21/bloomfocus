"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import {
  Calendar,
  Clock,
  MapPin,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  Circle,
  Sparkles,
  Play,
  RotateCcw,
  Tag,
  AlertCircle,
  X,
} from "lucide-react";

export type DayOfWeek = "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | "Sabtu" | "Minggu";

export type ScheduleCategory = "kuliah" | "tugas" | "mandiri" | "organisasi" | "istirahat";

export interface ScheduleItem {
  id: string;
  day: DayOfWeek;
  startTime: string; // "08:00"
  endTime: string;   // "09:40"
  title: string;
  category: ScheduleCategory;
  location?: string;
  notes?: string;
  isDone?: boolean;
}

interface TimetableScheduleProps {
  onStartFocus?: (subjectTitle: string) => void;
}

const DAYS_LIST: DayOfWeek[] = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"];

const CATEGORY_META: Record<
  ScheduleCategory,
  { label: string; color: string; badge: string; icon: string }
> = {
  kuliah: {
    label: "Kuliah",
    color: "bg-pink-50 border-pink-200 text-pink-700",
    badge: "bg-pink-100/90 text-pink-700 border border-pink-200",
    icon: "🎓",
  },
  tugas: {
    label: "Tugas & PR",
    color: "bg-amber-50 border-amber-200 text-amber-800",
    badge: "bg-amber-100/90 text-amber-700 border border-amber-200",
    icon: "📚",
  },
  mandiri: {
    label: "Belajar Mandiri",
    color: "bg-emerald-50 border-emerald-200 text-emerald-800",
    badge: "bg-emerald-100/90 text-emerald-700 border border-emerald-200",
    icon: "💡",
  },
  organisasi: {
    label: "Organisasi & Rapat",
    color: "bg-purple-50 border-purple-200 text-purple-800",
    badge: "bg-purple-100/90 text-purple-700 border border-purple-200",
    icon: "👥",
  },
  istirahat: {
    label: "Istirahat & Hobi",
    color: "bg-rose-50 border-rose-200 text-rose-800",
    badge: "bg-rose-100/90 text-rose-700 border border-rose-200",
    icon: "☕",
  },
};

const DEFAULT_SCHEDULES: ScheduleItem[] = [
  {
    id: "sch-1",
    day: "Senin",
    startTime: "08:00",
    endTime: "09:40",
    title: "Algoritma & Struktur Data",
    category: "kuliah",
    location: "Gedung B - Lab Komputer 2",
    notes: "Materi Binary Search Tree & bawa laptop",
    isDone: false,
  },
  {
    id: "sch-2",
    day: "Senin",
    startTime: "10:15",
    endTime: "11:55",
    title: "Kalkulus Lanjut Bab 4",
    category: "kuliah",
    location: "Ruang 304",
    notes: "Pengumpulan lembar kerja turunan parsial",
    isDone: false,
  },
  {
    id: "sch-3",
    day: "Senin",
    startTime: "13:30",
    endTime: "15:00",
    title: "Mengerjakan PR Kalkulus",
    category: "tugas",
    location: "Perpustakaan Lt. 2",
    notes: "Latihan 4.1 sampai 4.5 dengan referensi buku Thomas",
    isDone: false,
  },
  {
    id: "sch-4",
    day: "Selasa",
    startTime: "09:00",
    endTime: "11:30",
    title: "Basis Data & SQL Query",
    category: "kuliah",
    location: "Lab Komputer 1",
    notes: "Praktikum normalisasi dan relasi foreign key",
    isDone: false,
  },
  {
    id: "sch-5",
    day: "Selasa",
    startTime: "14:00",
    endTime: "15:30",
    title: "Review Modul Praktikum Web",
    category: "mandiri",
    location: "Kost / Rumah",
    notes: "Eksplorasi Tailwind CSS dan Next.js",
    isDone: false,
  },
  {
    id: "sch-6",
    day: "Rabu",
    startTime: "08:30",
    endTime: "10:30",
    title: "Sistem Informasi Manajemen",
    category: "kuliah",
    location: "Ruang 201",
    notes: "Presentasi studi kasus ERP",
    isDone: false,
  },
  {
    id: "sch-7",
    day: "Kamis",
    startTime: "10:00",
    endTime: "12:00",
    title: "Pemrograman Web & Mobile",
    category: "kuliah",
    location: "Lab Multimedia",
    notes: "Progress project toko online",
    isDone: false,
  },
  {
    id: "sch-8",
    day: "Jumat",
    startTime: "13:30",
    endTime: "15:00",
    title: "Rapat Divisi BEM / UKM",
    category: "organisasi",
    location: "Student Center Lt. 1",
    notes: "Koordinasi acara Dies Natalis",
    isDone: false,
  },
  {
    id: "sch-9",
    day: "Sabtu",
    startTime: "09:00",
    endTime: "11:00",
    title: "Belajar Mandiri & Cicil Skripsi",
    category: "mandiri",
    location: "Kafe Literasi",
    notes: "Membaca 3 jurnal terindeks Scopus",
    isDone: false,
  },
];

export function TimetableSchedule({ onStartFocus }: TimetableScheduleProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<DayOfWeek | "Semua">("Semua");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>("all");

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Form Fields
  const [formDay, setFormDay] = useState<DayOfWeek>("Senin");
  const [formStartTime, setFormStartTime] = useState("08:00");
  const [formEndTime, setFormEndTime] = useState("09:40");
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<ScheduleCategory>("kuliah");
  const [formLocation, setFormLocation] = useState("");
  const [formNotes, setFormNotes] = useState("");

  // Determine today's day in Indonesian
  const getTodayDayName = (): DayOfWeek => {
    const dayIndex = new Date().getDay(); // 0 = Minggu, 1 = Senin, ...
    const map: DayOfWeek[] = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    return map[dayIndex];
  };

  const todayName = getTodayDayName();

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bloomfocus_timetable_schedule");
      if (saved) {
        setSchedules(JSON.parse(saved));
      } else {
        setSchedules(DEFAULT_SCHEDULES);
        localStorage.setItem("bloomfocus_timetable_schedule", JSON.stringify(DEFAULT_SCHEDULES));
      }
    } catch {
      setSchedules(DEFAULT_SCHEDULES);
    }
  }, []);

  // Save to localStorage helper
  const persistSchedules = (items: ScheduleItem[]) => {
    setSchedules(items);
    try {
      localStorage.setItem("bloomfocus_timetable_schedule", JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist timetable:", e);
    }
  };

  // Open Modal for Add
  const handleOpenAdd = (defaultDay?: DayOfWeek) => {
    soundEngine.playChime("click");
    setEditingItem(null);
    setFormDay(defaultDay || (selectedDay === "Semua" ? todayName : selectedDay));
    setFormStartTime("08:00");
    setFormEndTime("09:40");
    setFormTitle("");
    setFormCategory("kuliah");
    setFormLocation("");
    setFormNotes("");
    setIsModalOpen(true);
  };

  // Open Modal for Edit
  const handleOpenEdit = (item: ScheduleItem) => {
    soundEngine.playChime("click");
    setEditingItem(item);
    setFormDay(item.day);
    setFormStartTime(item.startTime);
    setFormEndTime(item.endTime);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormLocation(item.location || "");
    setFormNotes(item.notes || "");
    setIsModalOpen(true);
  };

  // Save Form (Create or Update)
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    soundEngine.playChime("finish");

    if (editingItem) {
      const updated = schedules.map((item) =>
        item.id === editingItem.id
          ? {
              ...item,
              day: formDay,
              startTime: formStartTime,
              endTime: formEndTime,
              title: formTitle.trim(),
              category: formCategory,
              location: formLocation.trim() || undefined,
              notes: formNotes.trim() || undefined,
            }
          : item
      );
      persistSchedules(updated);
    } else {
      const newItem: ScheduleItem = {
        id: "sch-" + Date.now(),
        day: formDay,
        startTime: formStartTime,
        endTime: formEndTime,
        title: formTitle.trim(),
        category: formCategory,
        location: formLocation.trim() || undefined,
        notes: formNotes.trim() || undefined,
        isDone: false,
      };
      persistSchedules([...schedules, newItem]);
    }

    setIsModalOpen(false);
  };

  // Delete Item
  const handleDelete = (id: string) => {
    if (confirm("Hapus jadwal ini?")) {
      soundEngine.playChime("click");
      const updated = schedules.filter((item) => item.id !== id);
      persistSchedules(updated);
    }
  };

  // Toggle Done Checkbox
  const handleToggleDone = (id: string) => {
    soundEngine.playChime("boba");
    const updated = schedules.map((item) =>
      item.id === id ? { ...item, isDone: !item.isDone } : item
    );
    persistSchedules(updated);
  };

  // Reset to default
  const handleResetDefault = () => {
    if (confirm("Kembalikan contoh jadwal kuliah default?")) {
      soundEngine.playChime("click");
      persistSchedules(DEFAULT_SCHEDULES);
    }
  };

  // Clear all
  const handleClearAll = () => {
    if (confirm("Kosongkan seluruh jadwal Anda?")) {
      soundEngine.playChime("click");
      persistSchedules([]);
    }
  };

  // Filtered list
  const filteredSchedules = schedules
    .filter((item) => (selectedDay === "Semua" ? true : item.day === selectedDay))
    .filter((item) =>
      selectedCategoryFilter === "all" ? true : item.category === selectedCategoryFilter
    )
    .sort((a, b) => {
      // Sort primarily by day order, then by startTime
      const dayOrder = DAYS_LIST.indexOf(a.day) - DAYS_LIST.indexOf(b.day);
      if (dayOrder !== 0) return dayOrder;
      return a.startTime.localeCompare(b.startTime);
    });

  // Calculate stats
  const totalItems = schedules.length;
  const todayItems = schedules.filter((s) => s.day === todayName);
  const doneToday = todayItems.filter((s) => s.isDone).length;

  return (
    <div className="space-y-6">
      {/* Header & Quick Stats */}
      <div className="bg-white/90 backdrop-blur-xl border border-pink-200/80 rounded-4xl p-6 sm:p-8 shadow-kawaii">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Hari Ini: {todayName}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-bloom-slate-800 tracking-tight">
              Jadwal Mandiri &amp; Kuliah 📅
            </h2>
            <p className="text-xs sm:text-sm text-bloom-slate-500 max-w-xl">
              Atur agenda perkuliahan, jam belajar, dan kegiatan harianmu dari Senin hingga Minggu.
              Isi manual sesuai kebutuhanmu!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={() => handleOpenAdd()}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-bold rounded-2xl shadow-kawaii hover:shadow-kawaii-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Jadwal Baru</span>
            </button>

            <button
              onClick={handleResetDefault}
              className="p-2.5 text-bloom-slate-400 hover:text-bloom-slate-700 bg-pink-50/70 hover:bg-pink-100/70 rounded-2xl border border-pink-200/80 transition"
              title="Kembalikan Contoh Jadwal Default"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handleClearAll}
              className="p-2.5 text-bloom-slate-400 hover:text-rose-600 bg-pink-50/70 hover:bg-rose-50 rounded-2xl border border-pink-200/80 transition"
              title="Kosongkan Semua Jadwal"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Day Status Banner */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-pink-50/60 border border-pink-100 rounded-2xl">
            <span className="text-[11px] font-semibold text-bloom-slate-500">Agenda Hari Ini</span>
            <p className="text-xl font-black text-pink-600">
              {todayItems.length} <span className="text-xs font-bold text-bloom-slate-400">jadwal</span>
            </p>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
            <span className="text-[11px] font-semibold text-bloom-slate-500">Selesai Hari Ini</span>
            <p className="text-xl font-black text-emerald-600">
              {doneToday} <span className="text-xs font-bold text-bloom-slate-400">/ {todayItems.length}</span>
            </p>
          </div>

          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-2xl">
            <span className="text-[11px] font-semibold text-bloom-slate-500">Total Sepekan</span>
            <p className="text-xl font-black text-purple-600">
              {totalItems} <span className="text-xs font-bold text-bloom-slate-400">kegiatan</span>
            </p>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-2xl">
            <span className="text-[11px] font-semibold text-bloom-slate-500">Kategori Aktif</span>
            <p className="text-xl font-black text-amber-600">
              5 <span className="text-xs font-bold text-bloom-slate-400">tipe</span>
            </p>
          </div>
        </div>
      </div>

      {/* Day Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
        <button
          onClick={() => {
            soundEngine.playChime("click");
            setSelectedDay("Semua");
          }}
          className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 ${
            selectedDay === "Semua"
              ? "bg-pink-500 text-white shadow-xs"
              : "bg-white/80 text-bloom-slate-600 border border-pink-200/80 hover:bg-pink-50"
          }`}
        >
          <span>Semua Hari</span>
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/20">
            {schedules.length}
          </span>
        </button>

        {DAYS_LIST.map((day) => {
          const count = schedules.filter((s) => s.day === day).length;
          const isToday = day === todayName;
          return (
            <button
              key={day}
              onClick={() => {
                soundEngine.playChime("click");
                setSelectedDay(day);
              }}
              className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition flex items-center gap-1.5 flex-shrink-0 relative ${
                selectedDay === day
                  ? "bg-pink-500 text-white shadow-xs"
                  : isToday
                  ? "bg-rose-100/90 text-rose-700 border border-rose-300 font-extrabold"
                  : "bg-white/80 text-bloom-slate-600 border border-pink-200/80 hover:bg-pink-50"
              }`}
            >
              <span>{day}</span>
              {isToday && <span className="text-[9px] font-black uppercase tracking-wider text-rose-600 bg-white/70 px-1 py-0.2 rounded">Hari Ini</span>}
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedDay === day ? "bg-white/20 text-white" : "bg-pink-100 text-pink-700"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category Pills Filter */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-bold text-bloom-slate-400">Filter Kategori:</span>
        <button
          onClick={() => setSelectedCategoryFilter("all")}
          className={`px-2.5 py-1 text-xs rounded-xl font-bold transition ${
            selectedCategoryFilter === "all"
              ? "bg-bloom-slate-700 text-white"
              : "bg-white text-bloom-slate-600 border border-pink-200/60 hover:bg-pink-50"
          }`}
        >
          Semua
        </button>
        {Object.entries(CATEGORY_META).map(([key, meta]) => (
          <button
            key={key}
            onClick={() => setSelectedCategoryFilter(key)}
            className={`px-2.5 py-1 text-xs rounded-xl font-bold transition flex items-center gap-1 ${
              selectedCategoryFilter === key
                ? "bg-pink-500 text-white shadow-xs"
                : "bg-white text-bloom-slate-600 border border-pink-200/60 hover:bg-pink-50"
            }`}
          >
            <span>{meta.icon}</span>
            <span>{meta.label}</span>
          </button>
        ))}
      </div>

      {/* Schedule Items List */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white/80 border border-dashed border-pink-300 rounded-3xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mx-auto text-xl">
            📅
          </div>
          <h4 className="text-sm font-bold text-bloom-slate-700">
            Belum ada jadwal untuk {selectedDay === "Semua" ? "filter ini" : `hari ${selectedDay}`}
          </h4>
          <p className="text-xs text-bloom-slate-400 max-w-sm mx-auto">
            Kamu bisa mulai menambahkan mata kuliah, waktu belajar mandiri, atau kegiatan lainnya!
          </p>
          <button
            onClick={() => handleOpenAdd(selectedDay === "Semua" ? undefined : selectedDay)}
            className="px-4 py-2 bg-pink-500 text-white text-xs font-bold rounded-2xl hover:bg-pink-600 transition inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tambah Jadwal Sekarang</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredSchedules.map((item) => {
              const meta = CATEGORY_META[item.category] || CATEGORY_META.kuliah;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`bg-white/95 backdrop-blur-md rounded-3xl p-5 border shadow-kawaii-sm transition-all hover:shadow-kawaii relative flex flex-col justify-between ${
                    item.isDone
                      ? "border-emerald-200/70 bg-emerald-50/20"
                      : "border-pink-200/80"
                  }`}
                >
                  <div>
                    {/* Header Row: Day & Time & Category Badge */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-pink-100/60">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg bg-pink-100/80 text-pink-700 text-xs font-extrabold">
                          {item.day}
                        </span>
                        <div className="flex items-center gap-1 text-xs font-bold text-bloom-slate-600 font-mono">
                          <Clock className="w-3.5 h-3.5 text-pink-400" />
                          <span>
                            {item.startTime} - {item.endTime}
                          </span>
                        </div>
                      </div>

                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-lg flex items-center gap-1 ${meta.badge}`}>
                        <span>{meta.icon}</span>
                        <span>{meta.label}</span>
                      </span>
                    </div>

                    {/* Content Title */}
                    <div className="flex items-start gap-2.5">
                      <button
                        onClick={() => handleToggleDone(item.id)}
                        className="mt-0.5 text-bloom-slate-400 hover:text-emerald-600 transition flex-shrink-0"
                        title={item.isDone ? "Tandai Belum Selesai" : "Tandai Selesai"}
                      >
                        {item.isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                        ) : (
                          <Circle className="w-5 h-5 hover:text-pink-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h3
                          className={`font-black text-sm sm:text-base leading-snug text-bloom-slate-800 ${
                            item.isDone ? "line-through text-bloom-slate-400" : ""
                          }`}
                        >
                          {item.title}
                        </h3>

                        {item.location && (
                          <div className="flex items-center gap-1.5 mt-1.5 text-xs text-bloom-slate-500 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                            <span className="truncate">{item.location}</span>
                          </div>
                        )}

                        {item.notes && (
                          <p className="mt-2 text-xs text-bloom-slate-500/90 bg-pink-50/50 p-2 rounded-xl border border-pink-100/60 leading-relaxed">
                            {item.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-pink-100/60">
                    {/* 1-Click Sync to Timer */}
                    {onStartFocus ? (
                      <button
                        onClick={() => {
                          soundEngine.playChime("start");
                          onStartFocus(item.title);
                        }}
                        className="px-3 py-1.5 bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-bold rounded-xl border border-pink-200 transition flex items-center gap-1.5 shadow-xs hover:shadow-sm"
                        title="Jadikan Target Belajar di Timer"
                      >
                        <Play className="w-3.5 h-3.5 fill-pink-600 text-pink-600" />
                        <span>Mulai Fokus</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(item)}
                        className="p-1.5 text-bloom-slate-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition"
                        title="Edit Jadwal"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-bloom-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="Hapus Jadwal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Modal Add / Edit Schedule */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bloom-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-4xl p-6 sm:p-8 shadow-kawaii-lg border border-pink-200 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-bloom-slate-800">
                    {editingItem ? "Edit Jadwal" : "Tambah Jadwal Baru"}
                  </h3>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-bloom-slate-400 hover:text-bloom-slate-700 rounded-xl hover:bg-pink-50 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveForm} className="mt-4 space-y-4 text-left">
                <div className="grid grid-cols-2 gap-3">
                  {/* Day Picker */}
                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Hari:
                    </label>
                    <select
                      value={formDay}
                      onChange={(e) => setFormDay(e.target.value as DayOfWeek)}
                      className="w-full px-3 py-2 text-xs font-bold bg-pink-50/70 border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    >
                      {DAYS_LIST.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Picker */}
                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Kategori:
                    </label>
                    <select
                      value={formCategory}
                      onChange={(e) => setFormCategory(e.target.value as ScheduleCategory)}
                      className="w-full px-3 py-2 text-xs font-bold bg-pink-50/70 border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    >
                      {Object.entries(CATEGORY_META).map(([key, meta]) => (
                        <option key={key} value={key}>
                          {meta.icon} {meta.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Time Range */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Jam Mulai:
                    </label>
                    <input
                      type="time"
                      required
                      value={formStartTime}
                      onChange={(e) => setFormStartTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Jam Selesai:
                    </label>
                    <input
                      type="time"
                      required
                      value={formEndTime}
                      onChange={(e) => setFormEndTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                    Nama Kegiatan / Mata Kuliah:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Algoritma & Pemrograman Lanjutan"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                {/* Location */}
                <div>
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                    Ruang / Lokasi / Link (Opsional):
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Lab Komputer 2 atau Google Meet"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                    Catatan Khusus / Agenda:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Bawa tugas bab 3 yang sudah diprint, laptop baterai penuh..."
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-white border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-pink-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-xs font-bold text-bloom-slate-500 hover:bg-pink-50 rounded-xl transition"
                  >
                    Batal
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-kawaii transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingItem ? "Simpan Perubahan" : "Tambahkan ke Jadwal"}</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
