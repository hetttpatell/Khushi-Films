import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { NavBar } from './components/ui/TubelightNavbar';
import { CustomCursor } from './components/ui/CustomCursor';
import WelcomeScreen from './components/ui/WelcomeScreen';
import PageTransition from './components/PageTransition';
import { Home as HomeIcon, User, Briefcase, Mail } from 'lucide-react';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Booking from './pages/Booking';
import './App.css';

/* ── Animated routes ─────────────────────────────────────────── */
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/about" element={<PageTransition><About /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><Projects /></PageTransition>} />
        <Route path="/booking" element={<PageTransition><Booking /></PageTransition>} />
        <Route path="*" element={<PageTransition><Home /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

const NAV_ITEMS = [
  { name: 'Home', url: '/', icon: HomeIcon },
  { name: 'About', url: '/about', icon: User },
  { name: 'Projects', url: '/projects', icon: Briefcase },
  { name: 'Contact', url: '/booking', icon: Mail },
];

/* ── Inner app (needs Router context) ───────────────────────── */
function AppInner() {
  const [welcomed, setWelcomed] = useState(
    () => sessionStorage.getItem('kf_welcomed') === '1'
  );

  return (
    <>
      {/* Welcome screen — fixed z-1000, sits over everything */}
      <AnimatePresence>
        {!welcomed && (
          <WelcomeScreen
            key="welcome"
            onComplete={() => {
              sessionStorage.setItem('kf_welcomed', '1');
              setWelcomed(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* Main site — mounts immediately so HalideHero warms up */}
      <main
        className="bg-black min-h-screen text-white antialiased"
        style={{ position: 'relative', zIndex: 0, isolation: 'isolate' }}
      >
        <CustomCursor />
        <NavBar items={NAV_ITEMS} />
        <AnimatedRoutes />
      </main>
    </>
  );
}

/* ── Root ────────────────────────────────────────────────────── */
export default function App() {
  return (
    <Router>
      <AppInner />
    </Router>
  );
}