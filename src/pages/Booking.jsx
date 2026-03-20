import { useRef, useState, useEffect } from 'react';
import Cal, { getCalApi } from '@calcom/embed-react';
import { motion, useInView } from 'framer-motion';
import { MapPin, Clock, Mail, Phone } from 'lucide-react';
import { Footer } from '../components/ui/FooterSection';

/* ─── Your Cal.com slug ──────────────────────────────── */
const CAL_LINK = 'het-patel-adejx8/bookings';

/* ─── Grain filter ─────────────────────────────────────── */
function Grain({ opacity = 0.07 }) {
  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="bk-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          zIndex: 3, opacity, filter: 'url(#bk-grain)',
        }}
      />
    </>
  );
}

/* ─── Fade up helper ───────────────────────────────────── */
function FadeUp({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -40px 0px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.85, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Animated marquee ticker ──────────────────────────── */
function MarqueeLine() {
  const items = ['Weddings', '✦', 'Concerts', '✦', 'Openings', '✦', 'Brand Films', '✦', 'Exhibitions', '✦'];
  const repeated = [...items, ...items, ...items];
  return (
    <div className="overflow-hidden border-y border-white/8 py-3">
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
        className="flex gap-8 whitespace-nowrap"
      >
        {repeated.map((item, i) => (
          <span
            key={i}
            className="text-[10px] tracking-[0.35em] uppercase font-medium shrink-0"
            style={{ color: item === '✦' ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.35)' }}
          >
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── Contact detail row ───────────────────────────────── */
function Detail({ icon: Icon, label, value, link }) {
  const inner = (
    <div className="flex items-start gap-3 group">
      <div className="mt-0.5 shrink-0">
        <Icon size={13} className="text-white/25 group-hover:text-white/50 transition-colors duration-300" />
      </div>
      <div>
        <p className="text-white/25 text-[9px] tracking-[0.3em] uppercase mb-0.5">{label}</p>
        <p className="text-white/60 text-xs font-light leading-relaxed group-hover:text-white/80 transition-colors duration-300">
          {value}
        </p>
      </div>
    </div>
  );
  return link ? <a href={link} className="block">{inner}</a> : <div>{inner}</div>;
}

/* ════════════════════════════════════════════════════════
   BOOKING PAGE
════════════════════════════════════════════════════════ */
export default function Booking() {
  const [status, setStatus] = useState("booking");

  useEffect(() => {
    (async function() {
      const cal = await getCalApi();
      cal("on", {
        action: "bookingSuccessful",
        callback: () => {
          setStatus("success");
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });
    })();
  }, []);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <div className="flex flex-col lg:flex-row min-h-screen">

        {/* ══════════════════════════
            LEFT — editorial panel
        ══════════════════════════ */}
        <div
          className="relative lg:sticky lg:top-0 lg:h-screen lg:w-[44%] xl:w-[40%] shrink-0 flex flex-col overflow-hidden"
          style={{ paddingTop: '80px' }}
        >
          <Grain opacity={0.09} />

          {/* BG image */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=1200&auto=format&fit=crop&q=80"
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'grayscale(1) brightness(0.18) contrast(1.3)' }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
          </div>

          {/* Corner marks */}
          {['top-6 left-6','top-6 right-6','bottom-6 left-6','bottom-6 right-6'].map((pos) => (
            <div key={pos} className={`absolute ${pos} z-10 pointer-events-none`}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 0v6M0 8h6" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
              </svg>
            </div>
          ))}

          {/* Content */}
          <div className="relative z-10 flex flex-col h-full px-8 md:px-12 py-10 lg:py-12">
            <div className="flex-1 flex flex-col justify-center">

              <motion.p
                key={`label-${status}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="text-white/30 text-[10px] tracking-[0.45em] uppercase mb-10"
              >
                Khushi Films · {status === "success" ? "Booking Confirmed" : "Reserve Your Date"}
              </motion.p>

              <div className="mb-2 overflow-hidden">
                <motion.h1
                  key={`title-${status}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontFamily: "'Playfair Display', serif" }}
                  className="text-[clamp(3rem,7vw,5.5rem)] font-bold leading-[0.92] text-white"
                >
                  {status === "success" ? "Booking" : "Book a"}
                </motion.h1>
              </div>
              <div className="overflow-hidden mb-12">
                <motion.h1
                  key={`subtitle-${status}`}
                  initial={{ y: '110%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 1.1, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
                  style={{ fontFamily: "'Playfair Display', serif", fontStyle: 'italic', fontWeight: 400 }}
                  className="text-[clamp(3rem,7vw,5.5rem)] leading-[0.92] text-white/60"
                >
                  {status === "success" ? "Confirmed" : "Conversation"}
                </motion.h1>
              </div>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.3, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full h-px bg-white/10 mb-10 origin-left"
              />

              {/* What to expect vs Success message */}
              {status === "success" ? (
                <div className="space-y-6 mb-12">
                  <FadeUp delay={0.7}>
                    <div className="flex gap-5 items-start">
                      <div>
                        <p className="text-white/70 text-sm font-medium mb-2">Thank you for reserving your time.</p>
                        <p className="text-white/35 text-xs leading-[1.8] font-light max-w-md">
                          A confirmation email has been sent with your calendar invitation. We look forward to delving into your vision and crafting something extraordinary together.
                        </p>
                      </div>
                    </div>
                  </FadeUp>
                </div>
              ) : (
                <div className="space-y-6 mb-12">
                  {[
                    { n: '01', t: '30-Minute Call', b: 'A focused conversation about your vision — no scripts, no sales pressure.' },
                    { n: '02', t: 'Zero Commitment', b: 'Listen first, decide later. A proposal arrives in 48 hours.' },
                    { n: '03', t: 'Direct With Rakesh', b: 'You speak to the director — not an assistant, not a coordinator.' },
                  ].map((item, i) => (
                    <FadeUp key={item.n} delay={0.7 + i * 0.12}>
                      <div className="flex gap-5 items-start group">
                        <span
                          style={{ fontFamily: "'Playfair Display', serif" }}
                          className="text-xl font-bold text-white/10 shrink-0 w-8 group-hover:text-white/20 transition-colors duration-300"
                        >
                          {item.n}
                        </span>
                        <div>
                          <p className="text-white/70 text-sm font-medium mb-0.5">{item.t}</p>
                          <p className="text-white/35 text-xs leading-[1.8] font-light">{item.b}</p>
                        </div>
                      </div>
                    </FadeUp>
                  ))}
                </div>
              )}
            </div>


          </div>
        </div>

        {/* ══════════════════════════
            RIGHT — Cal.com embed
        ══════════════════════════ */}
        <div
          className="flex-1 relative flex flex-col"
          style={{ paddingTop: '80px', background: '#0a0a0a' }}
        >
          {/* Vertical separator */}
          <div className="hidden lg:block absolute top-0 left-0 w-px h-full bg-white/5" />

          {/* Header row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="px-8 md:px-12 pt-10 pb-6 flex items-center justify-between border-b border-white/5"
          >
            <div>
              <p className="text-white/25 text-[10px] tracking-[0.35em] uppercase mb-1">Step 01 of 01</p>
              <p style={{ fontFamily: "'Playfair Display', serif" }} className="text-white/80 text-lg font-semibold">
                Choose Your Date &amp; Time
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/20 animate-pulse" />
              <span className="text-white/25 text-[10px] tracking-[0.2em] uppercase">Live</span>
            </div>
          </motion.div>

          {/* Cal embed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 px-4 md:px-8 py-8"
          >
            <div className="h-full min-h-[600px]">
              <Cal
                namespace={CAL_LINK}
                calLink={CAL_LINK}
                style={{ width: '100%', height: '100%', minHeight: '600px', overflow: 'hidden' }}
                config={{
                  layout: 'month_view',
                  theme: 'dark',
                  brandColor: '#ffffff',
                  hideEventTypeDetails: '0',
                }}
              />
            </div>
          </motion.div>

          {/* Trust footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="px-8 md:px-12 py-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <p className="text-white/20 text-[10px] tracking-[0.25em] uppercase">
              Secure scheduling via Cal.com · Your details stay private
            </p>
            <p className="text-white/20 text-[10px] tracking-[0.2em] uppercase">
              Khushi Films · Est. 2015
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
