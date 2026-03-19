import { useRef } from 'react';
import ScrollAnimatedVideo from './components/ScrollAnimatedVideo';
import HalideHero from './components/HalideHero';
import { PortfolioTimeline } from './components/PortfolioTimeline';
import { NavBar } from './components/ui/TubelightNavbar';
import { CustomCursor } from './components/ui/CustomCursor';
import { Home, User, Briefcase, FileText } from 'lucide-react';
import './App.css';

function App() {
  const container = useRef();

  const navItems = [
    { name: 'Home', url: '#', icon: Home },
    { name: 'About', url: '#', icon: User },
    { name: 'Projects', url: '#', icon: Briefcase },
    { name: 'Resume', url: '#', icon: FileText }
  ];

  const heroJSX = (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      <HalideHero />
    </div>
  );

  const overlayJSX = (
    <div className="w-full relative">
      <PortfolioTimeline />
    </div>
  );

  return (
    <main ref={container} className="bg-black min-h-screen text-white antialiased relative">
      <CustomCursor />
      <NavBar items={navItems} />
      <ScrollAnimatedVideo
        videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"
        heroContent={heroJSX}
        overlayContent={overlayJSX}
        showBadges={false}
        scrollHeightVh={300}
      />
    </main>
  );
}

export default App;