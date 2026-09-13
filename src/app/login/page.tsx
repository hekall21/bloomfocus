"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { motion } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [isLoadingDemo, setIsLoadingDemo] = useState(false);

  const handleGoogleLogin = () => {
    soundEngine.playChime("click");
    setIsLoadingGoogle(true);
    signIn("google", { callbackUrl: "/" });
  };

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
      <div className="absolute top-6 left-6">
        <Link
          href="/"
          onClick={() => soundEngine.playChime("click")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-white/80 border border-pink-200 text-xs font-bold text-bloom-slate-600 hover:bg-pink-50 transition"
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
        className="w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-4xl p-8 sm:p-10 shadow-kawaii-lg border border-pink-200/80 text-center relative z-10"
      >
        {/* Mascot Icon */}
        <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white shadow-kawaii mb-4">
          <span className="text-3xl">🌸</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-bloom-slate-800 tracking-tight">
          Selamat Datang di <span className="text-pink-500">BloomFocus</span>
        </h1>
        <p className="text-xs sm:text-sm text-bloom-slate-500 mt-2">
          Ruang belajar cozy untuk mahasiswa menjaga fokus, menumbuhkan taman streak, dan menaklukkan ujian.
        </p>

        {/* Perks Checklist */}
        <div className="my-6 p-4 rounded-2xl bg-pink-50/60 border border-pink-100 text-left space-y-2 text-xs text-bloom-slate-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Taman Bunga Akuntabilitas (Streak Garden)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Mascot BloomBunny interaktif yang menemani belajar</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Buku Refleksi 1-kalimat tersimpan permanen</span>
          </div>
        </div>

        {/* Auth Action Buttons */}
        <div className="space-y-3">
          {/* One-Click Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoadingGoogle}
            className="w-full py-3.5 px-4 bg-white hover:bg-gray-50 text-bloom-slate-700 font-bold text-xs sm:text-sm rounded-2xl border border-gray-300 shadow-sm hover:shadow-md transition flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {/* Google SVG Icon */}
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
            <span>{isLoadingGoogle ? "Menghubungkan..." : "Masuk dengan Google"}</span>
          </button>

          {/* Frictionless One-Click Demo Mode Button */}
          <button
            onClick={handleDemoLogin}
            disabled={isLoadingDemo}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm rounded-2xl shadow-kawaii hover:shadow-kawaii-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 fill-white" />
            <span>
              {isLoadingDemo ? "Menyiapkan Akun Demo..." : "Coba Demo Langsung (1-Klik Tanpa Login)"}
            </span>
          </button>
        </div>

        <p className="mt-6 text-[11px] text-bloom-slate-400">
          Dengan masuk, kamu menyetujui ruang belajar ramah privasi BloomFocus. Data streak & catatan refleksi tersimpan dengan aman.
        </p>
      </motion.div>
    </div>
  );
}
