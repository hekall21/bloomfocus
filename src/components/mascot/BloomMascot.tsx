"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundEngine } from "@/lib/soundEngine";
import { Sparkles, Heart } from "lucide-react";

export type MascotState = "studying" | "break" | "celebrate";

interface BloomMascotProps {
  state: MascotState;
  subject?: string;
  isPaused?: boolean;
}

const MOTIVATIONS = [
  "Kamu pasti bisa! Semangat belajarnya yaa~ 🌸",
  "Satu halaman demi satu halaman, kamu hebat! 📚",
  "Jangan lupa teguk air putih dulu yaa! 🍵",
  "Fokus yuk, ujian semester bakal kita taklukin! ✨",
  "BloomBunny bangga banget sama usaha kamu hari ini! 🐰💖",
];

export function BloomMascot({ state, subject, isPaused = false }: BloomMascotProps) {
  const [speech, setSpeech] = useState<string | null>(null);
  const [isWiggling, setIsWiggling] = useState(false);

  const handleClickMascot = () => {
    soundEngine.playChime("boba");
    setIsWiggling(true);
    const randomQuote = MOTIVATIONS[Math.floor(Math.random() * MOTIVATIONS.length)];
    setSpeech(randomQuote);

    setTimeout(() => {
      setIsWiggling(false);
    }, 800);

    setTimeout(() => {
      setSpeech(null);
    }, 4500);
  };

  return (
    <div className="relative flex flex-col items-center select-none">
      {/* Motivational Speech Bubble */}
      <AnimatePresence>
        {speech && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.9 }}
            className="absolute -top-16 z-20 px-4 py-2 bg-white/95 backdrop-blur-md rounded-2xl shadow-kawaii border border-pink-200 text-xs font-medium text-bloom-slate-700 max-w-[240px] text-center"
          >
            <span>{speech}</span>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-b border-r border-pink-200 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Sparkles & Hearts */}
      <motion.div
        animate={{
          y: [-2, -8, -2],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -top-4 -right-2 text-pink-400 pointer-events-none"
      >
        <Sparkles className="w-5 h-5 drop-shadow-sm" />
      </motion.div>

      {state === "break" && (
        <motion.div
          animate={{
            y: [-1, -12, -1],
            opacity: [0.3, 0.9, 0.3],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-6 -left-3 text-purple-400 pointer-events-none"
        >
          <Heart className="w-4 h-4 fill-purple-300" />
        </motion.div>
      )}

      {/* Interactive Mascot Body Container */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClickMascot}
        animate={
          isWiggling
            ? { rotate: [-8, 8, -6, 6, 0] }
            : state === "studying" && !isPaused
            ? { y: [0, -4, 0] }
            : state === "celebrate"
            ? { y: [0, -12, 0], scale: [1, 1.06, 1] }
            : { y: [0, -2, 0] }
        }
        transition={{
          duration: state === "celebrate" ? 0.6 : 3,
          repeat: isWiggling ? 0 : Infinity,
          ease: "easeInOut",
        }}
        className="cursor-pointer relative w-48 h-48 flex items-center justify-center filter drop-shadow-md"
        title="Klik BloomBunny untuk sapaan hangat!"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Shadow underneath */}
          <ellipse
            cx="100"
            cy="175"
            rx="55"
            ry="10"
            fill="#FDA4AF"
            fillOpacity="0.28"
          />

          {/* Bunny Left Ear */}
          <motion.g
            animate={
              state === "studying"
                ? { rotate: [-2, 2, -2] }
                : { rotate: [-4, 3, -4] }
            }
            transition={{ duration: 2, repeat: Infinity }}
            style={{ transformOrigin: "70px 75px" }}
          >
            <path
              d="M60 85 C45 35, 65 15, 75 18 C85 22, 85 55, 75 85 Z"
              fill="#FFF0F3"
              stroke="#F472B6"
              strokeWidth="3.5"
            />
            <path
              d="M65 72 C56 42, 68 28, 73 30 C78 32, 78 52, 72 72 Z"
              fill="#FBCFE8"
            />
          </motion.g>

          {/* Bunny Right Ear */}
          <motion.g
            animate={
              state === "studying"
                ? { rotate: [2, -2, 2] }
                : { rotate: [3, -4, 3] }
            }
            transition={{ duration: 2.2, repeat: Infinity }}
            style={{ transformOrigin: "130px 75px" }}
          >
            <path
              d="M140 85 C155 35, 135 15, 125 18 C115 22, 115 55, 125 85 Z"
              fill="#FFF0F3"
              stroke="#F472B6"
              strokeWidth="3.5"
            />
            <path
              d="M135 72 C144 42, 132 28, 127 30 C122 32, 122 52, 128 72 Z"
              fill="#FBCFE8"
            />
          </motion.g>

          {/* Flower Hair Accessory on Ear */}
          <g transform="translate(125, 45)">
            <circle cx="0" cy="0" r="5" fill="#FEF08A" stroke="#F59E0B" strokeWidth="1.5" />
            <circle cx="-6" cy="0" r="4" fill="#F472B6" />
            <circle cx="6" cy="0" r="4" fill="#F472B6" />
            <circle cx="0" cy="-6" r="4" fill="#F472B6" />
            <circle cx="0" cy="6" r="4" fill="#F472B6" />
          </g>

          {/* Bunny Body */}
          <ellipse
            cx="100"
            cy="135"
            rx="48"
            ry="40"
            fill="#FFF5F7"
            stroke="#F472B6"
            strokeWidth="3.5"
          />

          {/* Bunny Head */}
          <ellipse
            cx="100"
            cy="95"
            rx="45"
            ry="38"
            fill="#FFFDFD"
            stroke="#F472B6"
            strokeWidth="3.5"
          />

          {/* Rosy Cheeks */}
          <ellipse cx="70" cy="108" rx="8" ry="4.5" fill="#FDA4AF" fillOpacity="0.7" />
          <ellipse cx="130" cy="108" rx="8" ry="4.5" fill="#FDA4AF" fillOpacity="0.7" />

          {/* Bunny Nose & Mouth */}
          <polygon points="97,102 103,102 100,105" fill="#FB7185" />
          <path
            d="M96 106 Q100 110 100 106 Q100 110 104 106"
            stroke="#FB7185"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Eyes State Switch */}
          {state === "studying" ? (
            /* Studying Eyes: Looking down attentively with glasses */
            <g>
              {/* Glasses Frame */}
              <circle
                cx="78"
                cy="98"
                r="13"
                fill="rgba(255, 255, 255, 0.4)"
                stroke="#D97706"
                strokeWidth="2.5"
              />
              <circle
                cx="122"
                cy="98"
                r="13"
                fill="rgba(255, 255, 255, 0.4)"
                stroke="#D97706"
                strokeWidth="2.5"
              />
              <line
                x1="91"
                y1="98"
                x2="109"
                y2="98"
                stroke="#D97706"
                strokeWidth="2.5"
              />

              {/* Pupils focusing down at book */}
              <circle cx="79" cy="101" r="4" fill="#374151" />
              <circle cx="78" cy="99.5" r="1.5" fill="#FFFFFF" />
              <circle cx="121" cy="101" r="4" fill="#374151" />
              <circle cx="120" cy="99.5" r="1.5" fill="#FFFFFF" />
            </g>
          ) : state === "break" ? (
            /* Break Eyes: Happy curved relaxed eyes (^^) */
            <g>
              <path
                d="M72 98 Q78 90 84 98"
                stroke="#374151"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <path
                d="M116 98 Q122 90 128 98"
                stroke="#374151"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </g>
          ) : (
            /* Celebrate Eyes: Starry sparkling anime eyes */
            <g>
              <circle cx="78" cy="96" r="6" fill="#374151" />
              <circle cx="76" cy="94" r="2.5" fill="#FFFFFF" />
              <circle cx="80" cy="98" r="1.2" fill="#FFFFFF" />

              <circle cx="122" cy="96" r="6" fill="#374151" />
              <circle cx="120" cy="94" r="2.5" fill="#FFFFFF" />
              <circle cx="124" cy="98" r="1.2" fill="#FFFFFF" />
            </g>
          )}

          {/* Hand Accessories per State */}
          {state === "studying" ? (
            /* Studying: Desk with Open Book */
            <g transform="translate(0, 15)">
              {/* Cute pastel wooden desk */}
              <rect
                x="45"
                y="142"
                width="110"
                height="10"
                rx="4"
                fill="#FED7AA"
                stroke="#FDBA74"
                strokeWidth="2"
              />
              {/* Open Notebook */}
              <path
                d="M68 142 L100 138 L132 142 L130 148 L100 145 L70 148 Z"
                fill="#FFFFFF"
                stroke="#E2E8F0"
                strokeWidth="2"
              />
              {/* Book spine & text lines */}
              <line x1="100" y1="138" x2="100" y2="145" stroke="#CBD5E1" strokeWidth="1.5" />
              <line x1="75" y1="142" x2="95" y2="141" stroke="#F472B6" strokeWidth="1.5" />
              <line x1="105" y1="141" x2="125" y2="142" stroke="#60A5FA" strokeWidth="1.5" />

              {/* Tiny paws resting on desk */}
              <ellipse cx="64" cy="140" rx="6" ry="4" fill="#FFF0F3" stroke="#F472B6" strokeWidth="2" />
              <ellipse cx="136" cy="140" rx="6" ry="4" fill="#FFF0F3" stroke="#F472B6" strokeWidth="2" />
            </g>
          ) : state === "break" ? (
            /* Break: Holding Boba Milk Tea cup */
            <g transform="translate(100, 136)">
              {/* Boba Cup */}
              <path
                d="M-12 -5 L-9 22 Q0 26 9 22 L12 -5 Z"
                fill="#FEF3C7"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              {/* Boba Straw */}
              <line x1="3" y1="-14" x2="-2" y2="15" stroke="#F472B6" strokeWidth="3.5" strokeLinecap="round" />
              {/* Tapioca Pearls */}
              <circle cx="-4" cy="16" r="2.5" fill="#78350F" />
              <circle cx="2" cy="17" r="2.5" fill="#78350F" />
              <circle cx="-1" cy="10" r="2.5" fill="#78350F" />
              {/* Cup Lid */}
              <ellipse cx="0" cy="-5" rx="13" ry="3" fill="#FBCFE8" stroke="#F472B6" strokeWidth="1.5" />
              {/* Bunny Paws holding cup */}
              <ellipse cx="-13" cy="5" rx="5" ry="4" fill="#FFF0F3" stroke="#F472B6" strokeWidth="2" />
              <ellipse cx="13" cy="5" rx="5" ry="4" fill="#FFF0F3" stroke="#F472B6" strokeWidth="2" />
            </g>
          ) : (
            /* Celebrate: Hands in the air with sparkles */
            <g>
              <ellipse cx="55" cy="95" rx="6" ry="8" fill="#FFF0F3" stroke="#F472B6" strokeWidth="2.5" />
              <ellipse cx="145" cy="95" rx="6" ry="8" fill="#FFF0F3" stroke="#F472B6" strokeWidth="2.5" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* State Caption & Mood Badge */}
      <div className="mt-2 text-center">
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
            state === "studying"
              ? "bg-pink-100/90 text-pink-700 border border-pink-200"
              : state === "break"
              ? "bg-emerald-100/90 text-emerald-700 border border-emerald-200"
              : "bg-purple-100/90 text-purple-700 border border-purple-200"
          }`}
        >
          {state === "studying" && (
            <>
              <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
              <span>{isPaused ? "Sedang Pause ⏸️" : `Fokus: ${subject || "Belajar Rajin"}`}</span>
            </>
          )}
          {state === "break" && (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Istirahat Boba 🍵</span>
            </>
          )}
          {state === "celebrate" && (
            <>
              <span className="w-2 h-2 rounded-full bg-purple-500" />
              <span>Selesai! Bunga Mekar 🌸</span>
            </>
          )}
        </span>
      </div>
    </div>
  );
}
