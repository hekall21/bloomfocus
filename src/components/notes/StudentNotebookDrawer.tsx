"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import {
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Search,
  Pin,
  X,
  Copy,
  Check,
  Calendar,
  Tag,
  Sparkles,
} from "lucide-react";

export type NoteColor = "pink" | "mint" | "lavender" | "peach" | "sky";

export interface StudyNote {
  id: string;
  title: string;
  course: string;
  content: string;
  color: NoteColor;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

interface StudentNotebookDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCourse?: string;
}

const COLOR_STYLES: Record<
  NoteColor,
  { card: string; badge: string; accent: string; label: string }
> = {
  pink: {
    card: "bg-pink-50/90 border-pink-200/90 text-pink-950",
    badge: "bg-pink-100 text-pink-700 border-pink-200",
    accent: "bg-pink-400",
    label: "Sakura Pink",
  },
  mint: {
    card: "bg-emerald-50/90 border-emerald-200/90 text-emerald-950",
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    accent: "bg-emerald-400",
    label: "Fresh Mint",
  },
  lavender: {
    card: "bg-purple-50/90 border-purple-200/90 text-purple-950",
    badge: "bg-purple-100 text-purple-700 border-purple-200",
    accent: "bg-purple-400",
    label: "Soft Lavender",
  },
  peach: {
    card: "bg-amber-50/90 border-amber-200/90 text-amber-950",
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    accent: "bg-amber-400",
    label: "Warm Peach",
  },
  sky: {
    card: "bg-sky-50/90 border-sky-200/90 text-sky-950",
    badge: "bg-sky-100 text-sky-700 border-sky-200",
    accent: "bg-sky-400",
    label: "Cloud Sky",
  },
};

const DEFAULT_NOTES: StudyNote[] = [
  {
    id: "note-1",
    title: "Rumus Cepat Integral Parsial & Substitusi",
    course: "Kalkulus Lanjut",
    content:
      "Rumus dasar integral parsial: ∫ u dv = u·v - ∫ v du.\n\nTips memilih 'u': Gunakan aturan LIATE:\n1. Logaritma (ln)\n2. Invers trigonometri\n3. Aljabar (x², 3x)\n4. Trigonometri (sin, cos)\n5. Eksponensial (eˣ)\n\nJangan lupa konstanta integrasi + C di akhir!",
    color: "pink",
    isPinned: true,
    createdAt: new Date(Date.now() - 86400000).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "note-2",
    title: "Rangkuman Teori Binary Search Tree (BST)",
    course: "Algoritma & Pemrograman",
    content:
      "Karakteristik pohon BST:\n- Nilai child kiri < nilai parent node\n- Nilai child kanan > nilai parent node\n- Kompleksitas rata-rata pencarian: O(log n)\n- Kasus terburuk (skewed tree): O(n)\n\nUntuk menjaga seimbang, gunakan AVL Tree atau Red-Black Tree.",
    color: "mint",
    isPinned: false,
    createdAt: new Date(Date.now() - 172800000).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "note-3",
    title: "Tahapan Normalisasi Basis Data 1NF s/d 3NF",
    course: "Basis Data",
    content:
      "1NF (First Normal Form): Tidak ada multivalued attributes / baris yang berulang.\n2NF: Sudah 1NF + tidak ada dependensi parsial (semua atribut bergantung penuh pada primary key).\n3NF: Sudah 2NF + tidak ada dependensi transitif (A -> B -> C).",
    color: "lavender",
    isPinned: false,
    createdAt: new Date(Date.now() - 259200000).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }),
    updatedAt: new Date().toISOString(),
  },
];

