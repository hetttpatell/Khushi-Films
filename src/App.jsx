import { useRef } from 'react';
import ScrollAnimatedVideo from './components/ScrollAnimatedVideo';
import HalideHero from './components/HalideHero';
import { NavBar } from './components/ui/TubelightNavbar';
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
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-4xl mx-auto h-full">
      <h2 className="text-4xl md:text-6xl font-semibold text-white uppercase tracking-tight">
        Screen 3
      </h2>
    </div>
  );

  return (
    <main ref={container} className="bg-black min-h-screen text-white antialiased relative">
      <NavBar items={navItems} />
      <ScrollAnimatedVideo
        videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"
        heroContent={heroJSX}
        overlayContent={overlayJSX}
        showBadges={false}
      />
    </main>
  );
}

export default App;
