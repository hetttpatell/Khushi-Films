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

import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const CINEMA = [0.76, 0, 0.24, 1];

export default function PageTransition({ children }) {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0 }} // opacity is instant — curtain does the work
                style={{ position: "relative", minHeight: "100vh" }}
            >
                {/* Page content */}
                {children}

                {/* ── Curtain enter: slides in from left, then exits right ── */}
                <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: ["−100%", "0%", "101%"] }}
                    transition={{
                        duration: 0.85,
                        times: [0, 0.45, 1],
                        ease: CINEMA,
                    }}
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

            </motion.div>
        </AnimatePresence>
    );
}