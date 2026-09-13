# 🌸 BloomFocus — Cozy Aesthetic Study & Accountability Garden

<div align="center">

![BloomFocus Banner](https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1200&q=80)

**Ruang belajar digital yang cozy, estetik (kawaii pastel pink), dan penuh akuntabilitas untuk mahasiswa.**  
Kelola blok fokus, rawat kebun streak bunga mekar, dan simpan catatan refleksi kilat sebelum ujian!

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-6.4-2D3748?style=for-the-badge&logo=prisma)](https://prisma.io/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth-Google_OAuth-green?style=for-the-badge&logo=auth0)](https://next-auth.js.org/)
[![Deploy with Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new)

</div>

---

## ✨ Fitur Utama (Core Features)

### 1. 🐰 Maskot Belajar Interaktif — *BloomBunny*
- Maskot SVG responsif yang bereaksi secara real-time terhadap fase belajar:
  - **Fase Fokus:** Mengenakan kacamata bulat retro, menatap buku catatan yang terbuka di meja kayu pastel dengan animasi napas lembut.
  - **Fase Istirahat:** Menikmati segelas *boba milk tea* dengan sedotan pink dan senyuman rileks.
  - **Fase Selesai:** Berjingkrak gembira dengan mata berbintang dan taburan konfeti kelopak bunga.
- **Interaksi Sentuh:** Klik maskot untuk mendengar bunyi gelembung boba dan kata-kata motivasi penyemangat skripsi/kuliah.

### 2. ⏱️ Cute Focus Desk (Pomodoro & Deep Work)
- Mode terintegrasi: **Fokus (25m)**, **Istirahat Singkat (5m)**, **Rehat Panjang (15m)**.
- Durasi waktu fleksibel yang dapat disesuaikan per menit.
- Pemilih subjek/mata kuliah praktis (*Kalkulus, Algoritma, Basis Data, Skripsi, dll.*).
- *Breathing pulse animation* pada angka timer yang membantu ritme fokus.

### 3. 🌷 Taman Bunga Akuntabilitas (Streak Garden)
- Menggantikan grid *heatmap* kode konvensional dengan padang bunga pastel yang hidup.
- Setiap sesi fokus yang tuntas menumbuhkan sekuntum bunga (Tulip, Sakura, atau Krisan).
- Statistik kumulatif: **Streak Aktif**, **Total Bunga Mekar**, **Jam Belajar**, dan **Rekor Terbaik**.
- **Fitur Streak Freeze (1x/minggu):** Perlindungan es kristal untuk hari-hari sibuk rapat UKM, kepanitiaan, atau kondisi sakit.

### 4. 📖 Micro-Reflection & Buku Catatan Ujian
- Setiap timer selesai, muncul modal refleksi elegan: *"1 hal terpenting yang dipahami di sesi ini?"*
- Dilengkapi selektor emosi/mood belajar (🌸 Paham Banget, 💡 Pencerahan, 🍵 Lumayan, 😴 Lelah).
- **Slide-over Reflection Drawer:** Kumpulan catatan 1-kalimat yang dapat dicari dan difilter per subjek untuk bahan *review* kilat 10 menit sebelum masuk ruang ujian!

### 5. 🎧 Built-In Procedural Lo-Fi & Ambient Sound Engine
- Player audio mengambang (*floating pill*) yang didukung oleh **Web Audio API**:
  - 🌧️ **Hujan di Jendela:** Rintik hujan menenangkan (procedural pink noise).
  - ☕ **Warm Cafe Ambience:** Suasana kedai kopi hangat untuk konsentrasi.
  - 🎵 **Lo-Fi Harmonik:** Nada akord tape-warble binaural yang lembut.
- Dilengkapi slider volume independen, tombol mute, dan animasi gelombang suara. **100% offline-ready tanpa risiko link audio rusak!**

---

## 🏗️ Tech Stack Architecture

| Layer | Teknologi |
|---|---|
| **Framework** | Next.js 14+ (App Router, Server Components & Dynamic API Routes) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Tailwind CSS kustom (Pastel Cream `#FFF9FA`, Strawberry Pink `#FDA4AF`, Matcha `#DCFCE7`, Soft Lavender `#E9D5FF`) |
| **Animations** | Framer Motion + Canvas Confetti |
| **Audio Engine** | Web Audio API Synthesizer (Native procedural sound synthesis) |
| **Database & ORM** | Prisma ORM dengan PostgreSQL (Kompatibel dengan Neon.tech, Supabase, RDS) |
| **Authentication** | NextAuth.js (Google OAuth 2.0 + Instant Frictionless Demo Mode) |
| **Deployment** | Vercel (Zero-error build configuration) |

---

## 🚀 Panduan Menjalankan Secara Lokal (Quick Start)

### 1. Clone & Install Dependensi
```bash
git clone https://github.com/hekall21/bloomfocus.git
cd bloomfocus
npm install
```

### 2. Konfigurasi File Environment
Salin template `.env.example` menjadi `.env`:
```bash
cp .env.example .env
```

Isi variabel environment:
```env
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="bloomfocus_super_secret_kawaii_key_at_least_32_characters_long_2026"

# Opsional untuk Demo Mode lokal, Wajib untuk Login Akun Google Pribadi
GOOGLE_CLIENT_ID="xxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="xxxx"

# Database PostgreSQL (Gunakan Neon.tech gratis)
DATABASE_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/bloomfocus?sslmode=require"
```

### 3. Generate Prisma Client & Push Skema ke Database
```bash
npm run postinstall
npm run db:push
```

### 4. Jalankan Development Server
```bash
npm run dev
```
Buka browser di [http://localhost:3000](http://localhost:3000).  
*(Catatan: Anda dapat langsung mengklik tombol **"Coba Demo Langsung"** di halaman login untuk mencoba seluruh fitur seketika tanpa konfigurasi Google OAuth!)*

---

## 🔑 Panduan Setup Google Cloud Console (OAuth 2.0)

Untuk mengaktifkan login resmi Google:

1. Buka [Google Cloud Console](https://console.cloud.google.com/).
2. Buat proyek baru bernama **"BloomFocus"**.
3. Masuk ke menu **APIs & Services** > **OAuth consent screen**:
   - Pilih **External**.
   - Isi App Name: `BloomFocus`, User Support Email, dan Developer Email.
4. Masuk ke menu **Credentials** > **Create Credentials** > **OAuth client ID**:
   - Application type: **Web application**.
   - Name: `BloomFocus Web Client`.
   - **Authorized JavaScript origins:**
     - `http://localhost:3000` (untuk dev)
     - `https://your-domain.vercel.app` (domain Vercel Anda)
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/callback/google`
     - `https://your-domain.vercel.app/api/auth/callback/google`
5. Salin **Client ID** dan **Client Secret**, lalu masukkan ke environment variable di file `.env` dan di dashboard Vercel.

---

## 🐘 Setup Database PostgreSQL Gratis (Neon.tech)

1. Buat akun gratis di [Neon.tech](https://neon.tech).
2. Buat project baru (misal: `bloomfocus-db`).
3. Salin connection string PostgreSQL yang diberikan:
   ```text
   postgresql://username:password@ep-flower-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. Tempelkan string tersebut ke `DATABASE_URL` di Vercel dan lokal `.env`.
5. Sinkronkan struktur tabel dengan perintah:
   ```bash
   npx prisma db push
   ```

---

## ☁️ Panduan Deploy ke Vercel (Zero Build Errors)

Repository ini telah dirancang khusus dengan konfigurasi *Zero-Error Deployment*:
- Script `build` otomatis menjalankan `prisma generate && next build`.
- Semua route API memiliki `export const dynamic = "force-dynamic"`.
- Mode fallback *graceful handling* mencegah error 500 saat database baru diinisialisasi.

### Langkah Deploy:
1. Masuk ke [Vercel Dashboard](https://vercel.com).
2. Klik **Add New Project** > **Import Git Repository** > Pilih `hekall21/bloomfocus`.
3. Pada bagian **Environment Variables**, tambahkan:
   - `NEXTAUTH_URL`: URL domain Vercel Anda (misal: `https://bloomfocus.vercel.app`)
   - `NEXTAUTH_SECRET`: String acak aman (32 karakter+)
   - `DATABASE_URL`: Connection string PostgreSQL Neon/Supabase Anda
   - `GOOGLE_CLIENT_ID`: ID OAuth Google Anda
   - `GOOGLE_CLIENT_SECRET`: Secret OAuth Google Anda
4. Klik **Deploy**! Aplikasi akan selesai dibuild dalam waktu ~1 menit tanpa kendala.

---

## 📂 Struktur Direktori Proyek

```
bloomfocus/
├── prisma/
│   └── schema.prisma              # Skema User, StudySession, StreakRecord, NextAuth
├── public/                        # Aset favicon & icon
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/[...nextauth]/# NextAuth handler endpoint
│   │   │   ├── freeze/            # Streak freeze toggle endpoint
│   │   │   ├── garden/            # 28-day streak heatmap calculation
│   │   │   └── sessions/          # Study sessions & reflection notes CRUD
│   │   ├── login/                 # Cozy pastel auth page
│   │   ├── globals.css            # Kawaii design tokens & custom scrollbars
│   │   ├── layout.tsx             # Root layout & SessionProvider wrapper
│   │   └── page.tsx               # Main Study Hub & Flower Garden dashboard
│   ├── components/
│   │   ├── audio/
│   │   │   └── AmbientPlayer.tsx  # Floating Lo-Fi & procedural sound dock
│   │   ├── garden/
│   │   │   └── FlowerGarden.tsx   # 28-day blooming pasture & stat cards
│   │   ├── layout/
│   │   │   └── Navbar.tsx         # Top bar with streak indicator & triggers
│   │   ├── mascot/
│   │   │   └── BloomMascot.tsx    # Reactive SVG companion with 3 states
│   │   ├── providers/
│   │   │   └── AuthProvider.tsx   # NextAuth Client Session wrapper
│   │   ├── reflections/
│   │   │   └── ReflectionLogDrawer.tsx # Slide-over pre-exam study notes
│   │   └── timer/
│   │       ├── CuteFocusTimer.tsx # Pomodoro timer desk with live settings
│   │       └── ReflectionModal.tsx# Post-session celebration & insight modal
│   └── lib/
│       ├── auth.ts                # NextAuth options (Google + Demo student)
│       ├── prisma.ts              # Prisma singleton client
│       ├── soundEngine.ts         # Web Audio API procedural sound engine
│       └── utils.ts               # Date & classname utility helpers
├── tailwind.config.ts             # Custom kawaii pastel color system
└── package.json                   # Dependencies & postinstall build hooks
```

---

<div align="center">
  <b>BloomFocus — Tumbuhkan masa depanmu, satu kelopak demi satu kelopak 🌸</b>
</div>
