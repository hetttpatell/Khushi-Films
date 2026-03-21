/**
 * WelcomeScreen.jsx  —  "Stage & Light"
 *
 * MOTION DESIGN
 * ─────────────────────────────────────────────────────────────
 * 1. CURTAINS IN   — two panels start fully closed (#0a0a0a)
 * 2. TITLE REVEAL  — "KHUSHI" clips up from behind a mask,
 *                    then "Films" italic rises 80ms after.
 *                    A hairline rule draws itself left→right.
 *                    Tagline letter-spaces out from 0.
 * 3. AMBIENT PULSE — the curtain edges glow softly once (warm gold)
 * 4. CURTAINS PART — panels slide outward with a slight vertical
 *                    parallax (they also move 6px upward as they
 *                    open, giving a "lifting" feel).
 *                    The inner seam has a light-leak that blooms
 *                    and fades as the gap appears.
 * 5. TITLE WIPE    — as curtains open, a white clip-mask sweeps
 *                    left→right over the title, erasing it exactly
 *                    as the hero beneath is revealed.
 * 6. HERO LIVE     — HalideHero was mounting the whole time.
 *                    Zero seam. Same font, same black, same world.
 *
 * TIMELINE
 * ────────
 *  0.0s  closed, dark
 *  0.3s  "KHUSHI" clips up
 *  0.55s "Films" clips up
 *  0.8s  rule draws, tagline spaces out
 *  1.3s  edge glow pulses once
 *  2.4s  curtains slide open + light-leak blooms + title wipes
 *  3.3s  all gone, onComplete()
 */

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ─── eases ─────────────────────────────────────────────────── */
const EXPO = [0.16, 1, 0.3, 1];
const CINEMA = [0.76, 0, 0.24, 1];

/* ─── Film grain ─────────────────────────────────────────────── */
function Grain() {
  return (
    <>
      <svg style={{ position: "absolute", width: 0, height: 0 }}>
        <filter id="ws-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.70"
            numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        zIndex: 8, pointerEvents: "none",
        opacity: 0.09,
        filter: "url(#ws-grain)",
        mixBlendMode: "overlay",
      }} />
    </>
  );
}

/* ─── Single curtain panel ───────────────────────────────────── */
function CurtainPanel({ side, open, glowing }) {
  const isLeft = side === "left";

  return (
    <motion.div
      initial={{ x: "0%", y: 0 }}
      animate={open
        ? { x: isLeft ? "-100%" : "100%", y: -10 }
        : { x: "0%", y: 0 }
      }
      transition={{ duration: 1.4, ease: CINEMA, delay: 0 }}
      style={{
        position: "absolute",
        top: 0, bottom: 0,
        [isLeft ? "left" : "right"]: 0,
        width: "50%",
        background: "#0a0a0a",
        zIndex: 10,
        willChange: "transform",
      }}
    >
      {/* Inner edge — warm gold trim line */}
      <motion.div
        animate={{
          opacity: glowing ? [0, 0.55, 0.35] : open ? [0.35, 0] : 0.06,
          boxShadow: glowing
            ? [
              "none",
              `${isLeft ? "2px" : "-2px"} 0 18px rgba(255,210,90,0.25)`,
              `${isLeft ? "1px" : "-1px"} 0 8px rgba(255,210,90,0.12)`,
            ]
            : "none",
        }}
        transition={{ duration: glowing ? 0.8 : 0.5 }}
        style={{
          position: "absolute",
          top: 0, bottom: 0,
          [isLeft ? "right" : "left"]: 0,
          width: 2,
          background: isLeft
            ? "linear-gradient(to bottom, transparent 0%, rgba(255,215,100,0.22) 35%, rgba(255,215,100,0.28) 65%, transparent 100%)"
            : "linear-gradient(to bottom, transparent 0%, rgba(255,215,100,0.22) 35%, rgba(255,215,100,0.28) 65%, transparent 100%)",
        }}
      />

      {/* Subtle vertical grain texture on panel */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.008) 3px, rgba(255,255,255,0.008) 4px)",
        pointerEvents: "none",
      }} />
    </motion.div>
  );
}

/* ─── Centre light leak between panels ──────────────────────── */
function LightLeak({ open }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="leak"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: [0, 0.7, 0], scaleX: [0, 1, 1] }}
          transition={{ duration: 0.6, times: [0, 0.15, 1], ease: "easeOut" }}
          style={{
            position: "absolute",
            top: 0, bottom: 0,
            left: "50%", width: 80,
            transform: "translateX(-50%)",
            zIndex: 12,
            background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,230,160,0.35) 0%, transparent 70%)",
            pointerEvents: "none",
            mixBlendMode: "screen",
          }}
        />
      )}
    </AnimatePresence>
  );
}

