import { useRef } from 'react';
import ScrollAnimatedVideo from './components/ScrollAnimatedVideo';
import HalideHero from './components/HalideHero';
import './App.css';

function App() {
  const container = useRef();

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
    <main ref={container} className="bg-black min-h-screen text-white antialiased">
      <ScrollAnimatedVideo
        videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"
        heroContent={heroJSX}
        overlayContent={overlayJSX}
        showBadges={true}
      />
    </main>
  );
}

export default App;
