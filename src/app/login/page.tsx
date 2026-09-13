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
} from "lucide-react";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const [activeMethod, setActiveMethod] = useState<"profile" | "google">("profile");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);
  const [showGoogleHelp, setShowGoogleHelp] = useState(false);
  const [oauthError, setOauthError] = useState<string | null>(null);

  // Check URL query error
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err) {
        if (err === "OAuthSignin" || err === "Configuration") {
          setOauthError(
            "Google OAuth belum terhubung. Client ID di file .env masih kosong atau belum aktif di Google Cloud Console. Silakan login menggunakan Profil Mahasiswa di bawah!"
          );
        } else {
          setOauthError(`Gagal masuk (${err}). Silakan coba login dengan Nama & Email di bawah.`);
        }
      }
    }
  }, []);

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

  const handleGoogleLogin = async () => {
    soundEngine.playChime("click");
    setIsLoadingGoogle(true);
    setOauthError(null);
    try {
      const res = await signIn("google", { callbackUrl: "/", redirect: false });
      if (res?.error) {
        setOauthError(
          "Google OAuth belum dapat diakses karena GOOGLE_CLIENT_ID di .env belum diisi. Kamu bisa langsung login menggunakan Profil Mahasiswa di tab sebelah!"
        );
        setShowGoogleHelp(true);
        setIsLoadingGoogle(false);
      }
    } catch {
      setOauthError(
        "Koneksi Google OAuth gagal. Silakan gunakan Login Profil Mahasiswa."
      );
      setIsLoadingGoogle(false);
    }
  };

  const handleDemoLogin = () => {
    soundEngine.playChime("finish");
    setIsLoadingDemo(true);
    signIn("demo-student", { callbackUrl: "/" });
  };

  const avatarUrl = name.trim()
    ? `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name.trim())}`
    : "https://api.dicebear.com/7.x/bottts/svg?seed=bloom-bunny";

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
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-pink-200 text-xs font-bold text-bloom-slate-600 hover:bg-pink-50 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
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
          Ruang belajar cozy untuk mahasiswa fokus, menumbuhkan streak, dan mengatur jadwal tugas.
        </p>

        {/* OAuth Error Banner if triggered */}
        {oauthError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl text-left text-xs text-rose-700 flex items-start gap-2.5"
          >
            <AlertCircle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold">Info Login Google:</p>
              <p className="text-[11px] mt-0.5 text-rose-600/90 leading-relaxed">{oauthError}</p>
            </div>
            <button
              onClick={() => setOauthError(null)}
              className="text-rose-400 hover:text-rose-700 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Method Toggle Pills */}
        <div className="mt-5 p-1 bg-pink-50/70 border border-pink-200/60 rounded-2xl flex items-center gap-1">
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
            <span>Profil Sendiri</span>
          </button>

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
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
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
            <span>Google OAuth</span>
          </button>
        </div>

        {/* Tab 1: Profile Login Form */}
        {activeMethod === "profile" && (
          <motion.form
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onSubmit={handleProfileLogin}
            className="mt-4 space-y-3.5 text-left"
          >
            <div className="flex items-center gap-3 p-3 bg-pink-50/50 border border-pink-100 rounded-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-11 h-11 rounded-2xl bg-white border border-pink-200 p-0.5 shadow-xs flex-shrink-0"
              />
              <div className="text-xs">
                <p className="font-bold text-bloom-slate-700">
                  {name.trim() || "Nama Mahasiswa"}
                </p>
                <p className="text-[11px] text-bloom-slate-400">
                  Avatar otomatis disesuaikan dengan namamu ✨
                </p>
              </div>
            </div>

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

        {/* Tab 2: Google OAuth */}
        {activeMethod === "google" && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 space-y-3"
          >
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-left text-xs text-amber-800 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Konfigurasi Google OAuth:
                </span>
                <button
                  type="button"
                  onClick={() => setShowGoogleHelp(!showGoogleHelp)}
                  className="text-[11px] text-amber-700 underline font-semibold hover:text-amber-900"
                >
                  {showGoogleHelp ? "Tutup Panduan" : "Lihat Cara Setup"}
                </button>
              </div>
              <p className="text-[11px] text-amber-700 leading-relaxed">
                Login Google membutuhkan <code>GOOGLE_CLIENT_ID</code> dan <code>GOOGLE_CLIENT_SECRET</code> di file <code>.env</code>.
                Jika belum diisi, silakan gunakan tab <strong>&apos;Profil Sendiri&apos;</strong> untuk login langsung tanpa konfigurasi API Google!
              </p>
            </div>

            <AnimatePresence>
              {showGoogleHelp && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-3 bg-white border border-pink-200 rounded-2xl text-left text-[11px] text-bloom-slate-600 space-y-1.5"
                >
                  <p className="font-bold text-bloom-slate-800">Langkah menghubungkan Google:</p>
                  <ol className="list-decimal list-inside space-y-1 text-bloom-slate-500">
                    <li>Buka Google Cloud Console &rarr; OAuth 2.0 Credentials.</li>
                    <li>
                      Tambahkan Authorized Redirect URI:{" "}
                      <code className="bg-pink-50 px-1 rounded text-pink-600">
                        http://localhost:3000/api/auth/callback/google
                      </code>
                    </li>
                    <li>
                      Isi <code>GOOGLE_CLIENT_ID</code> &amp; <code>GOOGLE_CLIENT_SECRET</code> di file <code>.env</code>.
                    </li>
                  </ol>
                </motion.div>
              )}
            </AnimatePresence>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoadingGoogle}
              className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-bloom-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition flex items-center justify-center gap-3 disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
              <span>{isLoadingGoogle ? "Menghubungkan ke Google..." : "Masuk dengan Akun Google"}</span>
            </button>
          </motion.div>
        )}

        {/* Divider */}
        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-pink-100" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-white px-2 text-bloom-slate-400 font-bold">atau</span>
          </div>
        </div>

        {/* Frictionless One-Click Demo Mode Button */}
        <button
          onClick={handleDemoLogin}
          disabled={isLoadingDemo}
          className="w-full py-2.5 px-4 bg-pink-50 hover:bg-pink-100/80 text-pink-700 font-bold text-xs rounded-2xl border border-pink-200 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 fill-pink-400 text-pink-400" />
          <span>
            {isLoadingDemo ? "Menyiapkan Akun Demo..." : "Coba Mode Tamu / Demo Sakura (1-Klik)"}
          </span>
        </button>

        {/* Perks Checklist */}
        <div className="mt-5 p-3.5 rounded-2xl bg-pink-50/40 border border-pink-100 text-left space-y-1.5 text-[11px] text-bloom-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Jadwal Mandiri (Senin - Minggu) tersimpan rapi</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Manajemen Tugas, PR & Proyek dengan countdown deadline</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
            <span>Taman Bunga Akuntabilitas (Streak) & Maskot BloomBunny</span>
          </div>
        </div>

        <p className="mt-5 text-[10px] text-bloom-slate-400">
          BloomFocus menjamin keamanan &amp; kenyamanan belajarmu. Data tersimpan rapi dan siap menemani kuliahmu.
        </p>
      </motion.div>
    </div>
  );
}
