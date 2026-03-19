import { useEffect, useRef } from "react";

export default function ScrollAnimatedVideo({
  videoSrc = "https://www.w3schools.com/html/mov_bbb.mp4",
  poster,
  initialBoxSize = 320,
  scrollHeightVh = 300,
  heroContent,
  overlayContent,
  showBadges = true,
}) {
  const rootRef = useRef(null);
  const containerRef = useRef(null);
  const headlineRef = useRef(null);

  useEffect(() => {
    let gsap, ScrollTrigger, CustomEase;
    let mainTl;
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

      // ── Lenis smooth scroll ────────────────────────────────────────────
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
      const triggerEl = rootRef.current?.querySelector("[data-sticky-scroll]");

      if (!triggerEl || !container) return;

      // ── Initial state ──────────────────────────────────────────────────
      gsap.set(container, {
        width: initialBoxSize,
        height: initialBoxSize,
        borderRadius: 20,
      });

      // ── Scrub: box → fullscreen ────────────────────────────────────────
      mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      mainTl.to(container, {
        width: "100vw",
        height: "100vh",
        borderRadius: 0,
        boxShadow: "none",
        ease: "expo.out",
      });

      // ── Keep video playing ─────────────────────────────────────────────
      const videoEl = container.querySelector("video");
      if (videoEl) {
        const tryPlay = () => videoEl.play().catch(() => { });
        tryPlay();
        ScrollTrigger.create({
          trigger: triggerEl,
          start: "top top",
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

  const ScreenBadge = ({ number, description, align = "top-left" }) => {
    const pos = align === "top-left" ? { top: 20, left: 20 } : { top: 20, right: 20 };
    return (
      <div style={{ position: "absolute", ...pos, zIndex: 100, display: "flex", flexDirection: "column", gap: 6, pointerEvents: "none", userSelect: "none" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 999, padding: "5px 12px 5px 6px", backdropFilter: "blur(8px)" }}>
          <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,255,255,0.9)", color: "#000", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "ui-monospace,monospace" }}>{number}</div>
          <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.85)", fontFamily: "ui-monospace,monospace", letterSpacing: "0.08em", textTransform: "uppercase", whiteSpace: "nowrap" }}>Screen {number}</span>
        </div>
        <div style={{ marginLeft: 4, background: "rgba(255,255,255,0.05)", border: "1px dashed rgba(255,255,255,0.12)", borderRadius: 6, padding: "3px 8px", fontSize: 10, color: "rgba(255,255,255,0.4)", fontFamily: "ui-monospace,monospace" }}>{description}</div>
      </div>
    );
  };

  return (
    <>
      <div ref={rootRef} style={{ background: "#000" }}>

        {/* ════════════════════════════════════
            SCREEN 1 — HERO
        ════════════════════════════════════ */}
        <div
          ref={headlineRef}
          style={{
            height: "100vh", width: "100%", background: "#000",
            display: "flex", alignItems: "center", justifyContent: "center",
            perspective: "900px", position: "sticky", top: 0, zIndex: 0,
          }}
        >
          {showBadges && <ScreenBadge number={1} description="heroContent prop" />}
          <div
            className="hsv-headline"
            style={{ transformStyle: "preserve-3d", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}
          >
            {heroContent ?? null}
          </div>
        </div>

        {/* ════════════════════════════════════
            SCREEN 2 — VIDEO SCROLL ZONE
            Only the video lives here.
            No overflow:hidden — no trapped scroll.
        ════════════════════════════════════ */}
        <div
          data-sticky-scroll
          style={{
            height: `${Math.max(150, scrollHeightVh)}vh`,
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              position: "sticky",
              top: 0,
              height: "100vh",
              display: "grid",
              placeItems: "center",
              background: "transparent",
              pointerEvents: "none",
            }}
          >
            {showBadges && <ScreenBadge number={2} description="video expands to fullscreen" />}

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
                poster={poster} muted loop playsInline autoPlay
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              >
                <source src={videoSrc} type="video/mp4" />
              </video>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════
            SCREEN 3 — NORMAL DOCUMENT FLOW
            margin-top: -100vh makes it start
            exactly where the fullscreen video is,
            so it slides up naturally over it as
            the user scrolls. No internal scroll.
            z-index: 5 ensures it covers the video.
        ════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            zIndex: 5,
            marginTop: "-100vh",
            background: "#000",
            width: "100%",
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