/* ─── Title with clip-mask reveal + wipe-erase ───────────────── */
function WelcomeTitle({ phase }) {
  // phase: "hidden" | "revealing" | "wiping"
  const show = phase === "revealing";
  const wiping = phase === "wiping";

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 20,
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      pointerEvents: "none",
      // Wipe erase: clip-path sweeps left→right
    }}>
      <motion.div
        animate={wiping
          ? { clipPath: "inset(0 0% 0 100%)" }
          : { clipPath: "inset(0 0% 0 0%)" }
        }
        transition={wiping
          ? { duration: 1.0, ease: CINEMA }
          : { duration: 0 }
        }
        style={{
          display: "flex", flexDirection: "column",
          alignItems: "center",
          clipPath: "inset(0 0% 0 0%)",
        }}
      >
        {/* Label */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0.8em" }}
          animate={show ? { opacity: 1, letterSpacing: "0.52em" } : {}}
          transition={{ duration: 1.5, delay: 0.2, ease: EXPO }}
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: "clamp(0.36rem, 1.1vw, 0.5rem)",
            letterSpacing: "0.52em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            marginBottom: "clamp(1rem,2.8vw,1.8rem)",
            fontWeight: 400,
          }}
        >
          Est. 2015 · Ahmedabad
        </motion.p>

        {/* "KHUSHI" — clips up from below */}
        <div style={{ overflow: "hidden", lineHeight: 1.0 }}>
          <motion.h1
            initial={{ y: "105%", opacity: 0 }}
            animate={show ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.5, ease: EXPO }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              fontSize: "clamp(3.5rem, 11vw, 9rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "#fff",
              margin: 0,
              textShadow: "0 2px 60px rgba(0,0,0,0.9)",
            }}
          >
            Khushi
          </motion.h1>
        </div>

        {/* "Films" — clips up 80ms later */}
        <div style={{ overflow: "hidden", lineHeight: 1.0, marginBottom: 0 }}>
          <motion.h1
            initial={{ y: "105%", opacity: 0 }}
            animate={show ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 1.5, delay: 0.7, ease: EXPO }}
            style={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 400,
              fontStyle: "italic",
              fontSize: "clamp(3.5rem, 11vw, 9rem)",
              lineHeight: 1.0,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.52)",
              margin: 0,
            }}
          >
            Films
          </motion.h1>
        </div>

        {/* Hairline rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={show ? { scaleX: 1 } : {}}
          transition={{ duration: 1.5, delay: 1.2, ease: EXPO }}
          style={{
            width: "clamp(44px,6vw,68px)",
            height: 1,
            background: "rgba(255,255,255,0.16)",
            margin: "clamp(1.1rem,2.5vw,1.9rem) 0",
            transformOrigin: "left",
          }}
        />

        {/* Tagline — letter-space springs out */}
        <motion.p
          initial={{ opacity: 0, letterSpacing: "0em" }}
          animate={show ? { opacity: 1, letterSpacing: "0.3em" } : {}}
          transition={{ duration: 1.5, delay: 1.5, ease: EXPO }}
          style={{
            fontFamily: "'Syncopate', sans-serif",
            fontSize: "clamp(0.38rem, 1.2vw, 0.55rem)",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            fontWeight: 400,
          }}
        >
          Cinematic · Timeless · Yours
        </motion.p>
      </motion.div>
    </div>
  );
}

/* ─── Main ───────────────────────────────────────────────────── */
export default function WelcomeScreen({ onComplete }) {
  const [titlePhase, setTitlePhase] = useState("hidden");
  // "hidden" → "revealing" → "wiping"

  const [curtainOpen, setCurtainOpen] = useState(false);
  const [glowing, setGlowing] = useState(false);
  const [gone, setGone] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    const T = [];

    // 0.8s — title reveals
    T.push(setTimeout(() => setTitlePhase("revealing"), 800));

    // 2.8s — edge glow pulses
    T.push(setTimeout(() => {
      setGlowing(true);
      setTimeout(() => setGlowing(false), 900);
    }, 2800));

    // 4.2s — curtains open + title wipes simultaneously
    T.push(setTimeout(() => {
      setCurtainOpen(true);
      setTitlePhase("wiping");
    }, 4200));

    // 5.5s — done
    T.push(setTimeout(() => {
      setGone(true);
      if (!done.current) {
        done.current = true;
        onComplete?.();
      }
    }, 5500));

    return () => T.forEach(clearTimeout);
  }, [onComplete]);

  // Let App.jsx handle unmounting via AnimatePresence
  // if (gone) return null;

  return (
    <motion.div 
      exit={{ opacity: 0 }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "transparent", overflow: "hidden",
        pointerEvents: curtainOpen ? "none" : "auto",
      }}>

      <Grain />

      {/* Vignette — same as HalideHero */}
      <div style={{
        position: "absolute", inset: 0, zIndex: 3, pointerEvents: "none",
        background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 30%, rgba(0,0,0,0.6) 100%)",
      }} />

      {/* Curtains */}
      <CurtainPanel side="left" open={curtainOpen} glowing={glowing} />
      <CurtainPanel side="right" open={curtainOpen} glowing={glowing} />

      {/* Centre seam shadow (hides when open) */}
      <motion.div
        animate={{ opacity: curtainOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute", top: 0, bottom: 0,
          left: "50%", width: 40,
          transform: "translateX(-50%)",
          zIndex: 11, pointerEvents: "none",
          background: "radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,0,0,0.7) 0%, transparent 100%)",
        }}
      />

      {/* Light leak */}
      <LightLeak open={curtainOpen} />

      {/* Title */}
      <WelcomeTitle phase={titlePhase} />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,600;1,400&family=Syncopate:wght@400&display=swap');
      `}</style>
    </motion.div>
  );
}

