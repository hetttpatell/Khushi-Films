import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ─────────────────────────────────────────────────────────────────────────────
//  HalideHero
//
//  The glass in the original model is white in the baseColor texture.
//  We fix this by compositing the transmission mask over the baseColor:
//  wherever transmission is white (glass), we paint deep blue-black.
//
//  Public folder structure:
//  public/
//    scene.gltf  scene.bin
//    textures/
//      blinn2_baseColor.png
//      blinn2_metallicRoughness.png
//      blinn2_normal.png
//      blinn2_transmission.png
// ─────────────────────────────────────────────────────────────────────────────

// Loads two images and composites them on a canvas:
// Wherever transmissionImg pixel is WHITE (r>200, g>200, b>200),
// replace the baseColor pixel with a dark blue-black glass color.
function buildGlassBaseColor(baseUrl, transmissionUrl) {
  return new Promise((resolve) => {
    const baseImg = new Image();
    const transImg = new Image();
    let loaded = 0;

    const onLoad = () => {
      loaded++;
      if (loaded < 2) return;

      const W = baseImg.naturalWidth;
      const H = baseImg.naturalHeight;

      // Draw base color
      const canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(baseImg, 0, 0);
      const baseData = ctx.getImageData(0, 0, W, H);

      // Draw transmission mask
      const tCanvas = document.createElement('canvas');
      tCanvas.width = W;
      tCanvas.height = H;
      const tCtx = tCanvas.getContext('2d');
      tCtx.drawImage(transImg, 0, 0, W, H);
      const transData = tCtx.getImageData(0, 0, W, H);

      // Composite: where transmission mask is WHITE → paint dark glass
      const data = baseData.data;
      const tData = transData.data;

      for (let i = 0; i < data.length; i += 4) {
        const tr = tData[i];     // transmission red channel
        const tg = tData[i + 1]; // transmission green channel
        const tb = tData[i + 2]; // transmission blue channel

        // White pixels in transmission = glass area (r>180 AND g>180 AND b>180)
        // Cyan pixels (r<100, g>200, b>200) = non-glass — leave alone
        const isGlass = tr > 180 && tg > 180 && tb > 180;

        if (isGlass) {
          // Deep blue-black glass with slight blue tint (like T* coating)
          // Vary slightly for depth — pixels near center are darker
          const cx = (i / 4) % W;
          const cy = Math.floor((i / 4) / W);
          const dx = (cx / W - 0.5) * 2;
          const dy = (cy / H - 0.5) * 2;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Center: very dark. Edge: slightly blue-tinted
          const darkness = Math.max(0, 1 - dist * 0.6);
          data[i] = Math.round(5 + darkness * 8);   // R: near 0
          data[i + 1] = Math.round(8 + darkness * 10);  // G: very dark blue
          data[i + 2] = Math.round(20 + darkness * 15);  // B: slight blue
          data[i + 3] = 255;
        }
        // Non-glass pixels keep their original baseColor values
      }

      ctx.putImageData(baseData, 0, 0);

      // Convert to THREE texture
      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = false;
      tex.needsUpdate = true;
      resolve(tex);
    };

    baseImg.crossOrigin = 'anonymous';
    transImg.crossOrigin = 'anonymous';
    baseImg.onload = onLoad;
    transImg.onload = onLoad;
    baseImg.src = baseUrl;
    transImg.src = transmissionUrl;
  });
}

