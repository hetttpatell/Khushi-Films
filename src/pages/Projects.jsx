import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '../components/ui/FooterSection';
import { ProjectsCTA } from '../components/ui/ProjectsCTA';

// --- ChronicleButton Component ---
const buttonStyles = `
.chronicleButton {
  --chronicle-button-border-radius: var(--general-rounding, 8px);
  border-radius: var(--chronicle-button-border-radius);
  display: flex;
  font-family: var(--font-primary);
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  padding: 1rem 1.7rem;
  cursor: pointer;
  border: none;
  font-weight: 600;
  background: var(--chronicle-button-background);
  color: var(--chronicle-button-foreground);
  transition: background 0.4s linear, color 0.4s linear;
  will-change: background, color;
  position: relative;
}

.chronicleButton:hover {
  background: var(--chronicle-button-hover-background);
  color: var(--chronicle-button-hover-foreground);
}

.chronicleButton span {
  position: relative;
  display: block;
  perspective: 108px;
}

.chronicleButton span:nth-of-type(2) {
  position: absolute;
}

.chronicleButton em {
  font-style: normal;
  display: inline-block;
  font-size: 1.05rem;
  color: inherit;
  will-change: transform, opacity, color, transition;
  transition: transform 0.55s cubic-bezier(.645,.045,.355,1), opacity 0.35s linear 0.2s, color 0.4s linear;
}

.chronicleButton span:nth-of-type(1) em {
  transform-origin: top;
}
.chronicleButton span:nth-of-type(2) em {
  opacity: 0;
  transform: rotateX(-90deg) scaleX(.9) translate3d(0,10px,0);
  transform-origin: bottom;
}
.chronicleButton:hover span:nth-of-type(1) em {
  opacity: 0;
  transform: rotateX(90deg) scaleX(.9) translate3d(0,-10px,0);
}
.chronicleButton:hover span:nth-of-type(2) em {
  opacity: 1;
  transform: rotateX(0deg) scaleX(1) translateZ(0);
  transition: transform 0.75s cubic-bezier(.645,.045,.355,1), opacity 0.35s linear 0.3s, color 0.4s linear;
}
`;

const ChronicleButton = ({
  text,
  onClick,
  hoverColor = "#a594fd",
  width = "180px",
  borderRadius = "8px",
  customBackground = "#fff",
  customForeground = "#111014",
  hoverForeground = "#111014",
}) => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!document.getElementById("chronicle-button-style")) {
      const style = document.createElement("style");
      style.id = "chronicle-button-style";
      style.innerHTML = buttonStyles;
      document.head.appendChild(style);
    }
  }, []);

  const buttonStyle = {
    "--chronicle-button-background": customBackground,
    "--chronicle-button-foreground": customForeground,
    "--chronicle-button-hover-background": hoverColor,
    "--chronicle-button-hover-foreground": hoverForeground,
    "--chronicle-button-border-radius": borderRadius,
    width,
    borderRadius,
  };

  return (
    <button className="chronicleButton" onClick={onClick} style={buttonStyle} type="button">
      <span><em>{text}</em></span>
      <span><em>{text}</em></span>
    </button>
  );
};

// --- DicedHeroSection Component ---

