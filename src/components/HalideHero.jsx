import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// ─────────────────────────────────────────────────────────────────────────────
//  HalideHero
//  Loads scene.gltf + manually rebuilds the material bypassing
//  KHR_materials_transmission which makes the mesh invisible.
//  Textures must be in /public/textures/
// ─────────────────────────────────────────────────────────────────────────────
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
    renderer.toneMappingExposure = 1.8;
    renderer.shadowMap.enabled = true;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    // ── SCENE & CAMERA ────────────────────────────────────────
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      34, mount.clientWidth / mount.clientHeight, 0.1, 100
    );
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // ── LIGHTS — dramatic product studio ─────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    // Strong warm key — top left, main illumination
    const key = new THREE.SpotLight(0xfff5e8, 600);
    key.position.set(-4, 7, 6);
    key.angle = Math.PI / 6;
    key.penumbra = 0.4;
    key.castShadow = true;
    scene.add(key);

    // Cool blue rim from behind right
    const rim = new THREE.SpotLight(0x5577ff, 350);
    rim.position.set(6, -2, -5);
    rim.angle = Math.PI / 5;
    rim.penumbra = 0.6;
    scene.add(rim);

    // Top grazing — reveals every ring and texture
    const top = new THREE.DirectionalLight(0xffffff, 4.0);
    top.position.set(1, 12, 3);
    scene.add(top);

    // Front fill — creates glass reflections
    const front = new THREE.PointLight(0xddeeff, 60, 14);
    front.position.set(0, 0, 8);
    scene.add(front);

    // Bottom warm fill
    const bottom = new THREE.PointLight(0xffcc88, 30, 12);
    bottom.position.set(0, -6, 4);
    scene.add(bottom);

    // Left accent — edge separation on barrel
    const leftAcc = new THREE.PointLight(0x88aaff, 25, 12);
    leftAcc.position.set(-6, 2, 3);
    scene.add(leftAcc);

    // ── ENVIRONMENT MAP — studio reflections ─────────────────
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envScene = new THREE.Scene();
    envScene.add(new THREE.Mesh(
      new THREE.SphereGeometry(50, 8, 8),
      new THREE.MeshBasicMaterial({ color: 0x0a0a14, side: THREE.BackSide })
    ));
    // Bright studio bounce lights baked into env
    [
      [0xfff5e0, [-15, 20, 15], 5],
      [0x3355ff, [20, 4, -12], 3],
      [0xffffff, [0, 30, 5], 7],
      [0xffddb0, [10, -10, 10], 3],
    ].forEach(([c, p, r]) => {
      const m = new THREE.Mesh(new THREE.SphereGeometry(r, 6, 6),
        new THREE.MeshBasicMaterial({ color: c }));
      m.position.set(...p); envScene.add(m);
    });
    const envMap = pmrem.fromScene(envScene).texture;
    scene.environment = envMap;

    // ── LOAD TEXTURES MANUALLY ────────────────────────────────
    // Bypass the broken GLTF KHR_materials_transmission material
    const tl = new THREE.TextureLoader();

    const baseColor = tl.load('/textures/blinn2_baseColor.png');
    baseColor.colorSpace = THREE.SRGBColorSpace;
    baseColor.flipY = false;
    baseColor.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const metRough = tl.load('/textures/blinn2_metallicRoughness.png');
    metRough.flipY = false;
    metRough.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const normalTex = tl.load('/textures/blinn2_normal.png');
    normalTex.flipY = false;
    normalTex.anisotropy = renderer.capabilities.getMaxAnisotropy();

    // Clean opaque MeshStandardMaterial with full PBR
    const lensMat = new THREE.MeshStandardMaterial({
      map: baseColor,
      metalnessMap: metRough,
      roughnessMap: metRough,
      normalMap: normalTex,
      normalScale: new THREE.Vector2(1.5, 1.5),
      metalness: 1.0,
      roughness: 1.0,
      envMap: envMap,
      envMapIntensity: 1.8,
      transparent: false,
      opacity: 1.0,
      side: THREE.FrontSide,
    });

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

    // ── LOAD GLTF ─────────────────────────────────────────────
    let animId, model = null, entered = false;
    const startT = performance.now();
    const ENTER = 1800;
    const easeOutExpo = (t) => t >= 1 ? 1 : 1 - Math.pow(2, -10 * t);
    const easeOutBack = (t) => 1 + 2.70158 * Math.pow(t - 1, 3) + 1.70158 * Math.pow(t - 1, 2);

    new GLTFLoader().load('/scene.gltf', (gltf) => {
      const root = gltf.scene;

      // ── Scale & center ────────────────────────────────────
      const box = new THREE.Box3().setFromObject(root);
      const sz = new THREE.Vector3();
      const ctr = new THREE.Vector3();
      box.getSize(sz);
      box.getCenter(ctr);
      const sc = 2.0 / Math.max(sz.x, sz.y, sz.z);
      root.scale.setScalar(sc);
      box.setFromObject(root);
      box.getCenter(ctr);
      root.position.sub(ctr);

      // ── Replace material on every mesh ───────────────────
      root.traverse((child) => {
        if (!child.isMesh) return;
        child.material = lensMat;  // ← our clean opaque material
        child.castShadow = true;
        child.receiveShadow = true;
      });

      // ── Orient: front glass faces camera (+Z) ─────────────
      // From GLTF matrices:
      //   Node 0 (Sketchfab_model): col-major = Y→-Z, Z→Y  (90° X rotation)
      //   Node 1 (camera lens.fbx): col-major = Y→Z, Z→-Y  (another 90° X)
      //   Combined: lens axis ends up along world X
      //   Front of lens points toward -X (as seen in screenshots)
      //   Fix: rotate +90° on Y → front goes from -X to +Z (camera)
      root.rotation.set(0, Math.PI / 2, 0);

      // Small tilt for 3D depth
      root.rotation.x = 0.12;
      root.rotation.z = -0.03;

      root.userData.sc = sc;
      root.scale.setScalar(0.001);
      root.position.y -= 1.0;

      pivot.add(root);
      model = root;
    },
      undefined,
      (e) => console.error('GLTF error:', e));

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
          if (raw >= 1) {
            entered = true;
            model.scale.setScalar(bs);
            model.position.y = 0;
          }
        }

        vel.x = vel.x * DAMP + (mouse.y * 0.35 - curr.x) * STIFF;
        vel.y = vel.y * DAMP + (mouse.x * 0.50 - curr.y) * STIFF;
        curr.x += vel.x;
        curr.y += vel.y;

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
      lensMat.dispose();
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
          overflow:hidden; display:flex;
          align-items:center; justify-content:center;
          pointer-events:none; background:transparent;
        }
        .hh-rings {
          position:absolute; inset:0; z-index:0; pointer-events:none;
          background: repeating-radial-gradient(
            circle at 50% 50%,
            transparent 0px, transparent 55px,
            rgba(255,255,255,0.025) 56px, transparent 57px
          );
          animation: hh-pulse 8s ease-in-out infinite;
        }
        @keyframes hh-pulse { 0%,100%{opacity:.6} 50%{opacity:1} }
        .hh-vignette {
          position:absolute; inset:0; z-index:1; pointer-events:none;
          background:radial-gradient(ellipse 80% 80% at 50% 50%,
            transparent 25%, rgba(0,0,0,0.70) 100%);
        }
        .hh-grain {
          position:absolute; inset:0; pointer-events:none;
          z-index:99; opacity:var(--grain);
        }
        .hh-canvas {
          position:absolute; inset:0; pointer-events:none; z-index:2;
        }
        .hh-canvas canvas { width:100%!important; height:100%!important; }
        .hh-title {
          position:absolute; inset:0;
          padding-left:clamp(2.5rem,8vw,8rem);
          display:flex; flex-direction:column;
          justify-content:center; align-items:flex-start;
          z-index:10; pointer-events:none;
        }
        .hh-title h1 {
          font-family:'Playfair Display',serif;
          font-size:clamp(3.2rem,9vw,9.5rem);
          line-height:1.05; letter-spacing:-0.02em;
          color:#fff; font-weight:600; margin:0;
          text-shadow:0 2px 40px rgba(0,0,0,0.7);
        }
        .hh-title h1 em { font-style:italic; font-weight:400; color:rgba(255,255,255,0.88); }
        .hh-sub {
          font-family:'Syncopate',sans-serif;
          font-size:clamp(.5rem,.9vw,.75rem);
          letter-spacing:.32em; text-transform:uppercase;
          color:rgba(255,255,255,.28); margin-top:1.2rem; font-weight:400;
        }
        .hh-scroll {
          position:absolute; bottom:2rem; left:50%;
          width:1px; height:56px;
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