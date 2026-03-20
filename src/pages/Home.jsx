import { useRef } from 'react';
import ScrollAnimatedVideo from '../components/ScrollAnimatedVideo';
import HalideHero from '../components/HalideHero';
import { PortfolioTimeline } from '../components/PortfolioTimeline';
import { Footer } from '../components/ui/FooterSection';

export default function Home() {
  const container = useRef();

  const heroJSX = (
    <div className="flex flex-col items-center justify-center h-full w-full relative">
      <HalideHero />
    </div>
  );

  const overlayJSX = (
    <div className="w-full relative">
      <PortfolioTimeline />
      <Footer />
    </div>
  );

  return (
    <div ref={container} className="h-full w-full">
      <ScrollAnimatedVideo
        videoSrc="https://www.w3schools.com/html/mov_bbb.mp4"
        heroContent={heroJSX}
        overlayContent={overlayJSX}
        showBadges={false}
        scrollHeightVh={300}
      />
    </div>
  );
}
