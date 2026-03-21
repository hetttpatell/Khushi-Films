import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ─────────────────────────────────────────────────────────────────────────────
//  Particle canvas — self-contained, no external deps
//  Matches the magic-ui Particles component behaviour:
//  particles drift slowly, magnetised toward mouse cursor
// ─────────────────────────────────────────────────────────────────────────────
function useParticles(canvasRef, containerRef) {
  useEffect(() => {
    const canvas    = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    let W, H, circles = [];
    let mouse = { x: 0, y: 0 };
    let animId;

    const resize = () => {
      W = container.offsetWidth;
      H = container.offsetHeight;
      canvas.width  = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.scale(dpr, dpr);
      circles = [];
      const count = W < 640 ? 60 : 130;
      for (let i = 0; i < count; i++) circles.push(mkCircle());
    };

    const mkCircle = () => ({
      x:          Math.random() * W,
      y:          Math.random() * H,
      tx:         0,
      ty:         0,
      size:       Math.random() * 1.2 + 0.3,
      alpha:      0,
      targetAlpha: parseFloat((Math.random() * 0.55 + 0.08).toFixed(2)),
      dx:         (Math.random() - 0.5) * 0.12,
      dy:         (Math.random() - 0.5) * 0.12,
      mag:        0.1 + Math.random() * 4,
    });

    const draw = (c, update = false) => {
      ctx.save();
      ctx.translate(c.tx, c.ty);
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${c.alpha})`;
      ctx.fill();
      ctx.restore();
      if (!update) circles.push(c);
    };

    const onMouse = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left - W / 2;
      mouse.y = e.clientY - rect.top  - H / 2;
    };

    let isIntersecting = true;
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0].isIntersecting;
    });
    observer.observe(container);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isIntersecting) return;
      ctx.clearRect(0, 0, W, H);

      circles.forEach((c, i) => {
        // Fade in/out near edges
        const edge = Math.min(
          c.x + c.tx - c.size,
          W - c.x - c.tx - c.size,
          c.y + c.ty - c.size,
          H - c.y - c.ty - c.size,
        );
        const ef = Math.min(1, Math.max(0, edge / 20));
        if (ef >= 1) { c.alpha = Math.min(c.alpha + 0.02, c.targetAlpha); }
        else          { c.alpha = c.targetAlpha * ef; }

        c.x += c.dx;
        c.y += c.dy;
        // Spring toward mouse
        c.tx += (mouse.x / (50 / c.mag) - c.tx) / 60;
        c.ty += (mouse.y / (50 / c.mag) - c.ty) / 60;

        draw(c, true);

        // Respawn if off-canvas
        if (c.x < -c.size || c.x > W + c.size ||
            c.y < -c.size || c.y > H + c.size) {
          circles.splice(i, 1);
          circles.push(mkCircle());
        }
      });
    };



    resize();
    animate();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      observer.disconnect();
    };
  }, []);
}

// ─────────────────────────────────────────────────────────────────────────────
//  Glass texture fix — composites transmission mask over baseColor
//  so glass areas are dark blue-black instead of white
// ─────────────────────────────────────────────────────────────────────────────
function buildGlassBaseColor(baseUrl, transUrl) {
  return new Promise((resolve) => {
    const baseImg = new Image();
    const transImg = new Image();
    let loaded = 0;

    const onLoad = () => {
      if (++loaded < 2) return;
      const W = baseImg.naturalWidth, H = baseImg.naturalHeight;
      const c = document.createElement('canvas');
      c.width = W; c.height = H;
      const ctx = c.getContext('2d');
      ctx.drawImage(baseImg, 0, 0);
      const bd = ctx.getImageData(0, 0, W, H);

      const tc = document.createElement('canvas');
      tc.width = W; tc.height = H;
      const tctx = tc.getContext('2d');
      tctx.drawImage(transImg, 0, 0, W, H);
      const td = tctx.getImageData(0, 0, W, H).data;

      const d = bd.data;
      for (let i = 0; i < d.length; i += 4) {
        if (td[i] > 180 && td[i+1] > 180 && td[i+2] > 180) {
          d[i] = 5; d[i+1] = 8; d[i+2] = 22; d[i+3] = 255;
        }
      }
      ctx.putImageData(bd, 0, 0);

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace  = THREE.SRGBColorSpace;
      tex.flipY       = false;
      tex.needsUpdate = true;
      resolve(tex);
    };

    baseImg.crossOrigin = transImg.crossOrigin = 'anonymous';
    baseImg.onload  = onLoad;
    transImg.onload = onLoad;
    baseImg.src  = baseUrl;
    transImg.src = transUrl;
  });
}

// ─────────────────────────────────────────────────────────────────────────────
//  HalideHero — Screen 1
// ─────────────────────────────────────────────────────────────────────────────
const HalideHero = () => {
  const mountRef     = useRef(null); // Three.js canvas
  const pCanvasRef   = useRef(null); // Particle canvas
  const pContainerRef= useRef(null); // Particle container

  // Attach particles
  useParticles(pCanvasRef, pContainerRef);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const isMobileDevice = window.innerWidth < 640;

    // ── RENDERER ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // Drastically reduce pixel ratio on mobile
    renderer.setPixelRatio(isMobileDevice ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping         = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled   = true;
    renderer.shadowMap.type      = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace    = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ────────────────────────────────────────
    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34, mount.clientWidth / mount.clientHeight, 0.1, 100);
    // Wider FOV on mobile so lens fits on narrow screens
    const isMobile = () => window.innerWidth < 640;
    camera.fov = isMobile() ? 50 : 34;
    camera.updateProjectionMatrix();
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // ── ENVIRONMENT MAP ───────────────────────────────────────
    const pmrem    = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(50, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x080812, side: THREE.BackSide })
    ));
    [
      [0xfff5e0, [-15, 20, 15], 6],
      [0x3355ff, [ 20,  4,-12], 4],
      [0xffffff, [  0, 30,  5], 8],
      [0xffddaa, [ 10,-10, 10], 3],
      [0xaaccff, [ -5,  8, 20], 4],
    ].forEach(([c, p, r]) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 6, 6),
        new THREE.MeshBasicMaterial({ color: c }));
      m.position.set(...p); envScene.add(m);
    });
    const envMap = pmrem.fromScene(envScene).texture;
    scene.environment = envMap;

    // ── LIGHTS ────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const key = new THREE.SpotLight(0xfff5e8, 450);
    key.position.set(-4, 7, 6); key.angle = Math.PI/6;
    key.penumbra = 0.4; key.castShadow = true;
    scene.add(key);

    const rim = new THREE.SpotLight(0x5577ff, 280);
    rim.position.set(6, -2, -5); rim.angle = Math.PI/5; rim.penumbra = 0.6;
    scene.add(rim);

    const top = new THREE.DirectionalLight(0xffffff, 3.0);
    top.position.set(1, 12, 3); scene.add(top);

    const front = new THREE.PointLight(0xddeeff, 8, 14);
    front.position.set(0, 0, 8); scene.add(front);

    const bot = new THREE.PointLight(0xffcc88, 20, 12);
    bot.position.set(0, -6, 4); scene.add(bot);

    const leftL = new THREE.PointLight(0x88aaff, 18, 12);
    leftL.position.set(-6, 2, 3); scene.add(leftL);

    // ── INPUT: MOUSE (desktop) + GYROSCOPE (mobile) ───────────
    const mobile = window.innerWidth < 640;
    const target = { x: 0, y: 0 }; // unified target rotation
    const vel    = { x: 0, y: 0 };
    const curr   = { x: 0, y: 0 };
    const STIFF  = mobile ? 0.06 : 0.16;  // much slower spring on mobile
    const DAMP   = mobile ? 0.88 : 0.70;  // more damping = smoother glide

    // Desktop — mouse drives rotation
    const onMouse = (e) => {
      if (mobile) return;
      target.x = (e.clientY / window.innerHeight - 0.5) *  0.70;
      target.y = (e.clientX / window.innerWidth  - 0.5) *  1.00;
    };
    window.addEventListener('mousemove', onMouse);

    // Mobile — gyroscope drives rotation
    // beta  = front-back tilt  (-180 → 180), maps to X rotation
    // gamma = left-right tilt  (-90  → 90),  maps to Y rotation
    let gyroBase = null; // calibrated on first reading
    let gyroGranted = false;

    const applyGyro = (e) => {
      if (!mobile) return;
      const beta  = e.beta  ?? 0; // -180 to 180
      const gamma = e.gamma ?? 0; // -90  to 90

      // Calibrate: first reading becomes the "neutral" position
      if (!gyroBase) gyroBase = { beta, gamma };

      const db = beta  - gyroBase.beta;   // delta from neutral
      const dg = gamma - gyroBase.gamma;

      // Map ±40° of tilt to ±0.3 radians — slow, subtle range
      target.x = Math.max(-0.30, Math.min(0.30,  (db / 40) * 0.30));
      target.y = Math.max(-0.40, Math.min(0.40,  (dg / 40) * 0.40));
    };

    const requestGyro = async () => {
      if (!mobile) return;
      // iOS 13+ requires explicit permission
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof DeviceOrientationEvent.requestPermission === 'function') {
        try {
          const perm = await DeviceOrientationEvent.requestPermission();
          if (perm === 'granted') {
            window.addEventListener('deviceorientation', applyGyro);
            gyroGranted = true;
          }
        } catch {
          // Permission denied or not available — fall back to touch
        }
      } else {
        // Android / older iOS — no permission needed
        window.addEventListener('deviceorientation', applyGyro);
        gyroGranted = true;
      }
    };

    // Touch fallback for mobile (if gyro not available/granted)
    let touchStart = null;
    const onTouchStart = (e) => {
      if (!mobile || gyroGranted) return;
      touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTouchMove = (e) => {
      if (!mobile || gyroGranted || !touchStart) return;
      const dx = (e.touches[0].clientX - touchStart.x) / window.innerWidth;
      const dy = (e.touches[0].clientY - touchStart.y) / window.innerHeight;
      target.y =  dx * 0.8;   // slow touch drag
      target.x =  dy * 0.6;
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove',  onTouchMove,  { passive: true });

    // Trigger gyro request on first touch (iOS needs user gesture)
    const onFirstTouch = () => {
      requestGyro();
      window.removeEventListener('touchstart', onFirstTouch);
    };
    if (mobile) window.addEventListener('touchstart', onFirstTouch, { passive: true });

    const pivot = new THREE.Group();
    scene.add(pivot);

    // ── LOAD ──────────────────────────────────────────────────
    let animId, model = null, entered = false;
    const startT = performance.now();
    const ENTER  = 1800;
    const easeOutExpo = (t) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
    const easeOutBack = (t) => 1 + 2.70158*Math.pow(t-1,3) + 1.70158*Math.pow(t-1,2);

    buildGlassBaseColor(
      '/textures/blinn2_baseColor.png',
      '/textures/blinn2_transmission.png'
    ).then((correctedBase) => {
      const tl = new THREE.TextureLoader();
      const aniso = renderer.capabilities.getMaxAnisotropy();

      const metRough = tl.load('/textures/blinn2_metallicRoughness.png');
      metRough.flipY = false; metRough.anisotropy = aniso;

      const normalTex = tl.load('/textures/blinn2_normal.png');
      normalTex.flipY = false; normalTex.anisotropy = aniso;
      correctedBase.anisotropy = aniso;

      const lensMat = new THREE.MeshStandardMaterial({
        map: correctedBase, metalnessMap: metRough, roughnessMap: metRough,
        normalMap: normalTex, normalScale: new THREE.Vector2(1.5, 1.5),
        metalness: 1.0, roughness: 1.0,
        envMap: envMap, envMapIntensity: 0.8,
        transparent: false, opacity: 1.0, side: THREE.FrontSide,
      });

      new GLTFLoader().load('/scene.gltf', (gltf) => {
        const root = gltf.scene;
        const box = new THREE.Box3().setFromObject(root);
        const sz = new THREE.Vector3(), ctr = new THREE.Vector3();
        box.getSize(sz); box.getCenter(ctr);
        const sc = 2.0 / Math.max(sz.x, sz.y, sz.z);
        root.scale.setScalar(sc);
        box.setFromObject(root); box.getCenter(ctr);
        root.position.sub(ctr);

        root.traverse((child) => {
          if (!child.isMesh) return;
          child.material = lensMat;
          child.castShadow = child.receiveShadow = true;
        });

        root.rotation.set(0, Math.PI / 2, 0);
        root.rotation.x = 0.12; root.rotation.z = -0.03;

        // Glass overlay
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0x030810, metalness: 0.0, roughness: 0.0,
          transparent: true, opacity: 0.80,
          envMap, envMapIntensity: 2.5,
          iridescence: 1.0, iridescenceIOR: 1.9,
          iridescenceThicknessRange: [80, 650],
          side: THREE.FrontSide, depthWrite: false,
        });
        const frontZ = sz.x * sc * 0.46;
        const dome = new THREE.Mesh(
          new THREE.SphereGeometry(0.70, 128, 128, 0, Math.PI*2, 0, 0.52), glassMat);
        dome.rotation.x = Math.PI; dome.position.set(0, 0, frontZ);
        root.add(dome);

        // Aperture blades
        const bm = new THREE.MeshStandardMaterial({ color: 0x020204, metalness: 0.5, roughness: 0.4 });
        for (let i = 0; i < 9; i++) {
          const a = (i/9)*Math.PI*2;
          const bs = new THREE.Shape();
          bs.moveTo(0,0); bs.quadraticCurveTo(0.17,0.09,0.26,0.01);
          bs.quadraticCurveTo(0.17,-0.08,0,0);
          const blade = new THREE.Mesh(
            new THREE.ExtrudeGeometry(bs,{depth:0.006,bevelEnabled:false}), bm);
          blade.position.set(Math.cos(a)*0.12, Math.sin(a)*0.12, frontZ+0.12);
          blade.rotation.z = a + Math.PI/2;
          root.add(blade);
        }

        const well = new THREE.Mesh(new THREE.CircleGeometry(0.16,48),
          new THREE.MeshStandardMaterial({color:0x010102,roughness:1}));
        well.position.set(0, 0, frontZ+0.16); root.add(well);

        const catchlight = new THREE.Mesh(new THREE.CircleGeometry(0.028,24),
          new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0.50}));
        catchlight.position.set(0.13, 0.10, frontZ+0.17); root.add(catchlight);

        // On mobile shift lens up so title has room at bottom
        const mobileOffset = window.innerWidth < 640 ? 0.5 : 0;
        root.userData.sc     = sc;
        root.userData.offset = mobileOffset;
        root.scale.setScalar(0.001);
        root.position.y -= 1.0;
        pivot.add(root); model = root;
      }, undefined, (e) => console.error('[HalideHero]', e));
    });

    // ── OBSERVATION ───────────────────────────────────────────
    let isIntersecting = true;
    const observer = new IntersectionObserver((entries) => {
      isIntersecting = entries[0].isIntersecting;
    });
    observer.observe(mount);

    // ── ANIMATE ───────────────────────────────────────────────
    const animate = () => {
      animId = requestAnimationFrame(animate);
      if (!isIntersecting) return;

      const now = performance.now();
      if (model) {
        const bs = model.userData.sc || 1;
        if (!entered) {
          const raw = Math.min((now - startT)/ENTER, 1);
          const ep  = easeOutBack(easeOutExpo(raw));
          model.scale.setScalar(ep * bs);
          model.position.y = -1.0*(1-easeOutExpo(raw));
          if (raw >= 1) { entered=true; model.scale.setScalar(bs); model.position.y = model.userData.offset || 0; }
        }
        vel.x = vel.x*DAMP + (target.x - curr.x)*STIFF;
        vel.y = vel.y*DAMP + (target.y - curr.y)*STIFF;
        curr.x += vel.x; curr.y += vel.y;
        pivot.rotation.x = curr.x;
        pivot.rotation.y = curr.y;
        pivot.rotation.z += 0.00006;
      }
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      camera.fov    = mount.clientWidth < 640 ? 50 : 34;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('deviceorientation', applyGyro);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('resize', onResize);
      observer.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Syncopate:wght@400;700&display=swap');
        :root { --silver:#e0e0e0; --grain:0.10; }

        .hh-root {
          position:absolute; inset:0; width:100vw; height:100vh;
          overflow:hidden; display:flex; align-items:center; justify-content:center;
          pointer-events:none; background:transparent;
        }

        .hh-rings { display:none; }

        /* Particle canvas layer */
        .hh-particles {
          position:absolute; inset:0; z-index:1; pointer-events:none;
        }
        .hh-particles canvas { width:100%!important; height:100%!important; }

        /* Vignette */
        .hh-vignette {
          position:absolute; inset:0; z-index:2; pointer-events:none;
          background:radial-gradient(ellipse 85% 85% at 50% 50%,
            transparent 30%, rgba(0,0,0,0.60) 100%);
        }

        /* Film grain */
        .hh-grain { position:absolute; inset:0; pointer-events:none; z-index:99; opacity:var(--grain); }

        /* Three.js lens */
        .hh-canvas { position:absolute; inset:0; pointer-events:none; z-index:3; }
        .hh-canvas canvas { width:100%!important; height:100%!important; }

        /* ── TITLE — desktop: left side, mobile: bottom-left ── */
        .hh-title {
          position:absolute; inset:0;
          padding: 0 2rem 3.5rem 2rem;
          display:flex; flex-direction:column;
          justify-content:flex-end;
          align-items:flex-start;
          z-index:10; pointer-events:none;
        }
        .hh-title h1 {
          font-family:'Playfair Display',serif;
          font-size:clamp(2.4rem,11vw,9.5rem);
          line-height:1.05; letter-spacing:-0.02em;
          color:#fff; font-weight:600; margin:0;
          text-shadow:0 2px 40px rgba(0,0,0,0.8);
        }
        .hh-title h1 em { font-style:italic; font-weight:400; color:rgba(255,255,255,0.88); }
        .hh-sub {
          font-family:'Syncopate',sans-serif;
          font-size:clamp(0.45rem,2.2vw,0.75rem);
          letter-spacing:.28em; text-transform:uppercase;
          color:rgba(255,255,255,.28); margin-top:0.8rem; font-weight:400;
        }

        /* Desktop: title on left middle */
        @media (min-width: 640px) {
          .hh-title {
            padding-left: clamp(2.5rem,8vw,8rem);
            padding-bottom: 0;
            justify-content: center;
            align-items: flex-start;
          }
          .hh-title h1 {
            font-size: clamp(3.2rem,9vw,9.5rem);
          }
          .hh-sub {
            font-size: clamp(0.5rem,0.9vw,0.75rem);
          }
        }

        /* Gyro hint — mobile only */
        .hh-gyro-hint {
          position:absolute; bottom:5.5rem; left:50%;
          transform:translateX(-50%);
          font-family:'Syncopate',sans-serif;
          font-size:0.5rem; letter-spacing:0.2em;
          text-transform:uppercase; color:rgba(255,255,255,0.25);
          z-index:10; pointer-events:none;
          animation: hh-pulse-hint 2s ease-in-out infinite;
          display:none;
        }
        @media (max-width:639px) { .hh-gyro-hint { display:block; } }
        @keyframes hh-pulse-hint { 0%,100%{opacity:.2} 50%{opacity:.5} }
        .hh-scroll {
          position:absolute; bottom:2rem; left:50%;
          width:1px; height:56px;
          background:linear-gradient(to bottom,rgba(255,255,255,.5),transparent);
          z-index:10; animation:hh-flow 2.2s infinite ease-in-out;
          display:none;
        }
        @media (min-width: 640px) {
          .hh-scroll { display:block; }
        }
        @keyframes hh-flow {
          0%,100%{transform:scaleY(0);transform-origin:top}
          50%{transform:scaleY(1);transform-origin:top}
          51%{transform:scaleY(1);transform-origin:bottom}
        }
      `}</style>

      <div className="hh-root">

        {/* SVG grain filter */}
        <svg style={{position:'absolute',width:0,height:0}}>
          <filter id="hh-gf">
            <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
          </filter>
        </svg>



        {/* Layer 1 — Floating particles */}
        <div className="hh-particles" ref={pContainerRef}>
          <canvas ref={pCanvasRef}/>
        </div>

        {/* Layer 2 — Vignette */}
        <div className="hh-vignette"/>

        {/* Layer 3 — Film grain */}
        <div className="hh-grain" style={{filter:'url(#hh-gf)'}}/>

        {/* Layer 4 — Three.js 3D lens */}
        <div className="hh-canvas" ref={mountRef}/>

        {/* Layer 5 — Title */}
        <div className="hh-title">
          <h1>Khushi<br/><em>Films</em></h1>
          <p className="hh-sub">Cinematic · Timeless · Yours</p>
        </div>

        {/* Scroll hint */}
        <div className="hh-scroll"/>

        {/* Mobile gyro hint */}
        <div className="hh-gyro-hint">Tilt to move · tap to activate</div>

      </div>
    </>
  );
};

export default HalideHero;