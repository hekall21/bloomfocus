"use client";

import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { soundEngine } from "@/lib/soundEngine";
import { BookMarked, LogIn, LogOut, Flame } from "lucide-react";

interface NavbarProps {
  onOpenNotebook?: () => void;
  currentStreak?: number;
}

export function Navbar({ onOpenNotebook, currentStreak = 0 }: NavbarProps) {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-pink-100/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => soundEngine.playChime("click")}
          className="flex items-center gap-2.5 group"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-300 flex items-center justify-center text-white shadow-kawaii group-hover:scale-105 transition-transform">
            <span className="text-xl">🌸</span>
          </div>
          <div>
            <span className="font-black text-lg tracking-tight text-bloom-slate-800 flex items-center gap-1">
              Bloom<span className="text-pink-500">Focus</span>
            </span>
            <span className="hidden sm:block text-[10px] font-semibold text-bloom-slate-400 -mt-1 tracking-wider uppercase">
              Cozy Study Space
            </span>
          </div>
        </Link>

        {/* Center/Right Nav Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick Streak Badge */}
          {currentStreak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-rose-50 border border-rose-200/70 rounded-full text-xs font-bold text-rose-600 shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>{currentStreak} Hari</span>
            </div>
          )}

          {/* Reflection Notebook Button */}
          {onOpenNotebook && (
            <button
              onClick={() => {
                soundEngine.playChime("click");
                onOpenNotebook();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 text-xs font-bold text-pink-700 transition"
              title="Buka Catatan Refleksi Belajar"
            >
              <BookMarked className="w-4 h-4" />
              <span className="hidden md:inline">Buku Refleksi</span>
            </button>
          )}

          {/* Auth State Button */}
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-pink-100 animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center gap-2 pl-2">
                {session.user?.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={session.user.image}
                    alt={session.user.name || "Avatar"}
                    className="w-8 h-8 rounded-full border border-pink-300 ring-2 ring-pink-100"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-pink-200 text-pink-700 flex items-center justify-center text-xs font-black">
                    {session.user?.name?.[0] || "🌸"}
                  </div>
                )}
                <span className="hidden sm:inline text-xs font-bold text-bloom-slate-700 max-w-[100px] truncate">
                  {session.user?.name?.split(" ")[0]}
                </span>
              </div>

              <button
                onClick={() => {
                  soundEngine.playChime("click");
                  signOut();
                }}
                className="p-2 text-bloom-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition"
                title="Keluar / Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => soundEngine.playChime("click")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-gradient-to-r from-pink-400 to-rose-400 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-bold shadow-kawaii hover:shadow-kawaii-lg transition"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