const DicedHeroSection = ({
  topText,
  mainText,
  subMainText,
  buttonText,
  slides,
  onMainButtonClick,
  onGridImageHover,
  onGridImageClick,
  topTextStyle,
  mainTextStyle,
  subMainTextStyle,
  buttonStyle = {},
  componentBorderRadius = '0px',
  separatorColor = '#005baa',
  maxContentWidth = '1536px',
  mobileBreakpoint = 1000,
  isRTL = false,
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  const isRTLCheck = (text) => /[\u0590-\u05FF\u0600-\u06FF\u0700-\u074F]/.test(text || "");

  useEffect(() => {
    const checkMobile = () => {
      if (containerRef.current) {
        setIsMobile(containerRef.current.offsetWidth < mobileBreakpoint);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [mobileBreakpoint]);

  const getGradientStyle = (gradient) => {
    if (gradient) {
      return {
        backgroundImage: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    }
    return {};
  };

  return (
    <section
      ref={containerRef}
      style={{
        borderRadius: componentBorderRadius,
        padding: '2rem 5vw',
        display: 'flex',
        flexDirection: isMobile ? 'column' : isRTL ? 'row-reverse' : 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        maxWidth: maxContentWidth,
        margin: '0 auto',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div
        style={{
          flex: 1.2,
          marginRight: isMobile ? 0 : isRTL ? 0 : '4rem',
          marginLeft: isMobile ? 0 : isRTL ? '4rem' : 0,
          textAlign: isMobile ? 'center' : isRTL ? 'right' : 'left',
          alignItems: isMobile ? 'center' : isRTL ? 'flex-end' : 'flex-start',
          maxWidth: isMobile ? '100%' : '55%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingBottom: isMobile ? '4rem' : 0,
        }}
      >
        <div>
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            style={{
              ...topTextStyle,
              ...getGradientStyle(topTextStyle?.gradient),
              direction: isRTLCheck(topText) ? 'rtl' : 'ltr',
              display: 'block',
              marginBottom: '0.75rem',
            }}
          >
            {topText}
          </motion.span>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{
              ...mainTextStyle,
              direction: isRTLCheck(mainText) ? 'rtl' : 'ltr',
              lineHeight: 1.1,
              marginBottom: '1rem',
            }}
          >
            <span style={{ ...getGradientStyle(mainTextStyle?.gradient), display: 'inline-block', paddingBottom: '0.1em' }}>
              {mainText}
            </span>
          </motion.h2>

          {/* Separator removed per user request */}

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{
              ...subMainTextStyle,
              ...getGradientStyle(subMainTextStyle?.gradient),
              direction: isRTLCheck(subMainText) ? 'rtl' : 'ltr',
              lineHeight: 1.6,
            }}
          >
            {subMainText}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.4 }}
          style={{
            marginTop: '2.5rem',
            display: 'flex',
            justifyContent: isMobile ? 'center' : isRTL ? 'flex-end' : 'flex-start',
          }}
        >
          <ChronicleButton
            text={buttonText}
            onClick={onMainButtonClick}
            hoverColor={buttonStyle?.hoverColor}
            hoverForeground={buttonStyle?.hoverForeground}
            borderRadius={buttonStyle?.borderRadius}
            customBackground={buttonStyle?.backgroundColor}
            customForeground={buttonStyle?.color}
          />
        </motion.div>
      </div>

      <div
        style={{
          flex: 0.8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: isMobile ? '100%' : '45%',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px',
            width: '100%',
            maxWidth: '500px',
            aspectRatio: '1 / 1',
          }}
        >
          {slides.slice(0, 4).map((slide, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              style={{
                position: 'relative',
                width: '100%',
                paddingBottom: '100%', // Makes it a perfect square
                overflow: 'hidden',
                borderRadius: '16px', // Standard rounded corners for images without the warped clipping
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={slide.image}
                alt={slide.title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  transition: 'transform 0.5s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  if (onGridImageHover) onGridImageHover(index);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                onClick={() => onGridImageClick && onGridImageClick(index)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};


function Grain({ opacity = 0.07 }) {
  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <filter id="prj-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>
      <div
        style={{
          position: 'fixed', inset: 0, pointerEvents: 'none',
          zIndex: 3, opacity, filter: 'url(#prj-grain)',
        }}
      />
    </>
  );
}

// --- Main Projects Page ---

export default function Projects() {
  const [modalData, setModalData] = useState({ isOpen: false, slides: [], currentIndex: 0 });
  const [direction, setDirection] = useState(0);

  const openModal = (slides, index) => {
    setDirection(0);
    setModalData({ isOpen: true, slides, currentIndex: index });
  };

  const closeModal = () => {
    setModalData(prev => ({ ...prev, isOpen: false }));
  };

  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    setDirection(1);
    setModalData(prev => ({ ...prev, currentIndex: (prev.currentIndex + 1) % prev.slides.length }));
  };

  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    setDirection(-1);
    setModalData(prev => ({ ...prev, currentIndex: (prev.currentIndex - 1 + prev.slides.length) % prev.slides.length }));
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    if (e) e.stopPropagation();
    const swipe = offset.x;
    if (swipe < -60) {
      nextSlide();
    } else if (swipe > 60) {
      prevSlide();
    }
  };

  const project1Slides = [
    { title: "Film Still 1", image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=2000&auto=format&fit=crop" },
    { title: "Film Still 2", image: "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=2000&auto=format&fit=crop" },
    { title: "Film Still 3", image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2000&auto=format&fit=crop" },
    { title: "Film Still 4", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop" },
  ];

  const project2Slides = [
    { title: "Wedding 1", image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2000&auto=format&fit=crop" },
    { title: "Wedding 2", image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop" },
    { title: "Wedding 3", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2000&auto=format&fit=crop" },
    { title: "Wedding 4", image: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?q=80&w=2000&auto=format&fit=crop" },
  ];

  const project3Slides = [
    { title: "Commercial 1", image: "https://images.unsplash.com/photo-1590130836511-d1d4d80d2874?q=80&w=2000&auto=format&fit=crop" },
    { title: "Commercial 2", image: "https://images.unsplash.com/photo-1517404215738-15263e9f9178?q=80&w=2000&auto=format&fit=crop" },
    { title: "Commercial 3", image: "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?q=80&w=2000&auto=format&fit=crop" },
    { title: "Commercial 4", image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop" },
  ];

  const sharedColors = {
    topText: "var(--color-secondary)",
    subText: "var(--color-text-light)",
    separator: "transparent",
    btnBg: "#e5e7eb", // Light grey
    btnFg: "#000000",
    btnHoverBg: "#ffffff",
    btnHoverFg: "#000000",
  };

  return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-start text-white bg-black w-full overflow-hidden relative">
      
      {/* Background and Grain */}
      <Grain opacity={0.09} />
      <div className="fixed inset-0 z-0 pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=2000&auto=format&fit=crop&q=80"
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: 'grayscale(1) brightness(0.18) contrast(1.3)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/60" />
      </div>
      <h1 className="text-5xl md:text-7xl font-bold mb-10 text-center text-white drop-shadow-md" style={{ fontFamily: "'Playfair Display', serif", zIndex: 10, position: 'relative' }}>
        Projects
      </h1>

      <div className="w-full flex flex-col gap-24 md:gap-32 mt-10 pb-24">
        {/* Project 1 - LTR */}
        <DicedHeroSection
          topText="Cinematic Wedding Films"
          mainText="Weddings"
          subMainText="From the first look to the last dance — we craft emotional, cinematic wedding films that capture every unscripted moment, tear, and laugh your day has to offer."
          buttonText="Watch Films"
          slides={project1Slides}
          onGridImageClick={(index) => openModal(project1Slides, index)}
          topTextStyle={{ color: sharedColors.topText, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          mainTextStyle={{
            fontSize: "clamp(3rem, 6vw, 5rem)",
            color: "white",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
          }}
          subMainTextStyle={{ color: sharedColors.subText, fontSize: "1.125rem", opacity: 0.8 }}
          buttonStyle={{
            backgroundColor: sharedColors.btnBg,
            color: sharedColors.btnFg,
            borderRadius: "2rem",
            hoverColor: sharedColors.btnHoverBg,
            hoverForeground: sharedColors.btnHoverFg,
          }}
          separatorColor={sharedColors.separator}
          isRTL={false}
        />

        {/* Project 2 - RTL (Reversed Layout) */}
        <DicedHeroSection
          topText="Precious Milestones"
          mainText="New Beginnings"
          subMainText="The anticipation, the joy, the love in the room — we document the arrival of your little one with warmth and intimacy, so these memories live on for generations."
          buttonText="View Gallery"
          slides={project2Slides}
          onGridImageClick={(index) => openModal(project2Slides, index)}
          topTextStyle={{ color: sharedColors.topText, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          mainTextStyle={{
            fontSize: "clamp(3rem, 6vw, 5rem)",
            color: "white",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
          }}
          subMainTextStyle={{ color: sharedColors.subText, fontSize: "1.125rem", opacity: 0.8 }}
          buttonStyle={{
            backgroundColor: sharedColors.btnBg,
            color: sharedColors.btnFg,
            borderRadius: "2rem",
            hoverColor: sharedColors.btnHoverBg,
            hoverForeground: sharedColors.btnHoverFg,
          }}
          separatorColor={sharedColors.separator}
          isRTL={true}
        />

        {/* Project 3 - LTR */}
        <DicedHeroSection
          topText="Live Event Coverage"
          mainText="Concerts"
          subMainText="High-energy, multi-camera concert coverage that captures the electric atmosphere on stage and in the crowd. Every beat, every light, every crowd moment — preserved."
          buttonText="See Gallery"
          slides={project3Slides}
          onGridImageClick={(index) => openModal(project3Slides, index)}
          topTextStyle={{ color: sharedColors.topText, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          mainTextStyle={{
            fontSize: "clamp(3rem, 6vw, 5rem)",
            color: "white",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
          }}
          subMainTextStyle={{ color: sharedColors.subText, fontSize: "1.125rem", opacity: 0.8 }}
          buttonStyle={{
            backgroundColor: sharedColors.btnBg,
            color: sharedColors.btnFg,
            borderRadius: "2rem",
            hoverColor: sharedColors.btnHoverBg,
            hoverForeground: sharedColors.btnHoverFg,
          }}
          separatorColor={sharedColors.separator}
          isRTL={false}
        />
        {/* project -  4 */}
        <DicedHeroSection
          topText="Brand Launch Moments"
          mainText="First Chapter"
          subMainText="Your grand opening is your first impression — we make it unforgettable on film. Ribbon cuts, speeches, guest arrivals, and the energy of a new chapter, all in one story."
          buttonText="View Gallery"
          slides={project2Slides}
          onGridImageClick={(index) => openModal(project2Slides, index)}
          topTextStyle={{ color: sharedColors.topText, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}
          mainTextStyle={{
            fontSize: "clamp(3rem, 6vw, 5rem)",
            color: "white",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
          }}
          subMainTextStyle={{ color: sharedColors.subText, fontSize: "1.125rem", opacity: 0.8 }}
          buttonStyle={{
            backgroundColor: sharedColors.btnBg,
            color: sharedColors.btnFg,
            borderRadius: "2rem",
            hoverColor: sharedColors.btnHoverBg,
            hoverForeground: sharedColors.btnHoverFg,
          }}
          separatorColor={sharedColors.separator}
          isRTL={true}
        />
      </div>

      {/* Embedded Simple CTA block before Footer */}
      <ProjectsCTA />

      <div className="w-full mt-auto">
        <Footer />
      </div>

      {/* Fullscreen Photo Modal */}
      <AnimatePresence>
        {modalData.isOpen && modalData.slides.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeModal}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0, 0, 0, 0.95)',
              zIndex: 9990,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '2rem',
              backdropFilter: 'blur(10px)',
              overflow: 'hidden',
              touchAction: 'none' // Prevent pull-to-refresh on mobile
            }}
          >
            <style>{`
              .lb-btn {
                position: fixed;
                background: rgba(255,255,255,0.05);
                border: 1px solid rgba(255,255,255,0.15);
                color: white;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 10;
                transition: all 0.3s ease;
                backdrop-filter: blur(4px);
                user-select: none;
              }
              .lb-btn:hover { background: white; color: black; }
              .lb-close { top: 2rem; right: 2rem; width: 44px; height: 44px; font-size: 1.2rem; }
              .lb-nav { top: 50%; transform: translateY(-50%); width: 54px; height: 54px; font-size: 2rem; }
              .lb-prev { left: 2rem; }
              .lb-next { right: 2rem; }
              .lb-counter {
                margin-top: 1.5rem; color: rgba(255,255,255,0.8); font-size: 1rem; letter-spacing: 0.1em;
                text-transform: uppercase; font-weight: 600; font-family: var(--font-primary);
                background: rgba(0,0,0,0.5); padding: 8px 16px; border-radius: 20px;
                backdrop-filter: blur(6px); pointer-events: none;
              }
              @media (max-width: 768px) {
                .lb-close { top: 1rem; right: 1rem; width: 36px; height: 36px; font-size: 1rem; }
                .lb-nav { width: 40px; height: 40px; font-size: 1.5rem; }
                .lb-prev { left: 0.5rem; }
                .lb-next { right: 0.5rem; }
                .lb-counter { margin-top: 1rem; font-size: 0.85rem; padding: 6px 12px; }
              }
            `}</style>

            <button className="lb-btn lb-close" onClick={closeModal}>✕</button>
            <button className="lb-btn lb-nav lb-prev" onClick={prevSlide}>‹</button>
            <button className="lb-btn lb-nav lb-next" onClick={nextSlide}>›</button>

            <motion.div
              key={modalData.currentIndex}
              initial={{ opacity: 0, x: direction * 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction * -50 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.7}
              onDragEnd={handleDragEnd}
              style={{ 
                position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'grab'
              }}
              whileTap={{ cursor: "grabbing" }}
              onClick={(e) => e.stopPropagation()} // Prevent modal close when tapping image
            >
              <img
                src={modalData.slides[modalData.currentIndex].image}
                alt="Fullscreen Preview"
                style={{
                  maxHeight: '80vh',
                  maxWidth: '100%',
                  objectFit: 'contain',
                  borderRadius: '12px',
                  pointerEvents: 'none', // Critical for framer-motion drag on images
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                }}
              />
              <div className="lb-counter">
                {modalData.currentIndex + 1} / {modalData.slides.length}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
