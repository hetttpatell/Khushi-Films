import { useEffect, useRef } from "react";

export default function ScrollAnimatedVideo({
  videoSrc = "https://www.w3schools.com/html/mov_bbb.mp4",
  poster,
  initialBoxSize = 320,
  scrollHeightVh = 280,
  heroContent,
  overlayContent,
  showBadges = true,
}) {
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const headlineRef = useRef(null);
  const overlayRef = useRef(null);
  const overlayConRef = useRef(null);

  useEffect(() => {
    let gsap, ScrollTrigger, CustomEase;
    let mainTl;
    let darkenEl = null;
    let lenis, rafCb;
    let cancelled = false;

    (async () => {
      const gsapPkg = await import("gsap");
      gsap = gsapPkg.gsap || gsapPkg.default || gsapPkg;

      const stPkg = await import("gsap/ScrollTrigger").catch(() =>
        import("gsap/dist/ScrollTrigger")
      );
      ScrollTrigger = stPkg.ScrollTrigger || stPkg.default || stPkg;

      const cePkg = await import("gsap/CustomEase").catch(() =>
        import("gsap/dist/CustomEase")
      );
      CustomEase = cePkg.CustomEase || cePkg.default || cePkg;

      gsap.registerPlugin(ScrollTrigger, CustomEase);
      if (cancelled) return;

      const lenisPkg = await import("lenis").catch(() => null);
      const LenisCtor = lenisPkg?.default || lenisPkg?.Lenis;
      if (LenisCtor) {
        lenis = new LenisCtor({ duration: 0.8, smoothWheel: true });
        rafCb = (t) => lenis.raf(t * 1000);
        gsap.ticker.add(rafCb);
        gsap.ticker.lagSmoothing(0);
        lenis.on("scroll", ScrollTrigger.update);
      }

      const container = containerRef.current;
      const overlayEl = overlayRef.current;
      const overlayConEl = overlayConRef.current;

      // Removed heroTl animation perfectly -- Screen 1 is rigidly sticky now!

      if (container) {
        darkenEl = document.createElement("div");
        Object.assign(darkenEl.style, {
          position: "absolute", inset: "0",
          background: "rgba(0,0,0,0)",
          pointerEvents: "none", zIndex: "1",
        });
        container.appendChild(darkenEl);
      }

      const triggerEl = rootRef.current?.querySelector("[data-sticky-scroll]");
      if (!triggerEl || !container || !overlayEl) return;

      mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      gsap.set(container, {
        width: initialBoxSize, height: initialBoxSize,
        borderRadius: 20,
      });
      gsap.set(overlayEl, { clipPath: "inset(100% 0 0 0)" });
      if (overlayConEl) gsap.set(overlayConEl, { y: 0, scale: 1 });

      mainTl
        .to(container, {
          width: "100%", height: "100vh",
          borderRadius: 0,
          boxShadow: "none",
          ease: "expo.out",
        }, 0)
        .to(darkenEl, {
          backgroundColor: "rgba(0,0,0,0.55)",
          ease: "power2.out",
        }, 0)
        .to(overlayEl, {
          clipPath: "inset(0% 0 0 0)",
          ease: "expo.out",
        }, 0.38);

      const videoEl = container.querySelector("video");
      if (videoEl) {
        const tryPlay = () => videoEl.play().catch(() => { });
        tryPlay();
        ScrollTrigger.create({
          trigger: triggerEl, start: "top top",
          onEnter: tryPlay,
        });
      }
    })();

    return () => {
      cancelled = true;
      try { mainTl?.kill(); } catch { }
      try {
        ScrollTrigger?.getAll?.().forEach((t) =>
          rootRef.current?.contains(t.trigger) && t.kill(true)
        );
      } catch { }
      try { darkenEl?.parentElement?.removeChild(darkenEl); } catch { }
      try {
        if (rafCb && gsap?.ticker) {
          gsap.ticker.remove(rafCb);
          gsap.ticker.lagSmoothing(1000, 16);
        }
        lenis?.off?.("scroll", ScrollTrigger?.update);
        lenis?.destroy?.();
      } catch { }
    };
  }, [initialBoxSize, scrollHeightVh]);

  /* ── Reusable badge component ── */
  const ScreenBadge = ({ number, description, align = "top-left" }) => {
    const positions = {
      "top-left": { top: 20, left: 20 },
      "top-right": { top: 20, right: 20 },
    };
    return (
      <div
        style={{
          position: "absolute",
          ...positions[align],
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          gap: 6,
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 999,
            padding: "5px 12px 5px 6px",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.9)",
              color: "#000",
              fontSize: 11,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "ui-monospace, monospace",
              flexShrink: 0,
            }}
          >
            {number}
          </div>
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(255,255,255,0.85)",
              fontFamily: "ui-monospace, monospace",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
            }}
          >
            Screen {number}
          </span>
        </div>

        <div
          style={{
            marginLeft: 4,
            background: "rgba(255,255,255,0.05)",
            border: "1px dashed rgba(255,255,255,0.12)",
            borderRadius: 6,
            padding: "3px 8px",
            fontSize: 10,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "ui-monospace, monospace",
            letterSpacing: "0.04em",
          }}
        >
          {description}
        </div>
      </div>
    );
  };

  return (
    <>
      <div ref={rootRef} style={{ background: "#000" }}>

        {/* ══════════════════════════════════════
            SCREEN 1 — BLACK HERO
        ══════════════════════════════════════ */}
        <div
          ref={headlineRef}
          style={{
            height: "100vh",
            width: "100%",
            background: "#000",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 0,
            perspective: "900px",
            position: "sticky",
            top: 0,
            zIndex: 0,
          }}
        >
          {showBadges && (
            <ScreenBadge
              number={1}
              description="heroContent prop → your content here"
              align="top-left"
            />
          )}

          <div
            className="hsv-headline"
            style={{ transformStyle: "preserve-3d", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {heroContent ?? null}
          </div>
        </div>

        {/* ══════════════════════════════════════
            SCROLL TRIGGER ZONE
        ══════════════════════════════════════ */}
        <div
          data-sticky-scroll
          style={{ height: `${Math.max(150, scrollHeightVh)}vh`, position: "relative", zIndex: 1 }}
        >
          <div
            style={{
              position: "sticky", top: 0,
              height: "100vh",
              display: "grid", placeItems: "center",
              background: "transparent",
              pointerEvents: "none",
            }}
          >
            <div
              ref={containerRef}
              style={{
                position: "relative",
                pointerEvents: "auto",
                width: initialBoxSize,
                height: initialBoxSize,
                borderRadius: 20,
                overflow: "hidden",
                background: "#000",
                boxShadow: "0 12px 48px rgba(0,0,0,0.7)",
              }}
            >
              <video
                poster={poster}
                muted
                loop
                playsInline
                autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>

              {/* ══════════════════════════════════════
                  SCREEN 3 — PORTFOLIO OVERLAY
              ══════════════════════════════════════ */}
              <div
                ref={overlayRef}
                style={{
                  position: "absolute", inset: 0,
                  zIndex: 10,
                  display: "block",
                  clipPath: "inset(100% 0 0 0)",
                  pointerEvents: "none",
                  overflow: "hidden"
                }}
              >
                <div style={{ width: "100%", height: "100vh" }}>
                  {overlayContent}
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            SCREEN 3 — ACTUAL CONTENT FLOW
        ══════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            zIndex: 0, // Placed strictly behind the sticky scroll container
            background: "#000",
            width: "100%",
            marginTop: "-100vh", // Exactly overlaps the pinned video, allowing seamless continuation!
          }}
        >
          {overlayContent ?? null}
        </div>

      </div>

      <style>{`
        .hsv-headline > * {
          transform-style: preserve-3d;
          backface-visibility: hidden;
          transform-origin: center top;
        }
      `}</style>
    </>
  );
}