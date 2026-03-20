import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera, MapPin, Users, MessageSquare,
    ChevronRight, CheckCircle2, Loader2, Mail, Phone, User, Calendar
} from "lucide-react";

// ── Replace with your Cal.com event link ─────────────────────────────────────
const CAL_EVENT_URL = "https://cal.com/your-username/your-event";

const EVENT_TYPES = [
    { id: "wedding", label: "Wedding" },
    { id: "pre-wedding", label: "Pre-Wedding" },
    { id: "concert", label: "Concert" },
    { id: "corporate", label: "Corporate" },
    { id: "opening", label: "Brand Opening" },
    { id: "other", label: "Other" },
];

const GUEST_OPTIONS = [
    { value: "micro", label: "Under 50" },
    { value: "boutique", label: "50 – 150" },
    { value: "grand", label: "150 – 500" },
    { value: "epic", label: "500+" },
];

const validators = {
    name: (v) => !v.trim() ? "Full name is required" : v.trim().length < 2 ? "Name is too short" : "",
    email: (v) => !v.trim() ? "Email is required" : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? "Enter a valid email" : "",
    phone: (v) => !v.trim() ? "Phone number is required" : !/^[+\d\s\-()]{7,15}$/.test(v.trim()) ? "Enter a valid phone number" : "",
    eventType: (v) => !v ? "Please select an event type" : "",
    eventDate: (v) => {
        if (!v) return "Please select a date";
        const selected = new Date(v);
        const today = new Date(); today.setHours(0, 0, 0, 0);
        return selected < today ? "Date must be in the future" : "";
    },
    location: (v) => !v.trim() ? "Venue / location is required" : "",
    guestCount: (v) => !v ? "Please estimate guest count" : "",
    message: () => "",
};

