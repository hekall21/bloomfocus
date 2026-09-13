"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import {
  CheckSquare,
  Clock,
  Calendar,
  AlertTriangle,
  Plus,
  Trash2,
  Edit3,
  Play,
  CheckCircle2,
  Circle,
  FolderGit2,
  FileText,
  HelpCircle,
  Flame,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  ListTodo,
  LayoutGrid,
  Sparkles,
  X,
} from "lucide-react";

export type TaskType = "pr" | "project" | "quiz" | "paper";
export type TaskPriority = "urgent" | "medium" | "low";
export type TaskStatus = "todo" | "in_progress" | "done";

export interface Subtask {
  id: string;
  text: string;
  completed: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  course: string;
  type: TaskType;
  dueDate: string; // "YYYY-MM-DD"
  dueTime: string; // "HH:MM"
  priority: TaskPriority;
  status: TaskStatus;
  estimatedPomodoros: number;
  subtasks: Subtask[];
  notes?: string;
  createdAt: string;
}

interface TaskManagerProps {
  onStartFocus?: (subjectTitle: string) => void;
}

const TYPE_META: Record<TaskType, { label: string; icon: string; badge: string }> = {
  pr: { label: "PR / Tugas Rutin", icon: "📝", badge: "bg-blue-50 text-blue-700 border-blue-200" },
  project: { label: "Proyek Besar", icon: "🚀", badge: "bg-purple-50 text-purple-700 border-purple-200" },
  quiz: { label: "Kuis / Ujian", icon: "🎯", badge: "bg-rose-50 text-rose-700 border-rose-200" },
  paper: { label: "Makalah / Laporan", icon: "📄", badge: "bg-amber-50 text-amber-700 border-amber-200" },
};

const PRIORITY_META: Record<TaskPriority, { label: string; badge: string }> = {
  urgent: { label: "Mendesak (Tinggi)", badge: "bg-rose-100 text-rose-700 border-rose-300" },
  medium: { label: "Sedang", badge: "bg-amber-100 text-amber-700 border-amber-300" },
  low: { label: "Santai", badge: "bg-emerald-100 text-emerald-700 border-emerald-300" },
};

// Default seed tasks for students
const DEFAULT_TASKS: TaskItem[] = [
  {
    id: "task-1",
    title: "PR Kalkulus: Turunan Implisit Latihan 4.2",
    course: "Kalkulus Lanjut",
    type: "pr",
    dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0], // tomorrow
    dueTime: "23:59",
    priority: "urgent",
    status: "in_progress",
    estimatedPomodoros: 2,
    subtasks: [
      { id: "st-1", text: "Kerjakan nomor 1 - 5", completed: true },
      { id: "st-2", text: "Kerjakan nomor 6 - 10", completed: false },
      { id: "st-3", text: "Foto dan compile ke PDF", completed: false },
    ],
    notes: "Tulis tangan rapi di kertas folio bergaris",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-2",
    title: "Project Akhir Web: Desain UI Dashboard & Database",
    course: "Pemrograman Web",
    type: "project",
    dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0], // 4 days later
    dueTime: "20:00",
    priority: "medium",
    status: "in_progress",
    estimatedPomodoros: 6,
    subtasks: [
      { id: "st-4", text: "Buat wireframe Figma", completed: true },
      { id: "st-5", text: "Setup schema database PostgreSQL", completed: true },
      { id: "st-6", text: "Koneksi API Next.js & Tailwind CSS", completed: false },
      { id: "st-7", text: "Testing responsivitas mobile", completed: false },
    ],
    notes: "Kelompok 4: Haikal, Rian, Dina. Link GitHub sudah siap.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-3",
    title: "Review Jurnal: Penerapan AI pada Sistem Pakar",
    course: "Kecerdasan Buatan",
    type: "paper",
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split("T")[0],
    dueTime: "18:00",
    priority: "low",
    status: "todo",
    estimatedPomodoros: 3,
    subtasks: [
      { id: "st-8", text: "Download 2 paper IEEE", completed: true },
      { id: "st-9", text: "Buat ringkasan metodologi", completed: false },
      { id: "st-10", text: "Tulis kesimpulan & daftar pustaka", completed: false },
    ],
    notes: "Minimal 4 halaman format IEEE standard",
    createdAt: new Date().toISOString(),
  },
  {
    id: "task-4",
    title: "Latihan Soal Kuis 1: Normalisasi Basis Data",
    course: "Basis Data",
    type: "quiz",
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
    dueTime: "10:00",
    priority: "urgent",
    status: "todo",
    estimatedPomodoros: 2,
    subtasks: [
      { id: "st-11", text: "Pelajari 1NF, 2NF, 3NF, BCNF", completed: false },
      { id: "st-12", text: "Kerjakan 3 studi kasus minimarket", completed: false },
    ],
    notes: "Kuis open book, tapi waktu hanya 45 menit",
    createdAt: new Date().toISOString(),
  },
];

