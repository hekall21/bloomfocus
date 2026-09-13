import Link from "next/link";
import { Sparkles, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bloom-cream flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-pink-100 flex items-center justify-center text-4xl shadow-kawaii mb-4">
        🌸
      </div>
      <h2 className="text-3xl font-black text-bloom-slate-800 tracking-tight">
        Halaman Tidak Ditemukan
      </h2>
      <p className="text-xs sm:text-sm text-bloom-slate-500 mt-2 max-w-sm">
        Ups, sepertinya halaman yang kamu cari sedang beristirahat atau pindah ke taman lain.
      </p>
      <Link
        href="/"
        className="mt-6 flex items-center gap-2 px-6 py-2.5 bg-pink-500 hover:bg-pink-600 text-white font-bold text-xs rounded-2xl shadow-kawaii transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Ruang Fokus</span>
      </Link>
    </div>
  );
}