// ── Field wrapper ─────────────────────────────────────────────────────────────
function Field({ label, error, children, icon: Icon }) {
    return (
        <div className="bk-field">
            <label className="bk-label">
                {Icon && <Icon size={11} className="bk-label-icon" />}
                {label}
            </label>
            {children}
            <AnimatePresence>
                {error && (
                    <motion.p
                        key={error}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="bk-error"
                    >
                        ↳ {error}
                    </motion.p>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Section heading ───────────────────────────────────────────────────────────
function SectionLabel({ icon: Icon, label }) {
    return (
        <div className="bk-section-label">
            <div className="bk-section-icon">
                <Icon size={14} />
            </div>
            <span className="bk-section-title">{label}</span>
            <div className="bk-section-rule" />
        </div>
    );
}

// ── Main component ────────────────────────────────────────────────────────────
export function BookingSection() {
    const [form, setForm] = useState({
        name: "", email: "", phone: "",
        eventType: "", eventDate: "",
        location: "", guestCount: "", message: "",
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [status, setStatus] = useState("idle"); // idle | submitting | success

    const setField = (key, value) => {
        setForm((f) => ({ ...f, [key]: value }));
        if (touched[key]) setErrors((e) => ({ ...e, [key]: validators[key](value) }));
    };

    const handleBlur = (key) => {
        setTouched((t) => ({ ...t, [key]: true }));
        setErrors((e) => ({ ...e, [key]: validators[key](form[key]) }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allErrors = Object.keys(validators).reduce(
            (acc, k) => ({ ...acc, [k]: validators[k](form[k]) }), {}
        );
        setTouched(Object.keys(validators).reduce((acc, k) => ({ ...acc, [k]: true }), {}));
        setErrors(allErrors);
        if (Object.values(allErrors).some(Boolean)) return;

        setStatus("submitting");
        const params = new URLSearchParams({
            name: form.name,
            email: form.email,
            notes: `Phone: ${form.phone} | Type: ${form.eventType} | Location: ${form.location} | Guests: ${form.guestCount} | Notes: ${form.message}`,
            date: form.eventDate,
        });
        setTimeout(() => {
            setStatus("success");
            setTimeout(() => window.open(`${CAL_EVENT_URL}?${params}`, "_blank"), 1200);
        }, 900);
    };

    const reset = () => {
        setForm({ name: "", email: "", phone: "", eventType: "", eventDate: "", location: "", guestCount: "", message: "" });
        setErrors({}); setTouched({}); setStatus("idle");
    };

    return (
        <>
            {/* ── ALL STYLES IN ONE PLACE — no JS style mutation anywhere ── */}
            <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap');

        /* ── Layout ── */
        #booking {
          background: #000;
          padding: 120px 24px;
          position: relative;
          z-index: 30;
          overflow: hidden;
          border-top: 1px solid rgba(255,255,255,0.05);
          pointer-events: auto;
          isolation: isolate;
        }
        .bk-glow-1 {
          position: absolute; top: -10%; left: 20%;
          width: 500px; height: 500px;
          background: rgba(168,85,247,0.07);
          border-radius: 50%; filter: blur(120px);
          pointer-events: none;
        }
        .bk-glow-2 {
          position: absolute; bottom: -5%; right: 15%;
          width: 400px; height: 400px;
          background: rgba(59,130,246,0.06);
          border-radius: 50%; filter: blur(100px);
          pointer-events: none;
        }
        .bk-grain-layer {
          position: absolute; inset: 0;
          opacity: 0.035; filter: url(#bk-grain-filter);
          pointer-events: none;
        }
        .bk-inner {
          position: relative; z-index: 20;
          max-width: 1080px; margin: 0 auto;
        }

        /* ── Header ── */
        .bk-eyebrow {
          font-family: monospace;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.3em; text-transform: uppercase;
          color: rgba(168,85,247,0.8); margin-bottom: 20px;
          display: block;
        }
        .bk-headline {
          font-family: 'Playfair Display', serif;
          font-size: clamp(2.6rem, 7vw, 5.5rem);
          font-weight: 700; color: white;
          line-height: 1.1; margin-bottom: 16px;
        }
        .bk-headline em {
          font-style: italic; font-weight: 400;
          color: rgba(255,255,255,0.3);
        }
        .bk-rule {
          width: 80px; height: 1px;
          background: linear-gradient(to right, #a855f7, #3b82f6);
          margin: 0 auto 24px;
        }
        .bk-subhead {
          font-family: Georgia, serif; font-style: italic;
          color: rgba(255,255,255,0.35); font-size: 16px;
          max-width: 440px; margin: 0 auto; line-height: 1.8;
        }

        /* ── Card ── */
        .bk-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 32px;
          background: rgba(255,255,255,0.02);
          overflow: hidden;
        }
        .bk-card-top-rule {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(168,85,247,0.5), rgba(59,130,246,0.5), transparent);
        }
        .bk-card-bottom-rule {
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(59,130,246,0.5), rgba(168,85,247,0.5), transparent);
        }
        .bk-card-body { padding: clamp(28px, 5vw, 64px); }

        /* ── Section label ── */
        .bk-section-label {
          display: flex; align-items: center;
          gap: 12px; margin-bottom: 24px;
        }
        .bk-section-icon {
          width: 34px; height: 34px; border-radius: 10px;
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.25);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0; color: rgba(168,85,247,0.9);
        }
        .bk-section-title {
          font-family: 'Playfair Display', serif;
          font-size: 18px; font-weight: 700; color: white;
        }
        .bk-section-rule {
          flex: 1; height: 1px;
          background: linear-gradient(to right, rgba(255,255,255,0.06), transparent);
        }

        /* ── Divider ── */
        .bk-divider {
          height: 1px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 48px;
        }

        /* ── Grid rows ── */
        .bk-grid-3 {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        .bk-block { margin-bottom: 48px; }

        /* ── Field ── */
        .bk-field { display: flex; flex-direction: column; gap: 8px; width: 100%; }
        .bk-label {
          display: flex; align-items: center; gap: 6px;
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.25em; text-transform: uppercase;
          color: rgba(255,255,255,0.35); font-family: monospace;
        }
        .bk-label-icon { color: rgba(168,85,247,0.8); flex-shrink: 0; }
        .bk-error {
          font-size: 10px; font-weight: 700;
          letter-spacing: 0.1em; text-transform: uppercase;
          color: rgba(239,68,68,0.9); font-family: monospace;
        }

        /* ── Inputs ── */
        .bk-input, .bk-select, .bk-textarea {
          width: 100%; box-sizing: border-box;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          padding: 14px 16px;
          color: white; font-size: 14px;
          font-family: Georgia, serif;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          cursor: text;
        }
        .bk-select { cursor: pointer; font-family: Georgia, serif; }
        .bk-textarea { resize: none; height: 110px; padding-top: 14px; line-height: 1.7; cursor: text; }

        .bk-input::placeholder,
        .bk-textarea::placeholder { color: rgba(255,255,255,0.2); }

        .bk-input:hover, .bk-select:hover, .bk-textarea:hover {
          border-color: rgba(255,255,255,0.15);
        }
        .bk-input:focus, .bk-select:focus, .bk-textarea:focus {
          border-color: rgba(168,85,247,0.55);
          background: rgba(255,255,255,0.06);
        }
        .bk-input.bk-has-error,
        .bk-select.bk-has-error { border-color: rgba(239,68,68,0.6); }
        .bk-input.bk-mono { font-family: monospace; }

        input[type="date"].bk-input { color-scheme: dark; font-family: monospace; }
        input[type="date"].bk-input::-webkit-calendar-picker-indicator {
          filter: invert(0.5) brightness(0.7); cursor: pointer;
        }

        /* ── Event-type pill buttons ── */
        .bk-pills {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 10px;
        }
        .bk-pill {
          padding: 15px 10px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          color: rgba(255,255,255,0.4);
          font-size: 11px; font-weight: 700;
          letter-spacing: 0.12em; text-transform: uppercase;
          font-family: monospace;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, color 0.2s;
          position: relative;
          /* CRITICAL: make sure clicks register */
          pointer-events: all;
          user-select: none;
          -webkit-user-select: none;
        }
        .bk-pill:hover {
          border-color: rgba(255,255,255,0.22);
          color: rgba(255,255,255,0.75);
          background: rgba(255,255,255,0.05);
        }
        .bk-pill[data-active="true"] {
          border-color: rgba(168,85,247,0.65);
          background: rgba(168,85,247,0.13);
          color: white;
        }
        .bk-pill[data-active="true"]:hover {
          border-color: rgba(168,85,247,0.8);
          background: rgba(168,85,247,0.18);
        }
        .bk-pill-dot {
          position: absolute; top: 7px; right: 8px;
          width: 5px; height: 5px; border-radius: 50%;
          background: #a855f7;
        }

        /* ── Bottom row ── */
        .bk-bottom-row {
          display: flex; align-items: center;
          justify-content: space-between;
          flex-wrap: wrap; gap: 16px;
        }
        .bk-hint {
          font-family: monospace; font-size: 10px; font-weight: 700;
          letter-spacing: 0.15em; text-transform: uppercase;
          color: rgba(255,255,255,0.2);
        }

        /* ── Submit button ── */
        .bk-submit {
          height: 56px; padding: 0 36px; border-radius: 16px; border: none;
          background: linear-gradient(135deg, #a855f7, #3b82f6);
          color: white; font-family: monospace; font-size: 11px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          cursor: pointer;
          display: flex; align-items: center; gap: 10px;
          box-shadow: 0 0 40px rgba(168,85,247,0.2);
          white-space: nowrap;
          transition: transform 0.15s, box-shadow 0.15s, opacity 0.2s;
          pointer-events: all;
        }
        .bk-submit:hover:not(:disabled) {
          transform: scale(1.03);
          box-shadow: 0 0 56px rgba(168,85,247,0.35);
        }
        .bk-submit:active:not(:disabled) { transform: scale(0.97); }
        .bk-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        /* ── Success state ── */
        .bk-success {
          text-align: center; padding: 96px 32px;
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 32px;
          background: rgba(255,255,255,0.02);
        }
        .bk-success-icon-wrap {
          width: 80px; height: 80px; border-radius: 50%;
          background: rgba(168,85,247,0.1);
          border: 1px solid rgba(168,85,247,0.3);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 32px;
          color: rgba(168,85,247,0.9);
        }
        .bk-success-title {
          font-family: 'Playfair Display', serif;
          font-size: 48px; font-weight: 700; color: white; margin-bottom: 12px;
        }
        .bk-success-sub {
          font-family: Georgia, serif; font-style: italic;
          color: rgba(255,255,255,0.4); font-size: 18px; margin-bottom: 40px;
        }
        .bk-reset-btn {
          font-family: monospace; font-size: 10px; font-weight: 700;
          letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); background: none; border: none;
          cursor: pointer; transition: color 0.2s;
        }
        .bk-reset-btn:hover { color: white; }

        /* ── Spin animation for loader ── */
        @keyframes bk-spin { to { transform: rotate(360deg); } }
        .bk-spin { animation: bk-spin 0.8s linear infinite; display: inline-block; }
      `}</style>

            <section id="booking">
                {/* Atmosphere */}
                <div className="bk-glow-1" />
                <div className="bk-glow-2" />
                <svg style={{ position: "absolute", width: 0, height: 0 }}>
                    <filter id="bk-grain-filter">
                        <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
                        <feColorMatrix type="saturate" values="0" />
                    </filter>
                </svg>
                <div className="bk-grain-layer" />

                <div className="bk-inner">

                    {/* ── Header ── */}
                    <div style={{ textAlign: "center", marginBottom: 72 }}>
                        <motion.span
                            className="bk-eyebrow"
                            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                        >
                            ● Book a Session
                        </motion.span>
                        <motion.h2
                            className="bk-headline"
                            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.8 }}
                        >
                            Let's Create <em>Something Beautiful</em>
                        </motion.h2>
                        <div className="bk-rule" />
                        <p className="bk-subhead">
                            Fill in the details and we'll confirm your slot on Cal.com — your story deserves to be told.
                        </p>
                    </div>

                    {/* ── Form / Success ── */}
                    <AnimatePresence mode="wait">

                        {/* SUCCESS */}
                        {status === "success" && (
                            <motion.div key="success" className="bk-success"
                                initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                                <motion.div className="bk-success-icon-wrap"
                                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, damping: 16, delay: 0.1 }}>
                                    <CheckCircle2 size={36} strokeWidth={1.5} />
                                </motion.div>
                                <p className="bk-success-title">Confirmed.</p>
                                <p className="bk-success-sub">Redirecting you to Cal.com to pick your time…</p>
                                <button className="bk-reset-btn" onClick={reset}>← Submit another booking</button>
                            </motion.div>
                        )}

                        {/* FORM */}
                        {status !== "success" && (
                            <motion.div key="form"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                                <div className="bk-card">
                                    <div className="bk-card-top-rule" />
                                    <div className="bk-card-body">

                                        {/* 1 — Contact */}
                                        <div className="bk-block">
                                            <SectionLabel icon={User} label="Primary Contact" />
                                            <div className="bk-grid-3">
                                                <Field label="Full Name" error={errors.name} icon={User}>
                                                    <input
                                                        className={`bk-input${errors.name ? " bk-has-error" : ""}`}
                                                        placeholder="e.g. Priya Sharma"
                                                        value={form.name}
                                                        onChange={(e) => setField("name", e.target.value)}
                                                        onBlur={() => handleBlur("name")}
                                                    />
                                                </Field>
                                                <Field label="Email Address" error={errors.email} icon={Mail}>
                                                    <input
                                                        type="email"
                                                        className={`bk-input bk-mono${errors.email ? " bk-has-error" : ""}`}
                                                        placeholder="you@example.com"
                                                        value={form.email}
                                                        onChange={(e) => setField("email", e.target.value)}
                                                        onBlur={() => handleBlur("email")}
                                                    />
                                                </Field>
                                                <Field label="Phone Number" error={errors.phone} icon={Phone}>
                                                    <input
                                                        type="tel"
                                                        className={`bk-input bk-mono${errors.phone ? " bk-has-error" : ""}`}
                                                        placeholder="+91 98765 43210"
                                                        value={form.phone}
                                                        onChange={(e) => setField("phone", e.target.value)}
                                                        onBlur={() => handleBlur("phone")}
                                                    />
                                                </Field>
                                            </div>
                                        </div>

                                        <div className="bk-divider" />

                                        {/* 2 — Event Type */}
                                        <div className="bk-block">
                                            <SectionLabel icon={Camera} label="Event Type" />
                                            <div className="bk-pills">
                                                {EVENT_TYPES.map((et) => (
                                                    <button
                                                        key={et.id}
                                                        type="button"
                                                        className="bk-pill"
                                                        data-active={form.eventType === et.id ? "true" : "false"}
                                                        onClick={() => setField("eventType", et.id)}
                                                    >
                                                        {form.eventType === et.id && <span className="bk-pill-dot" />}
                                                        {et.label}
                                                    </button>
                                                ))}
                                            </div>
                                            <AnimatePresence>
                                                {errors.eventType && touched.eventType && (
                                                    <motion.p
                                                        key="et-err"
                                                        className="bk-error"
                                                        style={{ marginTop: 8 }}
                                                        initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                                                    >
                                                        ↳ {errors.eventType}
                                                    </motion.p>
                                                )}
                                            </AnimatePresence>
                                        </div>

                                        <div className="bk-divider" />

                                        {/* 3 — Logistics */}
                                        <div className="bk-block">
                                            <SectionLabel icon={MapPin} label="Logistics" />
                                            <div className="bk-grid-3">
                                                <Field label="Event Date" error={errors.eventDate} icon={Calendar}>
                                                    <input
                                                        type="date"
                                                        className={`bk-input${errors.eventDate ? " bk-has-error" : ""}`}
                                                        value={form.eventDate}
                                                        onChange={(e) => setField("eventDate", e.target.value)}
                                                        onBlur={() => handleBlur("eventDate")}
                                                        min={new Date().toISOString().split("T")[0]}
                                                    />
                                                </Field>
                                                <Field label="Venue / Location" error={errors.location} icon={MapPin}>
                                                    <input
                                                        className={`bk-input${errors.location ? " bk-has-error" : ""}`}
                                                        placeholder="City or venue name"
                                                        value={form.location}
                                                        onChange={(e) => setField("location", e.target.value)}
                                                        onBlur={() => handleBlur("location")}
                                                    />
                                                </Field>
                                                <Field label="Estimated Guests" error={errors.guestCount} icon={Users}>
                                                    <select
                                                        className={`bk-select${errors.guestCount ? " bk-has-error" : ""}`}
                                                        value={form.guestCount}
                                                        onChange={(e) => setField("guestCount", e.target.value)}
                                                        onBlur={() => handleBlur("guestCount")}
                                                    >
                                                        <option value="" disabled>Select range</option>
                                                        {GUEST_OPTIONS.map((o) => (
                                                            <option key={o.value} value={o.value}>{o.label}</option>
                                                        ))}
                                                    </select>
                                                </Field>
                                            </div>
                                        </div>

                                        <div className="bk-divider" />

                                        {/* 4 — Notes + Submit */}
                                        <div style={{ display: "grid", gap: 24 }}>
                                            <Field label="Vision & Notes" icon={MessageSquare}>
                                                <textarea
                                                    className="bk-textarea"
                                                    placeholder="Describe the vibe, references you love, specific shots you want captured…"
                                                    value={form.message}
                                                    onChange={(e) => setField("message", e.target.value)}
                                                />
                                            </Field>

                                            <div className="bk-bottom-row">
                                                <p className="bk-hint">You'll be redirected to Cal.com to pick your exact time</p>
                                                <button
                                                    type="button"
                                                    className="bk-submit"
                                                    disabled={status === "submitting"}
                                                    onClick={handleSubmit}
                                                >
                                                    {status === "submitting" ? (
                                                        <><span className="bk-spin"><Loader2 size={15} /></span> Processing…</>
                                                    ) : (
                                                        <>Confirm &amp; Schedule <ChevronRight size={15} /></>
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                    </div>
                                    <div className="bk-card-bottom-rule" />
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </section>
        </>
    );
}