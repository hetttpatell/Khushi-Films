import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Footer } from '../components/ui/FooterSection';
import { ProjectsCTA } from '../components/ui/ProjectsCTA';
import { ProjectGalleryModal } from '../components/ui/ProjectGalleryModal';

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
                paddingBottom: '100%',
                overflow: 'hidden',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
              }}
            >
              <img
                src={slide.image || slide.url}
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
                data-cursor="media"
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
  const [galleryModal, setGalleryModal] = useState({
    isOpen: false,
    items: [],
    title: ""
  });

  const openGallery = (title, items) => {
    setGalleryModal({ isOpen: true, items, title });
  };

  const closeGallery = () => {
    setGalleryModal(prev => ({ ...prev, isOpen: false }));
  };

  // --- External Links ---
  // Add your Dropbox or external links here. If provided, the button will redirect to the link.
  const galleryLinks = {
    wedding: "https://www.dropbox.com/scl/fo/rju5ewi1enp3qzpwaud24/AAWzcu2e3bhwkSL_V_4uTKI?rlkey=zkgqlay6u5xq55hao0g27x4vb&st=gz3hdbay&dl=0", // e.g., "https://www.dropbox.com/scl/fo/..."
    prewedding: "https://www.dropbox.com/scl/fo/2xomk2yc0sd6pds3d4xrz/AHpb8A89VoIbdPPgAWPRDfQ?rlkey=v51zkzcyx3s26tykgc6ur3ixo&st=l21ttndj&dl=0",
    baby: "https://www.dropbox.com/scl/fo/uff7kbs6ii4qi49bp3bnc/AB7RHwPyhc7Wmo13k-l35z8?rlkey=ev0qde6qhckb358kc0nrnun3n&st=kygr0v3o&dl=0",
    concert: "",
    birthday: "https://www.dropbox.com/scl/fo/i2z7hhjoaxelg3upyfkws/ANqjSnOIQKGZ4ITwqgOd8ME?rlkey=kyt5sg4sr521mn8813yyj3tio&st=y6kmxzo2&dl=0",
    modeling: "https://www.dropbox.com/scl/fo/g46255ht0u4quk6tuyac4/AMfQfZ7K-Ab9A9erjUICPys?rlkey=cvq4o0rwccd98z4ntnsalaxfa&st=1knw74vu&dl=0",
    kids: "https://www.dropbox.com/scl/fo/w87325fb7hfwjoviwx6be/AG0Sb75LIsIoQxLvhw3VC-o?rlkey=we3giatkd18q8ey5tffqilbnh&st=d7x0yfg1&dl=0"
  };

  const handleOpenGallery = (title, items, link) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      openGallery(title, items);
    }
  };

  // --- Project Data ---

  const weddingGallery = [
    { type: 'image', url: '/New/compressed_wedding-1.jpg' },
    { type: 'image', url: '/New/compressed_wedding-6.jpg' },
    { type: 'image', url: '/New/compressed_wedding-7.jpg' },
    { type: 'image', url: '/New/compressed_wedding-8.jpg' },
  ];

  const preWeddingGallery = [
    { type: 'image', url: '/New/compressed_wedding-2.jpg' },
    { type: 'image', url: '/New/compressed_wedding-4.jpg' },
    { type: 'image', url: '/New/compressed_wedding-5.jpg' },
    { type: 'image', url: '/New/compressed_wedding-1.jpg' },
  ];

  const babyGallery = [
    { type: 'image', url: '/New/compressed_babyshower-1.jpg' },
    { type: 'image', url: '/New/compressed_babyshower-3.jpg' },
    { type: 'image', url: '/New/babyshower-5.jpg' },
    { type: 'image', url: '/New/babyshower-3.jpg' },
  ];

  const concertGallery = [
    { type: 'image', url: '/New/compressed_concert-1.jpg' },
    { type: 'image', url: '/New/compressed_concert-2.jpg' },
    { type: 'image', url: '/New/compressed_concert-3.jpg' },
    { type: 'image', url: '/New/compressed_concert-4.jpg' },
    { type: 'image', url: '/New/compressed_concert-5.jpg' },
    { type: 'image', url: '/New/compressed_concert-6.jpg' },
    { type: 'image', url: '/New/compressed_concert-7.jpg' },
    { type: 'image', url: '/New/compressed_concert-8.jpg' },

    //testing
  ];

  const birthdayGallery = [
    { type: 'image', url: '/New/compressed_birthday-1.jpg' },
    { type: 'image', url: '/New/compressed_birthday-2.jpg' },
    { type: 'image', url: '/New/compressed_birthday-3.jpg' },
    { type: 'image', url: '/New/compressed_birthday-4.jpg' },

  ];

  const modelingGallery = [
    { type: 'image', url: '/New/model-1.jpg' },
    { type: 'image', url: '/New/model-2.jpg' },
    { type: 'image', url: '/New/model-3.jpg' },
    { type: 'image', url: '/New/model-11.jpg' },

  ];

  const kidsGallery = [
    { type: 'image', url: '/New/birthday-1.jpg' },
    { type: 'image', url: '/New/birthday-2.jpg' },
    { type: 'image', url: '/New/birthday-3.jpg' },
    { type: 'image', url: '/New/birthday-4.jfif' },
  ];

  const sharedColors = {
    topText: "var(--color-secondary)",
    subText: "var(--color-text-light)",
    separator: "transparent",
    btnBg: "#e5e7eb",
    btnFg: "#000000",
    btnHoverBg: "#ffffff",
    btnHoverFg: "#000000",
  };

  return (
    <div className="min-h-screen pt-32 flex flex-col items-center justify-start text-white bg-black w-full overflow-hidden relative">

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
        {/* Project 1 - Weddings */}
        <DicedHeroSection
          topText="Cinematic Wedding Films"
          mainText="Weddings"
          subMainText="From the first look to the last dance — we craft emotional, cinematic wedding films that capture every unscripted moment, tear, and laugh your day has to offer."
          buttonText="Watch Films"
          slides={weddingGallery}
          onMainButtonClick={() => handleOpenGallery("Wedding Films", weddingGallery, galleryLinks.wedding)}
          onGridImageClick={() => handleOpenGallery("Wedding Films", weddingGallery, galleryLinks.wedding)}
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

        {/* Project 2 - Pre-Wedding */}
        <DicedHeroSection
          topText="The Journey Begins"
          mainText="Pre-Wedding"
          subMainText="Celebrate your love story before you say 'I do'. We craft personalized, cinematic pre-wedding shoots that showcase your unique bond in breathtaking locations."
          buttonText="View Gallery"
          slides={preWeddingGallery}
          onMainButtonClick={() => handleOpenGallery("Pre-Wedding Gallery", preWeddingGallery, galleryLinks.prewedding)}
          onGridImageClick={() => handleOpenGallery("Pre-Wedding Gallery", preWeddingGallery, galleryLinks.prewedding)}
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

        {/* Project 3 - New Beginnings */}
        <DicedHeroSection
          topText="Precious Milestones"
          mainText="New Beginnings"
          subMainText="The anticipation, the joy, the love in the room — we document the arrival of your little one with warmth and intimacy, so these memories live on for generations."
          buttonText="View Gallery"
          slides={babyGallery}
          onMainButtonClick={() => handleOpenGallery("New Beginnings Gallery", babyGallery, galleryLinks.baby)}
          onGridImageClick={() => handleOpenGallery("New Beginnings Gallery", babyGallery, galleryLinks.baby)}
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

        {/* Project 4 - Concerts */}
        <DicedHeroSection
          topText="Live Event Coverage"
          mainText="Concerts"
          subMainText="High-energy, multi-camera concert coverage that captures the electric atmosphere on stage and in the crowd. Every beat, every light, every crowd moment — preserved."
          buttonText="See Gallery"
          slides={concertGallery}
          onMainButtonClick={() => handleOpenGallery("Concert Gallery", concertGallery, galleryLinks.concert)}
          onGridImageClick={() => handleOpenGallery("Concert Gallery", concertGallery, galleryLinks.concert)}
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

        {/* Project 5 - Birthdays */}
        <DicedHeroSection
          topText="Brand Launch Moments"
          mainText="Birthdays"
          subMainText="Your grand opening is your first impression — we make it unforgettable on film. Ribbon cuts, speeches, guest arrivals, and the energy of a new chapter, all in one story."
          buttonText="View Gallery"
          slides={birthdayGallery}
          onMainButtonClick={() => handleOpenGallery("Birthday Gallery", birthdayGallery, galleryLinks.birthday)}
          onGridImageClick={() => handleOpenGallery("Birthday Gallery", birthdayGallery, galleryLinks.birthday)}
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

        {/* Modeling Section */}
        <DicedHeroSection
          topText="Professional Portfolios"
          mainText="Modeling"
          subMainText="Sophisticated portfolios that capture your unique essence. From lifestyle to high-fashion, we bring professional direction and cinematic lighting to every shoot."
          buttonText="See Portfolio"
          slides={modelingGallery}
          onMainButtonClick={() => handleOpenGallery("Modeling Portfolio", modelingGallery, galleryLinks.modeling)}
          onGridImageClick={() => handleOpenGallery("Modeling Portfolio", modelingGallery, galleryLinks.modeling)}
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

        {/* Kids Photography */}
        <DicedHeroSection
          topText="Pure Joy & Innocence"
          mainText="Kids Photography"
          subMainText="Capturing the wonder of childhood. From first milestones to grand birthday celebrations, we turn fleeting moments into lifelong treasures with warmth and creativity."
          buttonText="View Gallery"
          slides={kidsGallery}
          onMainButtonClick={() => handleOpenGallery("Kids Gallery", kidsGallery, galleryLinks.kids)}
          onGridImageClick={() => handleOpenGallery("Kids Gallery", kidsGallery, galleryLinks.kids)}
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
      </div>

      <ProjectsCTA />

      <div className="w-full mt-auto">
        <Footer />
      </div>

      {/* Modern Gallery Modal */}
      <ProjectGalleryModal
        isOpen={galleryModal.isOpen}
        onClose={closeGallery}
        title={galleryModal.title}
        items={galleryModal.items}
      />
    </div>
  );
}
