/**
 * PageTransition.jsx
 *
 * Wraps every page with a black curtain wipe.
 * ────────────────────────────────────────────────────────
 * ON ENTER  — black panel slides in from left, covers screen (0.38s)
 *             then slides out to right, revealing new page (0.45s)
 * ON EXIT   — page fades down slightly (subtle, not jarring)
 *
 * Usage: wrap each <Route> element, or wrap the top-level
 * <Routes> output in AppInner. See App.jsx below.
 */

import { motion } from "framer-motion";
import { useEffect } from "react";

const CINEMA = [0.76, 0, 0.24, 1];

export default function PageTransition({ children }) {
    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    }, []);

    return (
        <>
            {/* Page content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                style={{ position: "relative", minHeight: "100vh" }}
            >
                {children}
            </motion.div>

            {/* Slide IN curtain (covers old page on exit) */}
            <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "-100%" }}
                exit={{ x: "0%" }}
                transition={{ duration: 0.5, ease: CINEMA }}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 900,
                    background: "#0a0a0a",
                    pointerEvents: "none",
                    willChange: "transform",
                }}
            >
                {/* Gold leading edge */}
                <div style={{
                    position: "absolute",
                    top: 0, bottom: 0, right: 0,
                    width: 2,
                    background: "linear-gradient(to bottom, transparent, rgba(255,210,90,0.22) 35%, rgba(255,210,90,0.28) 65%, transparent)",
                }} />
            </motion.div>

            {/* Slide OUT curtain (reveals new page on enter) */}
            <motion.div
                initial={{ x: "0%" }}
                animate={{ x: "100%" }}
                exit={{ x: "100%" }}
                transition={{ duration: 0.5, ease: CINEMA }}
                style={{
                    position: "fixed",
                    inset: 0,
                    zIndex: 900,
                    background: "#0a0a0a",
                    pointerEvents: "none",
                    willChange: "transform",
                }}
            >
                {/* Gold trailing edge */}
                <div style={{
                    position: "absolute",
                    top: 0, bottom: 0, left: 0,
                    width: 2,
                    background: "linear-gradient(to bottom, transparent, rgba(255,210,90,0.22) 35%, rgba(255,210,90,0.28) 65%, transparent)",
                }} />
            </motion.div>
        </>
    );
}