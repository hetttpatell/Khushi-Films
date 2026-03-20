import { useRef } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { Footer } from '../components/ui/FooterSection';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   Reusable animation wrappers
───────────────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -80px 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function FadeIn({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -60px 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1.1, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Grain overlay — matches HalideHero aesthetic
───────────────────────────────────────────── */
function Grain() {
  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="about-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          zIndex: 2, opacity: 0.08, filter: 'url(#about-grain)',
        }}
      />
    </>
  );
}

/* ─────────────────────────────────────────────
   Stat item
───────────────────────────────────────────── */
function Stat({ number, label, delay }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2"
    >
      <span
        style={{ fontFamily: "'Playfair Display', serif" }}
        className="text-6xl md:text-7xl font-bold text-white leading-none"
      >
        {number}
      </span>
      <span className="text-xs tracking-[0.3em] uppercase text-white/40 font-medium">
        {label}
      </span>
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Main About Page
───────────────────────────────────────────── */
export default function About() {
  const heroRef = useRef(null);
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });
  const heroY = useTransform(heroScroll, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(heroScroll, [0, 0.7], [1, 0]);

  return (
    <div className="bg-black text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════
          SECTION 1 — CINEMATIC HERO
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <Grain />

        {/* Parallax background image */}
        <motion.div
          style={{ y: heroY }}
          className="absolute inset-0 z-0"
        >
          <img
            src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1800&auto=format&fit=crop&q=80"
            alt="Cinematic background"
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(1) brightness(0.25) contrast(1.2)' }}
          />
          {/* Gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black" />
        </motion.div>

        {/* Hero copy */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 flex flex-col items-center text-center px-6"
        >
          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, letterSpacing: '0.1em' }}
            animate={{ opacity: 1, letterSpacing: '0.4em' }}
            transition={{ duration: 1.4, delay: 0.3, ease: 'easeOut' }}
            className="text-white/40 text-[10px] md:text-xs uppercase font-medium mb-10 tracking-[0.4em]"
          >
            The Visionary Behind The Lens
          </motion.p>

          {/* Name */}
          <div className="overflow-hidden mb-2">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-[clamp(3.5rem,12vw,9rem)] font-bold leading-[0.95] tracking-tight text-white"
            >
              Rakesh
            </motion.h1>
          </div>
          <div className="overflow-hidden">
            <motion.h1
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              transition={{ duration: 1.1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }}
              style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 }}
              className="text-[clamp(3.5rem,12vw,9rem)] leading-[0.95] tracking-tight text-white/80"
            >
              Patel
            </motion.h1>
          </div>

          {/* Divider line */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
            className="w-24 h-px bg-white/30 my-8 origin-left"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1, ease: 'easeOut' }}
            className="text-white/50 text-xs md:text-sm tracking-widest uppercase max-w-xs"
          >
            Founder & Director — Khushi Films
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3"
        >
          <span className="text-white/25 text-[10px] tracking-[0.3em] uppercase">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </motion.div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 2 — THE STORY (editorial layout)
      ══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden">
        <Grain />

        {/* Large background label */}
        <div
          className="absolute top-16 right-0 text-[clamp(5rem,18vw,14rem)] font-bold text-white/[0.025] leading-none pointer-events-none select-none pr-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Origin
        </div>

        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image block */}
          <FadeIn delay={0.1} className="relative">
            <div className="relative">
              {/* Main portrait */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                <img
                  src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=80"
                  alt="Rakesh Patel — Director, Khushi Films"
                  className="w-full h-full object-cover"
                  style={{ filter: 'grayscale(0.3) contrast(1.1)' }}
                />
                {/* Film-grade overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute inset-0 mix-blend-overlay bg-gradient-to-br from-transparent to-black/30" />
              </div>

              {/* Floating credential badge */}
              <motion.div
                initial={{ opacity: 0, x: 30, y: 30 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="absolute -bottom-6 -right-6 md:-right-10 bg-black border border-white/10 p-5 backdrop-blur-sm"
                style={{ zIndex: 20 }}
              >
                <p className="text-white/40 text-[10px] tracking-[0.3em] uppercase mb-1">Est.</p>
                <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-white text-3xl font-bold">2015</p>
                <p className="text-white/40 text-[10px] tracking-[0.2em] uppercase mt-1">Khushi Films</p>
              </motion.div>

              {/* Decorative border offset */}
              <div
                className="absolute -top-4 -left-4 w-full h-full border border-white/8 pointer-events-none"
                style={{ zIndex: -1 }}
              />
            </div>
          </FadeIn>

          {/* Text block */}
          <div className="flex flex-col justify-center gap-10">
            <FadeUp delay={0.1}>
              <p className="text-white/35 text-xs tracking-[0.35em] uppercase mb-6">
                01 — The Story
              </p>
              <h2
                style={{ fontFamily: "'Playfair Display', serif" }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] text-white"
              >
                Every Frame<br />
                <span style={{ fontStyle: 'italic', fontWeight: 400 }} className="text-white/70">
                  Tells a Truth
                </span>
              </h2>
            </FadeUp>

            <FadeUp delay={0.2}>
              <p className="text-white/60 text-base md:text-lg leading-[1.9] font-light">
                Born in Ahmedabad and shaped by a deep love for visual storytelling,
                Rakesh Patel founded Khushi Films with a single conviction — that real
                moments, captured honestly, are more powerful than any staged perfection.
              </p>
            </FadeUp>

            <FadeUp delay={0.3}>
              <p className="text-white/45 text-sm md:text-base leading-[1.9] font-light">
                Over a decade behind the lens has taken him from intimate village ceremonies
                in Rajasthan to rooftop celebrations in Dubai, from sold-out concerts in Mumbai
                to grand hotel openings across three continents. Each project carries the same
                quiet philosophy: disappear into the room, earn the trust of every subject,
                and let the story unfold on its own terms.
              </p>
            </FadeUp>

            <FadeUp delay={0.4}>
              <div className="flex items-center gap-6 pt-4 border-t border-white/8">
                <div>
                  <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase mb-1">Specialisation</p>
                  <p className="text-white/70 text-sm tracking-wide">Weddings · Concerts · Brand Films · Openings</p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="text-white/25 text-[10px] tracking-[0.3em] uppercase mb-1">Based In</p>
                  <p className="text-white/70 text-sm tracking-wide">Ahmedabad, India</p>
                </div>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 3 — THE MANIFESTO (full bleed quote)
      ══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 overflow-hidden">
        <Grain />

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1800&auto=format&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(1) brightness(0.12) contrast(1.3)' }}
          />
          <div className="absolute inset-0 bg-black/70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-12 text-center">
          <FadeUp>
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-12">
              02 — Philosophy
            </p>
          </FadeUp>

          {/* Opening quote mark */}
          <FadeIn delay={0.1}>
            <div
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-[8rem] leading-none text-white/10 select-none -mb-8"
            >
              "
            </div>
          </FadeIn>

          <FadeUp delay={0.2}>
            <blockquote
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.4] text-white/90 italic"
            >
              I don&apos;t capture events.<br className="hidden md:block" />
              I capture the{' '}
              <span className="not-italic font-semibold text-white">
                feeling
              </span>{' '}
              that lives inside them — the glance before the vows, the tear no one else noticed,
              the laugh that lasted two seconds but meant everything.
            </blockquote>
          </FadeUp>

          <FadeUp delay={0.35}>
            <div className="flex items-center justify-center gap-4 mt-16">
              <div className="w-12 h-px bg-white/30" />
              <p className="text-white/40 text-xs tracking-[0.3em] uppercase">Rakesh Patel</p>
              <div className="w-12 h-px bg-white/30" />
            </div>
          </FadeUp>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 4 — BY THE NUMBERS
      ══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-40 px-6 overflow-hidden border-t border-white/5">
        <Grain />

        <div className="max-w-6xl mx-auto">
          <FadeUp className="text-center mb-24">
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-4">03 — A Decade in Numbers</p>
            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              The Work Speaks
            </h2>
          </FadeUp>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 md:gap-6">
            <Stat number="10+" label="Years of craft" delay={0} />
            <Stat number="300+" label="Films delivered" delay={0.1} />
            <Stat number="3" label="Continents covered" delay={0.2} />
            <Stat number="12+" label="Industry awards" delay={0.3} />
          </div>

          {/* Horizontal divider with label */}
          <FadeIn delay={0.4} className="mt-24 flex items-center gap-6">
            <div className="flex-1 h-px bg-white/8" />
            <p className="text-white/20 text-[10px] tracking-[0.4em] uppercase shrink-0">Khushi Films · Est. 2015</p>
            <div className="flex-1 h-px bg-white/8" />
          </FadeIn>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 5 — THE CRAFT (editorial 2-col)
      ══════════════════════════════════════════ */}
      <section className="relative py-32 md:py-48 px-6 md:px-12 lg:px-24 overflow-hidden">
        <Grain />

        {/* Large watermark */}
        <div
          className="absolute bottom-0 left-0 text-[clamp(5rem,18vw,14rem)] font-bold text-white/[0.02] leading-none pointer-events-none select-none pl-6"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Craft
        </div>

        <div className="max-w-7xl mx-auto">
          <FadeUp className="mb-20">
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-4">04 — The Craft</p>
            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1]"
            >
              Cinematic precision,<br />
              <span style={{ fontStyle: 'italic', fontWeight: 400 }} className="text-white/60">
                human instinct.
              </span>
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/5">
            {[
              {
                icon: '◎',
                title: 'Multi-Camera Direction',
                body: 'Every significant event is covered with a minimum three-camera setup — ensuring every angle, every reaction, every unscripted second is never missed.',
              },
              {
                icon: '▣',
                title: 'Aerial Cinematography',
                body: 'Licensed drone operations across India and UAE, delivering sweeping establishment shots and perspective that ground your film in place and grandeur.',
              },
              {
                icon: '◈',
                title: 'Colour Science',
                body: 'A bespoke in-house LUT library built over ten years in DaVinci Resolve. Every film gets a grade tuned to its mood — not a preset dropped on the timeline.',
              },
            ].map((item, i) => (
              <FadeUp key={item.title} delay={i * 0.12}>
                <div className="bg-black p-10 h-full flex flex-col gap-6 group hover:bg-white/[0.02] transition-colors duration-500">
                  <span className="text-white/20 text-2xl font-mono">{item.icon}</span>
                  <h3
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    className="text-xl font-semibold text-white leading-snug"
                  >
                    {item.title}
                  </h3>
                  <p className="text-white/45 text-sm leading-[1.9] font-light flex-1">
                    {item.body}
                  </p>
                  <div className="w-8 h-px bg-white/20 group-hover:w-16 transition-all duration-500" />
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 6 — BEHIND THE SCENES (image grid)
      ══════════════════════════════════════════ */}
      <section className="relative py-24 px-6 md:px-12 lg:px-24 overflow-hidden">
        <Grain />

        <FadeUp className="mb-14">
          <p className="text-white/30 text-xs tracking-[0.4em] uppercase">05 — Behind The Lens</p>
        </FadeUp>

        {/* Asymmetric image grid */}
        <div className="grid grid-cols-12 gap-3 max-w-7xl mx-auto">
          <FadeIn delay={0} className="col-span-12 md:col-span-7 row-span-2">
            <div className="overflow-hidden h-[420px] md:h-[560px]">
              <img
                src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=1200&auto=format&fit=crop&q=80"
                alt="On set"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ filter: 'grayscale(0.2) contrast(1.05)' }}
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.1} className="col-span-6 md:col-span-5">
            <div className="overflow-hidden h-[200px] md:h-[270px]">
              <img
                src="https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=80"
                alt="Equipment"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ filter: 'grayscale(0.3) contrast(1.05)' }}
              />
            </div>
          </FadeIn>

          <FadeIn delay={0.2} className="col-span-6 md:col-span-5">
            <div className="overflow-hidden h-[200px] md:h-[270px]">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80"
                alt="Cinematic frame"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                style={{ filter: 'grayscale(0.3) contrast(1.05)' }}
              />
            </div>
          </FadeIn>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 7 — RECOGNITION
      ══════════════════════════════════════════ */}
      <section className="relative py-32 px-6 md:px-12 lg:px-24 border-t border-white/5 overflow-hidden">
        <Grain />

        <div className="max-w-6xl mx-auto">
          <FadeUp className="mb-16">
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-4">06 — Recognition</p>
            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-4xl md:text-5xl font-bold text-white"
            >
              The Industry Agrees
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { award: 'Best Wedding Film', body: 'India Wedding Awards', year: '2022' },
              { award: 'Top 10 Videographers', body: 'Wedding Sutra Editorial', year: '2021' },
              { award: 'Featured Vendor', body: 'Vogue India Weddings', year: '2023' },
              { award: 'Best Cinematic Reel', body: 'South Asia Film Circle', year: '2022' },
            ].map((item, i) => (
              <FadeUp key={item.award} delay={i * 0.1}>
                <div className="flex items-center gap-6 p-8 border border-white/8 hover:border-white/16 transition-colors duration-400 group">
                  <span
                    style={{ fontFamily: "'Playfair Display', serif" }}
                    className="text-4xl font-bold text-white/10 group-hover:text-white/20 transition-colors duration-400 w-12 shrink-0"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <p
                      style={{ fontFamily: "'Playfair Display', serif" }}
                      className="text-white text-xl font-semibold mb-1"
                    >
                      {item.award}
                    </p>
                    <p className="text-white/40 text-sm">{item.body}</p>
                  </div>
                  <span className="text-white/20 text-xs tracking-widest shrink-0">{item.year}</span>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          SECTION 8 — CLOSING CTA
      ══════════════════════════════════════════ */}
      <section className="relative py-40 md:py-56 px-6 overflow-hidden">
        <Grain />

        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&auto=format&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: 'grayscale(1) brightness(0.1) contrast(1.4)' }}
          />
          <div className="absolute inset-0 bg-black/75" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <FadeUp>
            <p className="text-white/30 text-xs tracking-[0.4em] uppercase mb-8">
              The Lens Is Ready
            </p>
            <h2
              style={{ fontFamily: "'Playfair Display', serif" }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] mb-6"
            >
              Your Moment<br />
              <span style={{ fontStyle: 'italic', fontWeight: 400 }} className="text-white/70">
                Deserves More
              </span>
            </h2>
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="text-white/45 text-lg leading-relaxed max-w-xl mx-auto mb-14 font-light">
              Not just documented. Not just recorded.
              Crafted into something you&apos;ll watch twenty years from now
              and feel exactly what you felt that day.
            </p>
          </FadeUp>

          <FadeIn delay={0.4} className="mt-20">
            <p className="text-white/20 text-xs tracking-[0.3em] uppercase">
              hello@khushifilms.com · +91 98765 43210 · Ahmedabad, India
            </p>
          </FadeIn>
        </div>
      </section>

      <Footer />
    </div>
  );
}