const HalideHero = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // ── RENDERER ──────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34, mount.clientWidth / mount.clientHeight, 0.1, 100
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // ── ENVIRONMENT MAP ───────────────────────────────────────
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(50, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x080812, side: THREE.BackSide })
    ));
    [
      [0xfff5e0, [-15, 20, 15], 6],
      [0x3355ff, [20, 4, -12], 4],
      [0xffffff, [0, 30, 5], 8],
      [0xffddaa, [10, -10, 10], 3],
      [0xaaccff, [-5, 8, 20], 4],
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
    key.position.set(-4, 7, 6);
    key.angle = Math.PI / 6; key.penumbra = 0.4; key.castShadow = true;
    scene.add(key);

    const rim = new THREE.SpotLight(0x5577ff, 280);
    rim.position.set(6, -2, -5);
    rim.angle = Math.PI / 5; rim.penumbra = 0.6;
    scene.add(rim);

    const top = new THREE.DirectionalLight(0xffffff, 3.0);
    top.position.set(1, 12, 3);
    scene.add(top);

    // Front light VERY low — was causing white washout on glass
    const front = new THREE.PointLight(0xddeeff, 8, 14);
    front.position.set(0, 0, 8);
    scene.add(front);

    const bot = new THREE.PointLight(0xffcc88, 20, 12);
    bot.position.set(0, -6, 4);
    scene.add(bot);

    const leftL = new THREE.PointLight(0x88aaff, 18, 12);
    leftL.position.set(-6, 2, 3);
    scene.add(leftL);

    // ── MOUSE SPRING ──────────────────────────────────────────
    const mouse = { x: 0, y: 0 };
    const vel = { x: 0, y: 0 };
    const curr = { x: 0, y: 0 };
    const STIFF = 0.16, DAMP = 0.70;

    const onMouse = (e) => {
      mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', onMouse);

    const pivot = new THREE.Group();
    scene.add(pivot);

    // ── LOAD & APPLY ──────────────────────────────────────────
    let animId, model = null, entered = false;
    const startT = performance.now();
    const ENTER = 1800;
    const easeOutExpo = (t) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
    const easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

    // Build the corrected baseColor texture first, then load the GLTF
    buildGlassBaseColor(
      '/textures/blinn2_baseColor.png',
      '/textures/blinn2_transmission.png'
    ).then((correctedBase) => {
      const tl = new THREE.TextureLoader();

      const metRough = tl.load('/textures/blinn2_metallicRoughness.png');
      metRough.flipY = false;
      metRough.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const normalTex = tl.load('/textures/blinn2_normal.png');
      normalTex.flipY = false;
      normalTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

      correctedBase.anisotropy = renderer.capabilities.getMaxAnisotropy();

      // Build final material with corrected textures
      const lensMat = new THREE.MeshStandardMaterial({
        map: correctedBase,  // dark glass baked in
        metalnessMap: metRough,
        roughnessMap: metRough,
        normalMap: normalTex,
        normalScale: new THREE.Vector2(1.5, 1.5),
        metalness: 1.0,
        roughness: 1.0,
        envMap: envMap,
        envMapIntensity: 0.8,
        transparent: false,
        opacity: 1.0,
        side: THREE.FrontSide,
      });

      // Now load the GLTF geometry (we ignore its material completely)
      const loader = new GLTFLoader();
      loader.load('/scene.gltf', (gltf) => {
        const root = gltf.scene;

        // Scale & center
        const box = new THREE.Box3().setFromObject(root);
        const sz = new THREE.Vector3();
        const ctr = new THREE.Vector3();
        box.getSize(sz); box.getCenter(ctr);
        const sc = 2.0 / Math.max(sz.x, sz.y, sz.z);
        root.scale.setScalar(sc);
        box.setFromObject(root);
        box.getCenter(ctr);
        root.position.sub(ctr);

        // Apply our corrected material to all meshes
        root.traverse((child) => {
          if (!child.isMesh) return;
          child.material = lensMat;
          child.castShadow = true;
          child.receiveShadow = true;
        });

        // Orient: front glass faces camera
        root.rotation.set(0, Math.PI / 2, 0);
        root.rotation.x = 0.12;
        root.rotation.z = -0.03;

        // ── Add iridescent glass overlay on front face ────────
        // Placed at the front of the lens to add the T* coating shimmer
        const glassMat = new THREE.MeshPhysicalMaterial({
          color: 0x030810,
          metalness: 0.0,
          roughness: 0.0,
          transparent: true,
          opacity: 0.80,
          envMap: envMap,
          envMapIntensity: 2.5,
          iridescence: 1.0,
          iridescenceIOR: 1.9,
          iridescenceThicknessRange: [80, 650],
          side: THREE.FrontSide,
          depthWrite: false,
        });

        const frontZ = sz.x * sc * 0.46;
        const domeGeo = new THREE.SphereGeometry(0.70, 128, 128, 0, Math.PI * 2, 0, 0.52);
        const dome = new THREE.Mesh(domeGeo, glassMat);
        dome.rotation.x = Math.PI;
        dome.position.set(0, 0, frontZ);
        root.add(dome);

        // Aperture blades
        const bm = new THREE.MeshStandardMaterial({ color: 0x020204, metalness: 0.5, roughness: 0.4 });
        for (let i = 0; i < 9; i++) {
          const a = (i / 9) * Math.PI * 2;
          const bs = new THREE.Shape();
          bs.moveTo(0, 0);
          bs.quadraticCurveTo(0.17, 0.09, 0.26, 0.01);
          bs.quadraticCurveTo(0.17, -0.08, 0, 0);
          const blade = new THREE.Mesh(
            new THREE.ExtrudeGeometry(bs, { depth: 0.006, bevelEnabled: false }), bm);
          blade.position.set(Math.cos(a) * 0.12, Math.sin(a) * 0.12, frontZ + 0.12);
          blade.rotation.z = a + Math.PI / 2;
          root.add(blade);
        }

        // Center dark well
        const well = new THREE.Mesh(
          new THREE.CircleGeometry(0.16, 48),
          new THREE.MeshStandardMaterial({ color: 0x010102, roughness: 1 })
        );
        well.position.set(0, 0, frontZ + 0.16);
        root.add(well);

        // Catchlight
        const catchlight = new THREE.Mesh(
          new THREE.CircleGeometry(0.028, 24),
          new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.50 })
        );
        catchlight.position.set(0.13, 0.10, frontZ + 0.17);
        root.add(catchlight);

        root.userData.sc = sc;
        root.scale.setScalar(0.001);
        root.position.y -= 1.0;

        pivot.add(root);
        model = root;
      },
        undefined,
        (e) => console.error('[HalideHero] GLTF error:', e));
    });

    // ── ANIMATE ───────────────────────────────────────────────
    const animate = () => {
      animId = requestAnimationFrame(animate);
      const now = performance.now();

      if (model) {
        const bs = model.userData.sc || 1;
        if (!entered) {
          const raw = Math.min((now - startT) / ENTER, 1);
          const ep = easeOutBack(easeOutExpo(raw));
          model.scale.setScalar(ep * bs);
          model.position.y = -1.0 * (1 - easeOutExpo(raw));
          if (raw >= 1) { entered = true; model.scale.setScalar(bs); model.position.y = 0; }
        }
        vel.x = vel.x * DAMP + (mouse.y * 0.35 - curr.x) * STIFF;
        vel.y = vel.y * DAMP + (mouse.x * 0.50 - curr.y) * STIFF;
        curr.x += vel.x; curr.y += vel.y;
        pivot.rotation.x = curr.x;
        pivot.rotation.y = curr.y;
        pivot.rotation.z += 0.00006;
      }
      renderer.render(scene, camera);
    };
    animate();

    // ── RESIZE ────────────────────────────────────────────────
    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouse);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Syncopate:wght@400;700&display=swap');
        :root { --silver:#e0e0e0; --grain:0.11; }
        .hh-root {
          position:absolute; inset:0; width:100vw; height:100vh;
          overflow:hidden; display:flex; align-items:center; justify-content:center;
          pointer-events:none; background:transparent;
        }
        .hh-rings {
          position:absolute; inset:0; z-index:0; pointer-events:none;
          background: repeating-radial-gradient(
            circle at 50% 50%, transparent 0px, transparent 55px,
            rgba(255,255,255,0.025) 56px, transparent 57px
          );
          animation: hh-pulse 8s ease-in-out infinite;
        }
        @keyframes hh-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .hh-vignette {
          position:absolute; inset:0; z-index:1; pointer-events:none;
          background:radial-gradient(ellipse 80% 80% at 50% 50%,
            transparent 25%, rgba(0,0,0,0.72) 100%);
        }
        .hh-grain { position:absolute; inset:0; pointer-events:none; z-index:99; opacity:var(--grain); }
        .hh-canvas { position:absolute; inset:0; pointer-events:none; z-index:2; }
        .hh-canvas canvas { width:100%!important; height:100%!important; }
        .hh-title {
          position:absolute; inset:0; padding-left:clamp(2.5rem,8vw,8rem);
          display:flex; flex-direction:column; justify-content:center;
          align-items:flex-start; z-index:10; pointer-events:none;
        }
        .hh-title h1 {
          font-family:'Playfair Display',serif;
          font-size:clamp(3.2rem,9vw,9.5rem); line-height:1.05;
          letter-spacing:-0.02em; color:#fff; font-weight:600; margin:0;
          text-shadow:0 2px 40px rgba(0,0,0,0.8);
        }
        .hh-title h1 em { font-style:italic; font-weight:400; color:rgba(255,255,255,0.88); }
        .hh-sub {
          font-family:'Syncopate',sans-serif; font-size:clamp(.5rem,.9vw,.75rem);
          letter-spacing:.32em; text-transform:uppercase;
          color:rgba(255,255,255,.28); margin-top:1.2rem; font-weight:400;
        }
        .hh-scroll {
          position:absolute; bottom:2rem; left:50%; width:1px; height:56px;
          background:linear-gradient(to bottom,rgba(255,255,255,.5),transparent);
          z-index:10; animation:hh-flow 2.2s infinite ease-in-out;
        }
        @keyframes hh-flow {
          0%,100%{transform:scaleY(0);transform-origin:top}
          50%{transform:scaleY(1);transform-origin:top}
          51%{transform:scaleY(1);transform-origin:bottom}
        }
      `}</style>

      <div className="hh-root">
        <svg style={{ position: 'absolute', width: 0, height: 0 }}>
          <filter id="hh-gf">
            <feTurbulence type="fractalNoise" baseFrequency="0.66" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </svg>
        <div className="hh-rings" />
        <div className="hh-vignette" />
        <div className="hh-grain" style={{ filter: 'url(#hh-gf)' }} />
        <div className="hh-canvas" ref={mountRef} />
        <div className="hh-title">
          <h1>Khushi<br /><em>Films</em></h1>
          <p className="hh-sub">Cinematic · Timeless · Yours</p>
        </div>
        <div className="hh-scroll" />
      </div>
    </>
  );
};

export default HalideHero;