export function StudentNotebookDrawer({
  isOpen,
  onClose,
  defaultCourse = "",
}: StudentNotebookDrawerProps) {
  const [notes, setNotes] = useState<StudyNote[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("all");

  // Form View State
  const [isCreatingOrEditing, setIsCreatingOrEditing] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [formContent, setFormContent] = useState("");
  const [formColor, setFormColor] = useState<NoteColor>("pink");
  const [formIsPinned, setFormIsPinned] = useState(false);

  // Copy feedback
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);

  // Load notes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bloomfocus_student_notes");
      if (saved) {
        setNotes(JSON.parse(saved));
      } else {
        setNotes(DEFAULT_NOTES);
        localStorage.setItem("bloomfocus_student_notes", JSON.stringify(DEFAULT_NOTES));
      }
    } catch {
      setNotes(DEFAULT_NOTES);
    }
  }, []);

  const persistNotes = (items: StudyNote[]) => {
    setNotes(items);
    try {
      localStorage.setItem("bloomfocus_student_notes", JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist notes:", e);
    }
  };

  // Open Form to Add Note
  const handleOpenAdd = () => {
    soundEngine.playChime("click");
    setEditingNoteId(null);
    setFormTitle("");
    setFormCourse(defaultCourse || "");
    setFormContent("");
    setFormColor("pink");
    setFormIsPinned(false);
    setIsCreatingOrEditing(true);
  };

  // Open Form to Edit Note
  const handleOpenEdit = (note: StudyNote) => {
    soundEngine.playChime("click");
    setEditingNoteId(note.id);
    setFormTitle(note.title);
    setFormCourse(note.course);
    setFormContent(note.content);
    setFormColor(note.color);
    setFormIsPinned(note.isPinned);
    setIsCreatingOrEditing(true);
  };

  // Save Note (Add or Update)
  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    soundEngine.playChime("finish");

    const nowStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });

    if (editingNoteId) {
      const updated = notes.map((n) =>
        n.id === editingNoteId
          ? {
              ...n,
              title: formTitle.trim(),
              course: formCourse.trim() || "Umum",
              content: formContent.trim(),
              color: formColor,
              isPinned: formIsPinned,
              updatedAt: new Date().toISOString(),
            }
          : n
      );
      persistNotes(updated);
    } else {
      const newNote: StudyNote = {
        id: "note-" + Date.now(),
        title: formTitle.trim(),
        course: formCourse.trim() || "Umum",
        content: formContent.trim(),
        color: formColor,
        isPinned: formIsPinned,
        createdAt: nowStr,
        updatedAt: new Date().toISOString(),
      };
      persistNotes([newNote, ...notes]);
    }

    setIsCreatingOrEditing(false);
  };

  // Delete Note
  const handleDeleteNote = (id: string) => {
    if (confirm("Hapus catatan ini dari buku catatan?")) {
      soundEngine.playChime("click");
      const updated = notes.filter((n) => n.id !== id);
      persistNotes(updated);
    }
  };

  // Toggle Pin
  const handleTogglePin = (id: string) => {
    soundEngine.playChime("boba");
    const updated = notes.map((n) =>
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    );
    persistNotes(updated);
  };

  // Copy Note Content
  const handleCopyNote = (note: StudyNote) => {
    soundEngine.playChime("click");
    navigator.clipboard.writeText(`${note.title}\n[${note.course}]\n\n${note.content}`);
    setCopiedNoteId(note.id);
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  // Unique list of courses for filter chips
  const courses = Array.from(new Set(notes.map((n) => n.course))).filter(Boolean);

  // Filtered & Sorted Notes (Pinned notes first, then latest)
  const filteredNotes = notes
    .filter((n) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.course.toLowerCase().includes(q)
      );
    })
    .filter((n) => (selectedCourseFilter === "all" ? true : n.course === selectedCourseFilter))
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
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
          className="w-full max-w-lg bg-white/95 backdrop-blur-2xl h-full shadow-2xl flex flex-col border-l border-pink-200"
        >
          {/* Header */}
          <div className="p-5 border-b border-pink-100 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 bg-gradient-to-tr from-pink-400 to-rose-300 text-white rounded-2xl shadow-kawaii">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-black text-bloom-slate-800">
                  Buku Catatan Belajar 📖
                </h3>
                <p className="text-xs text-bloom-slate-500">
                  Tulis, simpan rumus, dan rangkum materi kuliahmu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {!isCreatingOrEditing && (
                <button
                  onClick={handleOpenAdd}
                  className="px-3 py-1.5 bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Catatan</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="p-1.5 text-bloom-slate-400 hover:text-bloom-slate-600 rounded-xl hover:bg-pink-50 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Form Create / Edit View */}
          {isCreatingOrEditing ? (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSaveNote}
              className="p-5 flex-1 flex flex-col justify-between overflow-y-auto space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-black text-bloom-slate-800">
                    {editingNoteId ? "Edit Catatan" : "Buat Catatan Kuliah Baru"}
                  </h4>
                  <button
                    type="button"
                    onClick={() => setIsCreatingOrEditing(false)}
                    className="text-xs text-bloom-slate-400 hover:text-pink-600"
                  >
                    Batal
                  </button>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                    Judul Catatan:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Rumus Turunan & Integral Parsial"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-pink-50/40 border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400 focus:bg-white"
                  />
                </div>

                {/* Course Tag */}
                <div>
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                    Mata Kuliah / Kategori:
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Kalkulus Lanjut / Algoritma"
                    value={formCourse}
                    onChange={(e) => setFormCourse(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs bg-pink-50/40 border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400 focus:bg-white"
                  />
                </div>

                {/* Color Palette Selector */}
                <div>
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                    Pilihan Warna Kertas Catatan:
                  </label>
                  <div className="flex items-center gap-2">
                    {(Object.keys(COLOR_STYLES) as NoteColor[]).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setFormColor(c)}
                        className={`w-7 h-7 rounded-xl border-2 transition-all flex items-center justify-center ${
                          COLOR_STYLES[c].accent
                        } ${
                          formColor === c
                            ? "border-bloom-slate-800 scale-110 shadow-xs"
                            : "border-transparent opacity-75 hover:opacity-100"
                        }`}
                        title={COLOR_STYLES[c].label}
                      >
                        {formColor === c && <Check className="w-3.5 h-3.5 text-white" />}
                      </button>
                    ))}
                    <span className="text-[11px] text-bloom-slate-500 ml-1">
                      {COLOR_STYLES[formColor].label}
                    </span>
                  </div>
                </div>

                {/* Note Content */}
                <div className="flex-1">
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                    Isi Catatan:
                  </label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Tuliskan rangkuman, rumus, poin penting dosen, atau insight belajar di sini..."
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    className="w-full p-3.5 text-xs bg-pink-50/30 border border-pink-200 rounded-2xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400 focus:bg-white font-mono leading-relaxed resize-none"
                  />
                </div>

                {/* Pin toggle */}
                <label className="flex items-center gap-2 text-xs font-bold text-bloom-slate-700 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={formIsPinned}
                    onChange={(e) => setFormIsPinned(e.target.checked)}
                    className="rounded text-pink-500 focus:ring-pink-300"
                  />
                  <span>Sematkan catatan ini di paling atas (Pin)</span>
                </label>
              </div>

              <div className="pt-3 border-t border-pink-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingOrEditing(false)}
                  className="px-4 py-2 text-xs font-bold text-bloom-slate-500 hover:bg-pink-50 rounded-xl transition"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-bold rounded-xl shadow-kawaii transition"
                >
                  {editingNoteId ? "Simpan Perubahan" : "Simpan Catatan"}
                </button>
              </div>
            </motion.form>
          ) : (
            /* Notes List View */
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Search & Course Filter */}
              <div className="p-4 border-b border-pink-100 space-y-2.5 bg-pink-50/30">
                <div className="relative">
                  <Search className="w-4 h-4 text-bloom-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari konsep, rumus, atau catatan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2 bg-white border border-pink-200 rounded-xl text-xs text-bloom-slate-700 placeholder-bloom-slate-400 focus:outline-none focus:border-pink-400"
                  />
                </div>

                {courses.length > 0 && (
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => setSelectedCourseFilter("all")}
                      className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                        selectedCourseFilter === "all"
                          ? "bg-pink-500 text-white shadow-xs"
                          : "bg-white text-bloom-slate-600 border border-pink-100 hover:bg-pink-50"
                      }`}
                    >
                      Semua ({notes.length})
                    </button>
                    {courses.map((course) => (
                      <button
                        key={course}
                        onClick={() => setSelectedCourseFilter(course)}
                        className={`px-3 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap transition ${
                          selectedCourseFilter === course
                            ? "bg-pink-500 text-white shadow-xs"
                            : "bg-white text-bloom-slate-600 border border-pink-100 hover:bg-pink-50"
                        }`}
                      >
                        {course}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Notes Cards Container */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {filteredNotes.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center text-center p-6 border border-dashed border-pink-200 rounded-3xl bg-pink-50/20">
                    <span className="text-3xl mb-2">📝</span>
                    <h4 className="text-sm font-bold text-bloom-slate-700">Belum ada catatan</h4>
                    <p className="text-xs text-bloom-slate-400 mt-1 max-w-xs">
                      Klik tombol &quot;Tambah Catatan&quot; di atas untuk mencatat rumus, materi kuliah, atau rangkuman ujian.
                    </p>
                    <button
                      onClick={handleOpenAdd}
                      className="mt-3 px-3.5 py-1.5 bg-pink-500 text-white text-xs font-bold rounded-xl hover:bg-pink-600 transition"
                    >
                      + Buat Catatan Pertama
                    </button>
                  </div>
                ) : (
                  <AnimatePresence>
                    {filteredNotes.map((note) => {
                      const colorStyle = COLOR_STYLES[note.color] || COLOR_STYLES.pink;
                      return (
                        <motion.div
                          key={note.id}
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className={`p-4 rounded-3xl border shadow-xs transition-all hover:shadow-kawaii relative ${colorStyle.card}`}
                        >
                          {/* Top Row: Course badge, Pin, Actions */}
                          <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-black/5">
                            <div className="flex items-center gap-1.5">
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border ${colorStyle.badge}`}>
                                {note.course}
                              </span>
                              {note.isPinned && (
                                <span className="text-[10px] font-black text-pink-600 flex items-center gap-0.5 bg-pink-100/70 px-1.5 py-0.5 rounded-md">
                                  <Pin className="w-3 h-3 fill-pink-500" />
                                  <span>Pinned</span>
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1">
                              {/* Pin Toggle */}
                              <button
                                onClick={() => handleTogglePin(note.id)}
                                className={`p-1 rounded-lg transition ${
                                  note.isPinned
                                    ? "text-pink-600 hover:bg-pink-100"
                                    : "text-bloom-slate-400 hover:text-pink-600 hover:bg-white/60"
                                }`}
                                title={note.isPinned ? "Lepas Pin" : "Sematkan di Atas"}
                              >
                                <Pin className={`w-3.5 h-3.5 ${note.isPinned ? "fill-pink-500" : ""}`} />
                              </button>

                              {/* Copy Content */}
                              <button
                                onClick={() => handleCopyNote(note)}
                                className="p-1 text-bloom-slate-400 hover:text-bloom-slate-700 hover:bg-white/60 rounded-lg transition"
                                title="Salin Catatan"
                              >
                                {copiedNoteId === note.id ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEdit(note)}
                                className="p-1 text-bloom-slate-400 hover:text-pink-600 hover:bg-white/60 rounded-lg transition"
                                title="Edit Catatan"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteNote(note.id)}
                                className="p-1 text-bloom-slate-400 hover:text-rose-600 hover:bg-white/60 rounded-lg transition"
                                title="Hapus Catatan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Title */}
                          <h4 className="font-black text-sm text-bloom-slate-800 leading-snug">
                            {note.title}
                          </h4>

                          {/* Content text */}
                          <p className="mt-2 text-xs text-bloom-slate-700 whitespace-pre-line leading-relaxed font-sans">
                            {note.content}
                          </p>

                          {/* Date footer */}
                          <div className="mt-3 pt-2 border-t border-black/5 flex items-center justify-between text-[10px] text-bloom-slate-400">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{note.createdAt}</span>
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
