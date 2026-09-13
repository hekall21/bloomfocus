"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  User,
  Mail,
  AlertCircle,
  HelpCircle,
  X,
  LogIn,
  ShieldAlert,
  Globe,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [activeMethod, setActiveMethod] = useState<"google" | "profile">("google");
  
  // Google direct login state
  const [googleEmail, setGoogleEmail] = useState("");
  const [googleName, setGoogleName] = useState("");
  const [isLoadingGoogleDirect, setIsLoadingGoogleDirect] = useState(false);

  // Profile login state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingGoogleOfficial, setIsLoadingGoogleOfficial] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  
  const [showGooglePublishGuide, setShowGooglePublishGuide] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Check URL query error from NextAuth/Google
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        if (err === "OAuthSignin" || err === "Configuration") {
          setOauthError(
            "Koneksi Google Cloud belum selesai atau GOOGLE_CLIENT_ID di .env masih kosong. Jika Google meminta akses / memblokir akun orang lain, silakan gunakan 'Masuk Cepat dengan Email Google' di bawah ini!"
          );
          setShowGooglePublishGuide(true);
        } else if (err === "AccessDenied") {
          setOauthError(
            "Akses ditolak oleh Google. Kemungkinan status OAuth di Google Cloud Console masih 'Testing' (Belum di-Publish). Gunakan Masuk Cepat dengan Email Google di bawah agar bisa langsung masuk!"
          );
          setShowGooglePublishGuide(true);
        } else {
          setOauthError(`Info login: (${err}). Kamu bisa masuk langsung menggunakan form di bawah.`);
        }
      }
    }
  }, []);

  // 1. Official Google OAuth Sign-In
  const handleGoogleOfficialLogin = () => {
    soundEngine.playChime("click");
    setIsLoadingGoogleOfficial(true);
    setOauthError(null);
    // Standard NextAuth Google OAuth redirect
    signIn("google", { callbackUrl: "/" });
  };

  // 2. Direct Instant Google Sign-In (Zero Cloud Blocks)
  const handleGoogleDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) return;

    soundEngine.playChime("finish");
    setIsLoadingGoogleDirect(true);

    await signIn("google-direct", {
      email: googleEmail.trim(),
      name: googleName.trim(),
      callbackUrl: "/",
    });
  };

  // 3. Custom Profile Sign-In
  const handleProfileLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    soundEngine.playChime("finish");
    setIsLoadingProfile(true);

    const userEmail = email.trim() || `${name.toLowerCase().replace(/\s+/g, "_")}@bloomfocus.local`;
    await signIn("student-account", {
      name: name.trim(),
      email: userEmail,
      callbackUrl: "/",
    });
  };

  // 4. One-Click Demo Sign-In
  const handleDemoLogin = () => {
    soundEngine.playChime("finish");
    setIsLoadingDemo(true);
    signIn("demo-student", { callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen bg-bloom-cream flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background Decorative Blur Blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-purple-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home button */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          onClick={() => soundEngine.playChime("click")}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-pink-200 text-xs font-bold text-bloom-slate-600 hover:bg-pink-50 transition shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Meja Belajar</span>
        </Link>
      </div>

      {/* Main Login Card */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-4xl p-6 sm:p-9 shadow-kawaii-lg border border-pink-200/80 text-center relative z-10"
      >
        {/* Mascot Icon */}
        <div className="mx-auto w-14 h-14 rounded-3xl bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white shadow-kawaii mb-3">
          <span className="text-2xl">🌸</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-bloom-slate-800 tracking-tight">
          Masuk ke <span className="text-pink-500">BloomFocus</span>
        </h1>
        <p className="text-xs text-bloom-slate-500 mt-1 max-w-sm mx-auto">
          Masuk dengan akun Google kamu untuk menyimpan streak taman, jadwal mandiri, dan catatan tugas.
        </p>

        {/* OAuth Notice Banner */}
        {oauthError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-left text-xs text-rose-700 space-y-1"
          >
            <div className="flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold">Info Autentikasi Google:</p>
                <p className="text-[11px] mt-0.5 text-rose-600/90 leading-relaxed">{oauthError}</p>
              </div>
              <button
                onClick={() => setOauthError(null)}
                className="text-rose-400 hover:text-rose-700 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Method Toggle Pills */}
        <div className="mt-5 p-1 bg-pink-50/70 border border-pink-200/60 rounded-2xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              soundEngine.playChime("click");
              setActiveMethod("google");
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeMethod === "google"
                ? "bg-white text-pink-600 shadow-xs"
                : "text-bloom-slate-500 hover:text-pink-500"
            }`}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Akun Google</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundEngine.playChime("click");
              setActiveMethod("profile");
            }}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeMethod === "profile"
                ? "bg-white text-pink-600 shadow-xs"
                : "text-bloom-slate-500 hover:text-pink-500"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profil Nama Sendiri</span>
          </button>
        </div>

        {/* Tab 1: Google Account Options */}
        {activeMethod === "google" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-3.5"
          >
            {/* 1. Official Google OAuth Button */}
            <button
              type="button"
              onClick={handleGoogleOfficialLogin}
              disabled={isLoadingGoogleOfficial}
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-bloom-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition flex items-center justify-center gap-3 disabled:opacity-50 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{isLoadingGoogleOfficial ? "Membuka Google..." : "Masuk dengan Popup Akun Google"}</span>
            </button>

            {/* Explanatory note & guide toggle for making Google OAuth public */}
            <div className="text-[11px] text-bloom-slate-400 flex items-center justify-center gap-1">
              <span>Google minta akses atau memblokir orang lain?</span>
              <button
                type="button"
                onClick={() => setShowGooglePublishGuide(!showGooglePublishGuide)}
                className="text-pink-600 underline font-semibold hover:text-pink-700"
              >
                {showGooglePublishGuide ? "Tutup Bantuan" : "Lihat Solusinya"}
              </button>
            </div>

            <AnimatePresence>
              {showGooglePublishGuide && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-left text-[11px] text-amber-900 space-y-1.5"
                >
                  <p className="font-bold flex items-center gap-1 text-amber-800">
                    <Globe className="w-3.5 h-3.5 text-amber-600" />
                    Cara agar SIAPA PUN bisa login dengan Google tanpa &quot;Minta Akses&quot;:
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-amber-800/90 leading-relaxed">
                    <li>Buka <strong>Google Cloud Console</strong> &rarr; <strong>OAuth consent screen</strong>.</li>
                    <li>Di bagian <strong>Publishing status</strong>, klik tombol <strong>&quot;PUBLISH APP&quot;</strong> (Publikasikan Aplikasi).</li>
                    <li>Status akan berubah dari <em>Testing</em> menjadi <em>In Production</em>.</li>
                    <li>Selesai! Google tidak akan lagi memblokir atau meminta izin akses ke developer!</li>
                  </ol>
                  <p className="text-[10px] text-amber-700 pt-1 border-t border-amber-200">
                    💡 Atau gunakan kolom <strong>Masuk Cepat dengan Email Google</strong> di bawah ini agar siapa pun bisa langsung login 100% tanpa hambatan!
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider */}
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-pink-100" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-white px-2.5 text-pink-500 font-bold">
                  Atau Masuk Cepat dengan Email Google Kamu
                </span>
              </div>
            </div>

            {/* Instant Google Email Form (Zero Blocks, Works for Any Google Account) */}
            <form onSubmit={handleGoogleDirectLogin} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                  Alamat Email Google / Gmail:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-bloom-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="nama.kamu@gmail.com"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-pink-50/40 border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400 focus:bg-white focus:ring-2 focus:ring-pink-100 transition font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                  Nama Panggilan (Opsional):
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-bloom-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Nama di akun Google-mu"
                    value={googleName}
                    onChange={(e) => setGoogleName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-pink-50/40 border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400 focus:bg-white transition font-medium"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoadingGoogleDirect || !googleEmail.trim()}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 via-rose-400 to-pink-600 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-kawaii hover:shadow-kawaii-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                <span>
                  {isLoadingGoogleDirect
                    ? "Menghubungkan Akun Google..."
                    : "Masuk dengan Akun Google Ini 🌸"}
                </span>
              </button>
            </form>
          </motion.div>
        )}

        {/* Tab 2: Custom Student Profile Form */}
        {activeMethod === "profile" && (
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleProfileLogin}
            className="mt-4 space-y-3 text-left"
          >
            <div>
              <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                Nama Lengkap / Panggilan:
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-bloom-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Haikal"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-bloom-slate-700 mb-1">
                Email Mahasiswa (Opsional):
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-bloom-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="haikal@kampus.ac.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-white border border-pink-200 rounded-xl text-bloom-slate-800 placeholder:text-bloom-slate-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoadingProfile || !name.trim()}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-kawaii hover:shadow-kawaii-lg transition flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoadingProfile ? "Menyiapkan Akun..." : "Masuk & Mulai Belajar 🌸"}</span>
            </button>
          </motion.form>
        )}

        {/* Quick 1-Click Guest & Demo Options */}
        <div className="mt-5 pt-4 border-t border-pink-100/80 space-y-2">
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoadingDemo}
            className="w-full py-2.5 px-4 bg-pink-50 hover:bg-pink-100/80 text-pink-700 font-bold text-xs rounded-2xl border border-pink-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
            <span>
              {isLoadingDemo ? "Menyiapkan Akun..." : "Masuk Cepat 1-Klik (Mode Tamu / Demo)"}
            </span>
          </button>

          <Link
            href="/"
            onClick={() => soundEngine.playChime("click")}
            className="block text-center text-xs font-semibold text-bloom-slate-400 hover:text-pink-600 py-1"
          >
            Lanjut Tanpa Login &rarr;
          </Link>
        </div>

        {/* Value Checklist */}
        <div className="mt-4 p-3 rounded-2xl bg-pink-50/40 border border-pink-100 text-left space-y-1 text-[11px] text-bloom-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Masing-masing orang punya streak dan jadwal mandiri sendiri</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Tersimpan aman di peramban dan database</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
