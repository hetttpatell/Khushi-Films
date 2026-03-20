import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { NavBar } from './components/ui/TubelightNavbar';
import { CustomCursor } from './components/ui/CustomCursor';
import { Home as HomeIcon, User, Briefcase, FileText, Mail } from 'lucide-react';
import Home from './pages/Home';
import Projects from './pages/Projects';
import About from './pages/About';
import Booking from './pages/Booking';
import './App.css';

/**
 * ScrollToTop
 * ──────────────────────────────────────────────────────────────────
 * Listens for route changes and instantly snaps the window to the
 * top of the page. Placed *inside* <Router> so it has access to the
 * location context provided by React Router.
 *
 * Why `behavior: 'instant'` instead of `'smooth'`?
 * Smooth scrolling on a full-page-height site (300 vh scroll zones,
 * Lenis running) produces a jarring mid-animation jump. Instant is
 * the right UX here — the new page simply starts at the top.
 */
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

function App() {
  const navItems = [
    { name: 'Home', url: '/', icon: HomeIcon },
    { name: 'About', url: '/about', icon: User },
    { name: 'Projects', url: '/projects', icon: Briefcase },
    { name: 'Contact', url: '/booking', icon: Mail },
  ];

  return (
    <Router>
      {/* ScrollToTop must live inside Router to access useLocation */}
      <ScrollToTop />
      <main
        className="bg-black min-h-screen text-white antialiased"
        style={{ position: 'relative', zIndex: 0, isolation: 'isolate' }}
      >
        <CustomCursor />
        <NavBar items={navItems} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;