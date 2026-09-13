import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

export const metadata: Metadata = {
  title: "BloomFocus 🌸 | Cozy Cute Productivity & Study Garden",
  description:
    "A cozy, cute-pastel-pink productivity & study accountability app for university students to manage study blocks, maintain streaks, and focus deeply.",
  keywords: [
    "pomodoro",
    "study timer",
    "cute productivity app",
    "kawaii study app",
    "streak garden",
    "bloom focus",
    "university study",
  ],
  authors: [{ name: "BloomFocus Team" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFF9FA",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-bloom-cream text-bloom-slate-700 selection:bg-pink-200 selection:text-pink-900 font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
