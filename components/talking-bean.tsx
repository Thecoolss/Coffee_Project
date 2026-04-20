"use client";

import { motion } from "motion/react";
import { BeanTheme } from "@/lib/bean-theme";
import { useId } from "react";

type Props = {
  talking?: boolean;
  mood?: "idle" | "happy" | "thinking";
  size?: number;
  theme?: BeanTheme;
};

const defaultTheme: BeanTheme = {
  bodyTop: "#8a4b2a",
  bodyMid: "#4d2615",
  bodyBottom: "#2c150b",
  accent: "#e8c77d",
  crease: "#1c1510",
  flagPalette: ["#6d391f", "#e8c77d", "#4d2615"]
};

export function TalkingBean({ talking = false, mood = "idle", size = 200, theme }: Props) {
  const t = theme ?? defaultTheme;
  const uid = useId().replace(/[:]/g, "");
  const bodyId = `tb-body-${uid}`;
  const shineId = `tb-shine-${uid}`;
  const cheekId = `tb-cheek-${uid}`;

  const breathe = talking
    ? { scale: [1, 1.04, 1], rotate: [0, -1.8, 1.8, 0] }
    : { scale: [1, 1.015, 1], rotate: [0, 0.6, -0.6, 0] };

  return (
    <motion.div
      className="relative select-none"
      style={{ width: size, height: size }}
      animate={breathe}
      transition={{ duration: talking ? 0.65 : 3.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <motion.div
        className="absolute inset-x-6 bottom-2 h-4 rounded-full bg-black/20 blur-md"
        animate={{ opacity: talking ? [0.35, 0.2, 0.35] : [0.3, 0.22, 0.3] }}
        transition={{ duration: talking ? 0.6 : 3.2, repeat: Infinity, ease: "easeInOut" }}
      />

      <svg viewBox="0 0 200 220" width={size} height={size} className="relative">
        <defs>
          <linearGradient id={bodyId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={t.bodyTop} />
            <stop offset="55%" stopColor={t.bodyMid} />
            <stop offset="100%" stopColor={t.bodyBottom} />
          </linearGradient>
          <linearGradient id={shineId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </linearGradient>
          <radialGradient id={cheekId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={t.accent} stopOpacity="0.7" />
            <stop offset="100%" stopColor={t.accent} stopOpacity="0" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="110" rx="70" ry="90" fill={`url(#${bodyId})`} />
        <ellipse cx="80" cy="78" rx="34" ry="48" fill={`url(#${shineId})`} opacity="0.8" />

        <BeanHat palette={t.flagPalette} />

        <path
          d="M100 22 C 92 60, 92 160, 100 198"
          stroke={t.crease}
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
          opacity="0.78"
        />
        <path
          d="M100 22 C 108 60, 108 160, 100 198"
          stroke={t.accent}
          strokeWidth="1.4"
          strokeLinecap="round"
          fill="none"
          opacity="0.5"
        />

        <circle cx="70" cy="128" r="14" fill={`url(#${cheekId})`} />
        <circle cx="130" cy="128" r="14" fill={`url(#${cheekId})`} />

        <Eye cx={76} cy={108} mood={mood} />
        <Eye cx={124} cy={108} mood={mood} />

        {mood === "thinking" ? (
          <>
            <path d="M62 92 Q 76 86 90 92" stroke="#fdf9f3" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M110 92 Q 124 86 138 92" stroke="#fdf9f3" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : null}

        <Mouth talking={talking} mood={mood} accent={t.accent} />

        <BeanFlag palette={t.flagPalette} />
      </svg>

      {talking ? (
        <>
          <Blip delay={0} position="left" accent={t.accent} />
          <Blip delay={0.35} position="right" accent={t.accent} />
        </>
      ) : null}
    </motion.div>
  );
}

function BeanHat({ palette }: { palette: [string, string, string] }) {
  return (
    <g>
      <path d="M52 46 Q 100 12 148 46 L 142 56 Q 100 31 58 56 Z" fill="#2a1811" opacity="0.7" />
      <rect x="58" y="42" width="84" height="11" rx="4" fill={palette[0]} />
      <rect x="84" y="42" width="32" height="11" rx="2" fill={palette[1]} />
      <rect x="116" y="42" width="26" height="11" rx="2" fill={palette[2]} />
      <rect x="66" y="52" width="68" height="6" rx="3" fill="#fdf9f3" opacity="0.9" />
    </g>
  );
}

function BeanFlag({ palette }: { palette: [string, string, string] }) {
  return (
    <g>
      {/* little waving arm */}
      <path
        d="M154 126 Q 172 120 182 106"
        stroke="#2b160d"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
        opacity="0.9"
      />
      {/* flag pole */}
      <line x1="182" y1="80" x2="182" y2="116" stroke="#f2e5d5" strokeWidth="3" strokeLinecap="round" />
      {/* simple 3-band flag */}
      <rect x="182" y="80" width="20" height="14" rx="2" fill={palette[0]} />
      <rect x="188.6" y="80" width="6.7" height="14" fill={palette[1]} />
      <rect x="195.3" y="80" width="6.7" height="14" fill={palette[2]} />
    </g>
  );
}

function Eye({ cx, cy, mood }: { cx: number; cy: number; mood: Props["mood"] }) {
  return (
    <motion.g
      animate={{ scaleY: [1, 1, 0.08, 1, 1] }}
      transition={{ duration: 4.5, times: [0, 0.46, 0.5, 0.54, 1], repeat: Infinity, ease: "easeInOut" }}
      style={{ transformOrigin: `${cx}px ${cy}px` }}
    >
      <ellipse cx={cx} cy={cy} rx="7.5" ry="9.5" fill="#fdf9f3" />
      <circle cx={cx + (mood === "thinking" ? 2 : 0)} cy={cy + 1} r="4" fill="#1c1510" />
      <circle cx={cx - 1.5} cy={cy - 2} r="1.5" fill="#fdf9f3" />
    </motion.g>
  );
}

function Mouth({
  talking,
  mood,
  accent
}: {
  talking: boolean;
  mood: Props["mood"];
  accent: string;
}) {
  if (talking) {
    return (
      <motion.g
        animate={{ scale: [0.95, 1.08, 0.95] }}
        transition={{ duration: 0.45, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "100px 150px" }}
      >
        <motion.ellipse
          cx="100"
          cy="150"
          fill="#1c1510"
          animate={{ ry: [3, 9, 4, 10, 3], rx: [10, 14, 11, 15, 10] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.ellipse
          cx="100"
          cy="154"
          rx="5"
          ry="2"
          fill={accent}
          opacity={0.55}
          animate={{ opacity: [0.2, 0.7, 0.2] }}
          transition={{ duration: 0.55, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.g>
    );
  }

  if (mood === "happy") {
    return (
      <path
        d="M84 148 Q 100 164 116 148"
        stroke="#1c1510"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    );
  }

  if (mood === "thinking") {
    return (
      <path
        d="M88 154 Q 100 150 112 154"
        stroke="#1c1510"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    );
  }

  return (
    <path
      d="M86 150 Q 100 158 114 150"
      stroke="#1c1510"
      strokeWidth="3.5"
      strokeLinecap="round"
      fill="none"
    />
  );
}

function Blip({
  delay,
  position,
  accent
}: {
  delay: number;
  position: "left" | "right";
  accent: string;
}) {
  const offset = position === "left" ? "left-1" : "right-1";
  return (
    <motion.div
      className={`absolute top-6 ${offset} flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-mocha-700 shadow`}
      style={{ background: accent }}
      initial={{ opacity: 0, y: 6, scale: 0.7 }}
      animate={{ opacity: [0, 1, 1, 0], y: [6, -4, -8, -14], scale: [0.7, 1, 1, 0.9] }}
      transition={{ duration: 1.4, repeat: Infinity, delay, ease: "easeOut" }}
    >
      ·
    </motion.div>
  );
}