export function TaskManager({ onStartFocus }: TaskManagerProps) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Modal Add / Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Form states
  const [formTitle, setFormTitle] = useState("");
  const [formCourse, setFormCourse] = useState("");
  const [formType, setFormType] = useState<TaskType>("pr");
  const [formDueDate, setFormDueDate] = useState("");
  const [formDueTime, setFormDueTime] = useState("23:59");
  const [formPriority, setFormPriority] = useState<TaskPriority>("medium");
  const [formStatus, setFormStatus] = useState<TaskStatus>("todo");
  const [formPomodoros, setFormPomodoros] = useState(2);
  const [formNotes, setFormNotes] = useState("");
  const [formSubtasks, setFormSubtasks] = useState<{ id: string; text: string; completed: boolean }[]>([]);
  const [newSubtaskInput, setNewSubtaskInput] = useState("");

  // Load from localStorage - Clean empty slate by default so user adds their own
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bloomfocus_tasks_projects");
      if (saved) {
        const parsed = JSON.parse(saved);
        // Clear old dummy seed if present so user has a fresh empty tasks dashboard
        if (Array.isArray(parsed) && parsed.some((t: TaskItem) => t.id === "task-1")) {
          setTasks([]);
          localStorage.setItem("bloomfocus_tasks_projects", JSON.stringify([]));
        } else {
          setTasks(parsed);
        }
      } else {
        setTasks([]);
        localStorage.setItem("bloomfocus_tasks_projects", JSON.stringify([]));
      }
    } catch {
      setTasks([]);
    }
  }, []);

  const persistTasks = (items: TaskItem[]) => {
    setTasks(items);
    try {
      localStorage.setItem("bloomfocus_tasks_projects", JSON.stringify(items));
    } catch (e) {
      console.warn("Failed to persist tasks:", e);
    }
  };

  // Helper: Calculate urgency deadline badge
  const getDeadlineBadge = (dueDate: string, dueTime: string, status: TaskStatus) => {
    if (status === "done") {
      return { text: "Selesai ✅", color: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    }

    const todayStr = new Date().toISOString().split("T")[0];
    const target = new Date(`${dueDate}T${dueTime || "23:59"}:00`).getTime();
    const now = Date.now();
    const diffHours = (target - now) / (1000 * 60 * 60);

    if (diffHours < 0) {
      return { text: "Lewat Deadline! ⚠️", color: "bg-rose-100 text-rose-700 border-rose-300 font-extrabold animate-pulse" };
    }
    if (dueDate === todayStr) {
      return { text: "Hari Ini! 🚨", color: "bg-rose-100 text-rose-700 border-rose-300 font-extrabold animate-pulse" };
    }
    if (diffHours <= 36) {
      return { text: "Besok! ⏳", color: "bg-amber-100 text-amber-700 border-amber-300 font-bold" };
    }
    const days = Math.ceil(diffHours / 24);
    return { text: `${days} hari lagi`, color: "bg-pink-50 text-pink-700 border-pink-200" };
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    soundEngine.playChime("click");
    setEditingTask(null);
    setFormTitle("");
    setFormCourse("");
    setFormType("pr");
    setFormDueDate(new Date(Date.now() + 86400000).toISOString().split("T")[0]);
    setFormDueTime("23:59");
    setFormPriority("medium");
    setFormStatus("todo");
    setFormPomodoros(2);
    setFormNotes("");
    setFormSubtasks([]);
    setNewSubtaskInput("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (task: TaskItem) => {
    soundEngine.playChime("click");
    setEditingTask(task);
    setFormTitle(task.title);
    setFormCourse(task.course);
    setFormType(task.type);
    setFormDueDate(task.dueDate);
    setFormDueTime(task.dueTime);
    setFormPriority(task.priority);
    setFormStatus(task.status);
    setFormPomodoros(task.estimatedPomodoros);
    setFormNotes(task.notes || "");
    setFormSubtasks(task.subtasks || []);
    setNewSubtaskInput("");
    setIsModalOpen(true);
  };

  // Add Subtask in Form
  const handleAddSubtask = () => {
    if (!newSubtaskInput.trim()) return;
    setFormSubtasks((prev) => [
      ...prev,
      { id: "st-" + Date.now(), text: newSubtaskInput.trim(), completed: false },
    ]);
    setNewSubtaskInput("");
  };

  // Remove Subtask in Form
  const handleRemoveSubtask = (id: string) => {
    setFormSubtasks((prev) => prev.filter((st) => st.id !== id));
  };

  // Save Form
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    soundEngine.playChime("finish");

    if (editingTask) {
      const updated = tasks.map((t) =>
        t.id === editingTask.id
          ? {
              ...t,
              title: formTitle.trim(),
              course: formCourse.trim() || "Mata Kuliah Umum",
              type: formType,
              dueDate: formDueDate,
              dueTime: formDueTime,
              priority: formPriority,
              status: formStatus,
              estimatedPomodoros: Number(formPomodoros) || 1,
              notes: formNotes.trim() || undefined,
              subtasks: formSubtasks,
            }
          : t
      );
      persistTasks(updated);
    } else {
      const newTask: TaskItem = {
        id: "task-" + Date.now(),
        title: formTitle.trim(),
        course: formCourse.trim() || "Mata Kuliah Umum",
        type: formType,
        dueDate: formDueDate,
        dueTime: formDueTime,
        priority: formPriority,
        status: formStatus,
        estimatedPomodoros: Number(formPomodoros) || 1,
        notes: formNotes.trim() || undefined,
        subtasks: formSubtasks,
        createdAt: new Date().toISOString(),
      };
      persistTasks([newTask, ...tasks]);
    }

    setIsModalOpen(false);
  };

  // Delete Task
  const handleDelete = (id: string) => {
    if (confirm("Hapus tugas ini?")) {
      soundEngine.playChime("click");
      persistTasks(tasks.filter((t) => t.id !== id));
    }
  };

  // Change Status Quick Button
  const handleUpdateStatus = (id: string, newStatus: TaskStatus) => {
    soundEngine.playChime(newStatus === "done" ? "finish" : "click");
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, status: newStatus } : t
    );
    persistTasks(updated);
  };

  // Toggle Subtask Completion in View
  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    soundEngine.playChime("boba");
    const updated = tasks.map((t) => {
      if (t.id !== taskId) return t;
      const newSubtasks = t.subtasks.map((st) =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      // Auto-update task status to done if all subtasks completed
      const allDone = newSubtasks.length > 0 && newSubtasks.every((st) => st.completed);
      return {
        ...t,
        subtasks: newSubtasks,
        status: allDone ? "done" : t.status,
      };
    });
    persistTasks(updated);
  };

  // Filter and Search logic
  const filteredTasks = tasks
    .filter((t) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return t.title.toLowerCase().includes(q) || t.course.toLowerCase().includes(q);
    })
    .filter((t) => (filterType === "all" ? true : t.type === filterType))
    .filter((t) => (filterPriority === "all" ? true : t.priority === filterPriority))
    .filter((t) => (filterStatus === "all" ? true : t.status === filterStatus))
    .sort((a, b) => {
      // Urgent status / upcoming deadlines first
      if (a.status === "done" && b.status !== "done") return 1;
      if (a.status !== "done" && b.status === "done") return -1;
      return new Date(`${a.dueDate}T${a.dueTime}`).getTime() - new Date(`${b.dueDate}T${b.dueTime}`).getTime();
    });

  // Calculate Metrics
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter((t) => t.status === "done").length;
  const inProgressTasks = tasks.filter((t) => t.status === "in_progress").length;
  const urgentTasks = tasks.filter((t) => t.priority === "urgent" && t.status !== "done").length;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Productivity Metrics */}
      <div className="bg-white/90 backdrop-blur-xl border border-pink-200/80 rounded-4xl p-6 sm:p-8 shadow-kawaii">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Pusat Manajemen Tugas &amp; Proyek</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-bloom-slate-800 tracking-tight">
              Tugas, PR &amp; Project Tracker 📝
            </h2>
            <p className="text-xs sm:text-sm text-bloom-slate-500 max-w-xl">
              Catat deadline tugas harian, PR kuliah, ujian, dan proyek kelompok dengan checklist subtasks serta estimasi waktu Pomodoro.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white text-xs font-bold rounded-2xl shadow-kawaii hover:shadow-kawaii-lg transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Tugas Baru</span>
            </button>

            {/* View Switcher: Kanban vs List */}
            <div className="flex items-center p-1 bg-pink-50 border border-pink-200 rounded-2xl">
              <button
                onClick={() => {
                  soundEngine.playChime("click");
                  setViewMode("kanban");
                }}
                className={`p-1.5 rounded-xl transition ${
                  viewMode === "kanban"
                    ? "bg-white text-pink-600 shadow-xs"
                    : "text-bloom-slate-400 hover:text-pink-600"
                }`}
                title="Tampilan Kanban Board"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  soundEngine.playChime("click");
                  setViewMode("list");
                }}
                className={`p-1.5 rounded-xl transition ${
                  viewMode === "list"
                    ? "bg-white text-pink-600 shadow-xs"
                    : "text-bloom-slate-400 hover:text-pink-600"
                }`}
                title="Tampilan Daftar List"
              >
                <ListTodo className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-pink-50/60 border border-pink-100 rounded-2xl">
            <span className="text-[11px] font-semibold text-bloom-slate-500">Total Tugas</span>
            <p className="text-xl font-black text-pink-600">
              {totalTasks} <span className="text-xs font-bold text-bloom-slate-400">item</span>
            </p>
          </div>

          <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-2xl">
            <span className="text-[11px] font-semibold text-bloom-slate-500">Sedang Dikerjakan</span>
            <p className="text-xl font-black text-amber-600">
              {inProgressTasks} <span className="text-xs font-bold text-bloom-slate-400">aktif</span>
            </p>
          </div>

          <div className="p-3 bg-rose-50/60 border border-rose-100 rounded-2xl">
            <span className="text-[11px] font-semibold text-bloom-slate-500">Mendesak / Urgent</span>
            <p className="text-xl font-black text-rose-600">
              {urgentTasks} <span className="text-xs font-bold text-bloom-slate-400">segera</span>
            </p>
          </div>

          <div className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-2xl">
            <span className="text-[11px] font-semibold text-bloom-slate-500">Tingkat Penyelesaian</span>
            <p className="text-xl font-black text-emerald-600">
              {completionRate}% <span className="text-xs font-bold text-bloom-slate-400">({doneTasks}/{totalTasks})</span>
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 border border-pink-200/80 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-bloom-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari tugas, PR, atau mata kuliah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-pink-50/50 border border-pink-200 rounded-2xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-white border border-pink-200 rounded-2xl text-bloom-slate-600 focus:outline-none focus:border-pink-400"
          >
            <option value="all">Semua Status</option>
            <option value="todo">Belum Mulai</option>
            <option value="in_progress">Sedang Dikerjakan</option>
            <option value="done">Selesai</option>
          </select>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-white border border-pink-200 rounded-2xl text-bloom-slate-600 focus:outline-none focus:border-pink-400"
          >
            <option value="all">Semua Tipe</option>
            <option value="pr">📝 PR</option>
            <option value="project">🚀 Project</option>
            <option value="quiz">🎯 Kuis / Ujian</option>
            <option value="paper">📄 Makalah / Paper</option>
          </select>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-white border border-pink-200 rounded-2xl text-bloom-slate-600 focus:outline-none focus:border-pink-400"
          >
            <option value="all">Semua Prioritas</option>
            <option value="urgent">🔴 Mendesak</option>
            <option value="medium">🟡 Sedang</option>
            <option value="low">🟢 Santai</option>
          </select>
        </div>
      </div>

      {/* Main Task Display: Kanban vs List */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white/80 border border-dashed border-pink-300 rounded-3xl p-10 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-pink-100 text-pink-500 flex items-center justify-center mx-auto text-xl">
            📝
          </div>
          <h4 className="text-sm font-bold text-bloom-slate-700">Tidak ada tugas yang cocok</h4>
          <p className="text-xs text-bloom-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau buat tugas / PR baru untuk mata kuliahmu.
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 bg-pink-500 text-white text-xs font-bold rounded-2xl hover:bg-pink-600 transition inline-flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Buat Tugas Baru</span>
          </button>
        </div>
      ) : viewMode === "kanban" ? (
        /* Kanban View (3 Columns) */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column: To-Do */}
          <KanbanColumn
            title="Belum Mulai (To-Do)"
            status="todo"
            tasks={filteredTasks.filter((t) => t.status === "todo")}
            getDeadlineBadge={getDeadlineBadge}
            onUpdateStatus={handleUpdateStatus}
            onOpenEdit={handleOpenEdit}
            onDelete={handleDelete}
            onStartFocus={onStartFocus}
            onToggleSubtask={handleToggleSubtask}
          />

          {/* Column: In Progress */}
          <KanbanColumn
            title="Sedang Dikerjakan"
            status="in_progress"
            tasks={filteredTasks.filter((t) => t.status === "in_progress")}
            getDeadlineBadge={getDeadlineBadge}
            onUpdateStatus={handleUpdateStatus}
            onOpenEdit={handleOpenEdit}
            onDelete={handleDelete}
            onStartFocus={onStartFocus}
            onToggleSubtask={handleToggleSubtask}
          />

          {/* Column: Done */}
          <KanbanColumn
            title="Selesai & Siap Kumpul"
            status="done"
            tasks={filteredTasks.filter((t) => t.status === "done")}
            getDeadlineBadge={getDeadlineBadge}
            onUpdateStatus={handleUpdateStatus}
            onOpenEdit={handleOpenEdit}
            onDelete={handleDelete}
            onStartFocus={onStartFocus}
            onToggleSubtask={handleToggleSubtask}
          />
        </div>
      ) : (
        /* List View */
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                getDeadlineBadge={getDeadlineBadge}
                onUpdateStatus={handleUpdateStatus}
                onOpenEdit={handleOpenEdit}
                onDelete={handleDelete}
                onStartFocus={onStartFocus}
                onToggleSubtask={handleToggleSubtask}
                isListView
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal Add / Edit Task */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-bloom-slate-900/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-4xl p-6 sm:p-8 shadow-kawaii-lg border border-pink-200 relative max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-pink-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
                    <CheckSquare className="w-4 h-4" />
                  </div>
                  <h3 className="text-lg font-black text-bloom-slate-800">
                    {editingTask ? "Edit Tugas / Project" : "Tambah Tugas Baru"}
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
                {/* Title */}
                <div>
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                    Judul Tugas / Project:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: PR Kalkulus Bab 4 Latihan 2"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {/* Course */}
                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Mata Kuliah / Kategori:
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Kalkulus II"
                      value={formCourse}
                      onChange={(e) => setFormCourse(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-pink-200 rounded-xl text-bloom-slate-800 focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  {/* Task Type */}
                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Tipe Tugas:
                    </label>
                    <select
                      value={formType}
                      onChange={(e) => setFormType(e.target.value as TaskType)}
                      className="w-full px-3 py-2 text-xs font-bold bg-pink-50/70 border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    >
                      <option value="pr">📝 PR / Tugas Harian</option>
                      <option value="project">🚀 Proyek Besar</option>
                      <option value="quiz">🎯 Kuis / Ujian</option>
                      <option value="paper">📄 Makalah / Laporan</option>
                    </select>
                  </div>
                </div>

                {/* Deadline & Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Tanggal Deadline:
                    </label>
                    <input
                      type="date"
                      required
                      value={formDueDate}
                      onChange={(e) => setFormDueDate(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-white border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Jam Pengumpulan:
                    </label>
                    <input
                      type="time"
                      required
                      value={formDueTime}
                      onChange={(e) => setFormDueTime(e.target.value)}
                      className="w-full px-3 py-2 text-xs font-mono font-bold bg-white border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Prioritas:
                    </label>
                    <select
                      value={formPriority}
                      onChange={(e) => setFormPriority(e.target.value as TaskPriority)}
                      className="w-full px-2.5 py-2 text-xs font-bold bg-white border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    >
                      <option value="urgent">🔴 Mendesak</option>
                      <option value="medium">🟡 Sedang</option>
                      <option value="low">🟢 Santai</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Status:
                    </label>
                    <select
                      value={formStatus}
                      onChange={(e) => setFormStatus(e.target.value as TaskStatus)}
                      className="w-full px-2.5 py-2 text-xs font-bold bg-white border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    >
                      <option value="todo">Belum Mulai</option>
                      <option value="in_progress">Dikerjakan</option>
                      <option value="done">Selesai</option>
                    </select>
                  </div>

                  {/* Estimated Pomodoros */}
                  <div>
                    <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                      Est. Pomodoro:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={formPomodoros}
                      onChange={(e) => setFormPomodoros(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-full px-2.5 py-2 text-xs text-center font-bold bg-white border border-pink-200 rounded-xl text-bloom-slate-700 focus:outline-none focus:border-pink-400"
                    />
                  </div>
                </div>

                {/* Subtasks / Checklist */}
                <div>
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1.5 flex items-center justify-between">
                    <span>Langkah Checklist / Subtasks:</span>
                    <span className="text-[10px] text-bloom-slate-400">
                      {formSubtasks.length} langkah dibuat
                    </span>
                  </label>

                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Tambah langkah pengerjaan..."
                      value={newSubtaskInput}
                      onChange={(e) => setNewSubtaskInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSubtask();
                        }
                      }}
                      className="flex-1 px-3 py-1.5 text-xs bg-pink-50/50 border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddSubtask}
                      className="px-3 py-1.5 bg-pink-100 hover:bg-pink-200 text-pink-700 text-xs font-bold rounded-xl transition"
                    >
                      + Tambah
                    </button>
                  </div>

                  {formSubtasks.length > 0 && (
                    <div className="space-y-1.5 max-h-36 overflow-y-auto p-2 bg-pink-50/30 rounded-xl border border-pink-100">
                      {formSubtasks.map((st) => (
                        <div
                          key={st.id}
                          className="flex items-center justify-between gap-2 p-1.5 bg-white rounded-lg border border-pink-100 text-xs"
                        >
                          <span className="text-bloom-slate-700">{st.text}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveSubtask(st.id)}
                            className="text-rose-400 hover:text-rose-600 p-0.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                    Catatan Khusus / Tautan:
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Format IEEE, kumpul di Google Classroom, bawa print-out..."
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
                    <span>{editingTask ? "Simpan Perubahan" : "Simpan Tugas"}</span>
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

// Kanban Column Subcomponent
function KanbanColumn({
  title,
  status,
  tasks,
  getDeadlineBadge,
  onUpdateStatus,
  onOpenEdit,
  onDelete,
  onStartFocus,
  onToggleSubtask,
}: {
  title: string;
  status: TaskStatus;
  tasks: TaskItem[];
  getDeadlineBadge: (date: string, time: string, status: TaskStatus) => { text: string; color: string };
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onOpenEdit: (task: TaskItem) => void;
  onDelete: (id: string) => void;
  onStartFocus?: (subjectTitle: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
}) {
  const columnStyles = {
    todo: "border-pink-200/70 bg-pink-50/30",
    in_progress: "border-amber-200/70 bg-amber-50/20",
    done: "border-emerald-200/70 bg-emerald-50/20",
  };

  const badgeColors = {
    todo: "bg-pink-100 text-pink-700",
    in_progress: "bg-amber-100 text-amber-700",
    done: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className={`p-4 rounded-3xl border ${columnStyles[status]} space-y-3 flex flex-col min-h-[420px]`}>
      <div className="flex items-center justify-between pb-2 border-b border-pink-100/80">
        <h3 className="text-xs font-black text-bloom-slate-700 uppercase tracking-wider">
          {title}
        </h3>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${badgeColors[status]}`}>
          {tasks.length}
        </span>
      </div>

      <div className="space-y-3 flex-1">
        {tasks.length === 0 ? (
          <div className="h-32 flex items-center justify-center text-center text-xs text-bloom-slate-400 border border-dashed border-pink-200/60 rounded-2xl p-4">
            Tidak ada tugas di kolom ini
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              getDeadlineBadge={getDeadlineBadge}
              onUpdateStatus={onUpdateStatus}
              onOpenEdit={onOpenEdit}
              onDelete={onDelete}
              onStartFocus={onStartFocus}
              onToggleSubtask={onToggleSubtask}
            />
          ))
        )}
      </div>
    </div>
  );
}

// Single Task Card Subcomponent
function TaskCard({
  task,
  getDeadlineBadge,
  onUpdateStatus,
  onOpenEdit,
  onDelete,
  onStartFocus,
  onToggleSubtask,
  isListView = false,
}: {
  task: TaskItem;
  getDeadlineBadge: (date: string, time: string, status: TaskStatus) => { text: string; color: string };
  onUpdateStatus: (id: string, newStatus: TaskStatus) => void;
  onOpenEdit: (task: TaskItem) => void;
  onDelete: (id: string) => void;
  onStartFocus?: (subjectTitle: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  isListView?: boolean;
}) {
  const typeMeta = TYPE_META[task.type] || TYPE_META.pr;
  const priorityMeta = PRIORITY_META[task.priority] || PRIORITY_META.medium;
  const deadline = getDeadlineBadge(task.dueDate, task.dueTime, task.status);

  // Subtasks calculation
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter((st) => st.completed).length || 0;
  const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`bg-white/95 backdrop-blur-md rounded-2xl p-4 border shadow-xs hover:shadow-kawaii transition-all ${
        task.status === "done"
          ? "border-emerald-200/60 opacity-80"
          : task.priority === "urgent"
          ? "border-rose-300 ring-1 ring-rose-100"
          : "border-pink-200/70"
      }`}
    >
      {/* Top badges: Type & Priority & Deadline */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 mb-2 border-b border-pink-100/50">
        <div className="flex items-center gap-1.5">
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-lg border ${typeMeta.badge}`}>
            {typeMeta.icon} {typeMeta.label}
          </span>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg border ${priorityMeta.badge}`}>
            {priorityMeta.label}
          </span>
        </div>

        <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${deadline.color}`}>
          {deadline.text}
        </span>
      </div>

      {/* Main Title & Course */}
      <div className="space-y-1">
        <h4
          className={`font-black text-xs sm:text-sm text-bloom-slate-800 leading-snug ${
            task.status === "done" ? "line-through text-bloom-slate-400" : ""
          }`}
        >
          {task.title}
        </h4>
        <div className="flex items-center gap-2 text-[11px] text-bloom-slate-500 font-semibold">
          <span className="text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded-md border border-pink-100">
            {task.course}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-pink-400" />
            <span>{task.dueDate} • {task.dueTime}</span>
          </span>
        </div>
      </div>

      {/* Subtasks checklist (if any) */}
      {totalSubtasks > 0 && (
        <div className="mt-2.5 p-2 bg-pink-50/40 rounded-xl border border-pink-100/60 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold text-bloom-slate-600">
            <span>Checklist Langkah:</span>
            <span>
              {completedSubtasks}/{totalSubtasks} ({subtaskPercent}%)
            </span>
          </div>
          {/* Progress bar */}
          <div className="w-full h-1.5 bg-pink-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-pink-400 to-rose-400 rounded-full transition-all duration-300"
              style={{ width: `${subtaskPercent}%` }}
            />
          </div>
          {/* Subtask list */}
          <div className="space-y-1 pt-1">
            {task.subtasks.map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => onToggleSubtask(task.id, st.id)}
                className="w-full flex items-center gap-1.5 text-left text-[11px] text-bloom-slate-600 hover:text-pink-600"
              >
                {st.completed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 fill-emerald-100 flex-shrink-0" />
                ) : (
                  <Circle className="w-3.5 h-3.5 text-bloom-slate-300 flex-shrink-0" />
                )}
                <span className={st.completed ? "line-through text-bloom-slate-400" : ""}>
                  {st.text}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Notes (if any) */}
      {task.notes && (
        <p className="mt-2 text-[11px] text-bloom-slate-500 bg-pink-50/20 p-1.5 rounded-lg border border-pink-100/50">
          💡 {task.notes}
        </p>
      )}

      {/* Action Bar */}
      <div className="mt-3 pt-2.5 border-t border-pink-100/60 flex items-center justify-between gap-2">
        {/* Sync Focus to Timer Button */}
        {onStartFocus ? (
          <button
            onClick={() => {
              soundEngine.playChime("start");
              onStartFocus(task.title);
            }}
            className="px-2.5 py-1 bg-pink-50 hover:bg-pink-100 text-pink-700 text-[11px] font-bold rounded-xl border border-pink-200 transition flex items-center gap-1"
            title="Kirim ke Meja Belajar Pomodoro"
          >
            <Play className="w-3 h-3 fill-pink-500 text-pink-500" />
            <span>Fokus ({task.estimatedPomodoros}x 🍅)</span>
          </button>
        ) : (
          <div />
        )}

        {/* Status Switcher & Edit/Delete Buttons */}
        <div className="flex items-center gap-1">
          {task.status !== "todo" && (
            <button
              onClick={() => onUpdateStatus(task.id, "todo")}
              className="text-[10px] font-bold text-bloom-slate-500 hover:text-pink-600 bg-pink-50 px-1.5 py-0.5 rounded"
              title="Pindah ke To-Do"
            >
              To-Do
            </button>
          )}

          {task.status !== "in_progress" && (
            <button
              onClick={() => onUpdateStatus(task.id, "in_progress")}
              className="text-[10px] font-bold text-amber-700 hover:text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded"
              title="Pindah ke In Progress"
            >
              Proses
            </button>
          )}

          {task.status !== "done" && (
            <button
              onClick={() => onUpdateStatus(task.id, "done")}
              className="text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 px-1.5 py-0.5 rounded"
              title="Tandai Selesai"
            >
              Selesai ✓
            </button>
          )}

          <button
            onClick={() => onOpenEdit(task)}
            className="p-1 text-bloom-slate-400 hover:text-pink-600 rounded"
            title="Edit Tugas"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-bloom-slate-400 hover:text-rose-600 rounded"
            title="Hapus Tugas"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
