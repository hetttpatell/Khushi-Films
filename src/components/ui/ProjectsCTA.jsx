import React from "react";
import { Link } from "react-router-dom";

export const ProjectsCTA = () => {
  return (
    <div className="relative z-[60] pointer-events-auto mx-auto flex w-full max-w-4xl flex-col items-center justify-center gap-y-8 border-y border-white/10 bg-[radial-gradient(35%_80%_at_50%_0%,rgba(255,255,255,0.06),transparent)] px-6 py-20 mt-32 mb-16">

      {/* Corner Plus Icons */}
      <svg className="absolute top-[-12px] left-[-12px] w-6 h-6 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <svg className="absolute top-[-12px] right-[-12px] w-6 h-6 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <svg className="absolute bottom-[-12px] left-[-12px] w-6 h-6 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 5v14M5 12h14" />
      </svg>
      <svg className="absolute bottom-[-12px] right-[-12px] w-6 h-6 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
        <path d="M12 5v14M5 12h14" />
      </svg>

      {/* Decorative lines */}
      <div className="-inset-y-6 pointer-events-none absolute left-0 w-px border-l border-white/10" />
      <div className="-inset-y-6 pointer-events-none absolute right-0 w-px border-r border-white/10" />
      <div className="-z-10 absolute top-0 left-1/2 h-full border-l border-dashed border-white/10" />

      <div className="space-y-4 max-w-2xl text-center z-10">
        <h2 className="text-center font-bold text-4xl md:text-5xl tracking-tight text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
          Seen our work?
        </h2>
        <p className="text-center text-white/70 text-lg leading-relaxed px-4">
          Now let&apos;s make a new gallery together and capture the moments that truly matter to you.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6 z-20 text-white">
        <Link
          to="/booking"
          className="relative group z-50 pointer-events-auto flex items-center justify-center gap-2 rounded-full bg-white text-black px-8 py-3.5 font-bold transition-all hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_25px_rgba(255,255,255,0.25)] cursor-pointer border-none outline-none"
        >
          Book a call now
        </Link>
      </div>
    </div>
  );
};
