"use client";

import React, { useState } from "react";
import { soundEngine } from "@/lib/soundEngine";
import { CloudRain, Coffee, Music, Volume2, VolumeX, ChevronUp, ChevronDown, Play, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type SoundMode = "rain" | "cafe" | "lofi";

interface SoundTrack {
  id: SoundMode;
  name: string;
  icon: typeof CloudRain;
  color: string;
  desc: string;
}

const TRACKS: SoundTrack[] = [
  {
    id: "rain",
    name: "Hujan di Jendela",
    icon: CloudRain,
    color: "text-blue-500 bg-blue-50 border-blue-200",
    desc: "Suara rintik hujan lembut menenangkan pikiran",
  },
  {
    id: "cafe",
    name: "Warm Cafe Ambience",
    icon: Coffee,
    color: "text-amber-600 bg-amber-50 border-amber-200",
    desc: "Suasana hangat kedai kopi cozy untuk konsentrasi",
  },
  {
    id: "lofi",
    name: "Lo-Fi Harmonik",
    icon: Music,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    desc: "Akord nada lembut binaural pengantar fokus",
  },
];

export function AmbientPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<SoundMode | null>(null);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleTrack = (id: SoundMode) => {
    soundEngine.playChime("click");
    if (activeTrack === id) {
      soundEngine.stopAmbient();
      setActiveTrack(null);
    } else {
      soundEngine.startAmbient(id);
      setActiveTrack(id);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    soundEngine.setVolume(val);
  };

  const handleToggleMute = () => {
    soundEngine.playChime("click");
    const muted = soundEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 select-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="mb-3 w-80 bg-white/95 backdrop-blur-xl rounded-3xl p-5 shadow-kawaii-lg border border-pink-200/80"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-pink-100">
              <div className="flex items-center gap-2">
                <span className="text-lg">🎧</span>
                <h4 className="text-sm font-bold text-bloom-slate-800">
                  Ambient & Lo-Fi Sound
                </h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-bloom-slate-400 hover:text-bloom-slate-600 p-1 rounded-full hover:bg-pink-50 transition"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Sound Selection Grid */}
            <div className="mt-3 space-y-2">
              {TRACKS.map((track) => {
                const Icon = track.icon;
                const isPlaying = activeTrack === track.id;

                return (
                  <button
                    key={track.id}
                    onClick={() => handleToggleTrack(track.id)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-2xl border transition-all text-left ${
                      isPlaying
                        ? "bg-pink-50/90 border-pink-300 shadow-sm"
                        : "bg-white/60 border-pink-100/60 hover:bg-pink-50/50 hover:border-pink-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl border ${track.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-bloom-slate-700">
                          {track.name}
                        </p>
                        <p className="text-[10px] text-bloom-slate-500 line-clamp-1">
                          {track.desc}
                        </p>
                      </div>
                    </div>

                    <div className="pr-1">
                      {isPlaying ? (
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-3.5 bg-pink-500 rounded-full animate-pulse" />
                          <span className="w-1.5 h-5 bg-pink-400 rounded-full animate-pulse delay-75" />
                          <span className="w-1.5 h-2 bg-pink-500 rounded-full animate-pulse delay-150" />
                          <Square className="w-3.5 h-3.5 ml-1 text-pink-600 fill-pink-600" />
                        </div>
                      ) : (
                        <Play className="w-3.5 h-3.5 text-bloom-slate-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Volume Control */}
            <div className="mt-4 pt-3 border-t border-pink-100 flex items-center gap-3">
              <button
                onClick={handleToggleMute}
                className="text-pink-500 hover:text-pink-600 p-1.5 rounded-xl hover:bg-pink-50 transition"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-bloom-slate-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
              <span className="text-[10px] font-semibold text-bloom-slate-500 w-8 text-right">
                {isMuted ? "0%" : `${Math.round(volume * 100)}%`}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Floating Pill */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-4 py-2.5 bg-white/95 backdrop-blur-xl border border-pink-200/90 rounded-full shadow-kawaii text-xs font-bold text-bloom-slate-700 hover:bg-pink-50/50 hover:border-pink-300 transition"
      >
        <span className="relative flex h-2.5 w-2.5">
          {activeTrack ? (
            <>
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-pink-500"></span>
            </>
          ) : (
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-gray-300"></span>
          )}
        </span>

        <span className="flex items-center gap-1.5">
          <Music className="w-3.5 h-3.5 text-pink-500" />
          <span>{activeTrack ? "Lo-Fi Active" : "Ambient Sounds"}</span>
        </span>

        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-bloom-slate-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-bloom-slate-400" />
        )}
      </motion.button>
    </div>
  );
}
