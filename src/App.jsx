import ScrollAnimatedVideo from './components/ScrollAnimatedVideo';
import Hero from './components/Hero';
import './App.css';

function App() {
  const overlayJSX = (
    <div className="flex flex-col items-center text-center glass-panel p-8 md:p-14 rounded-3xl max-w-4xl mx-auto">
      <h2 className="text-4xl md:text-6xl font-semibold mb-6 text-gradient uppercase tracking-tight">
        Every Frame Has a Pulse
      </h2>
      <p className="text-lg md:text-xl text-zinc-300 font-light max-w-2xl mb-10 leading-relaxed">
        We bridge the gap between imagination and reality. Specializing in high-end commercial production and intimate narratives, we turn moments into timeless cinema.
      </p>
      <button className="btn-primary">
        Explore Our Work
      </button>
    </div>
  );

  return (
    <main className="bg-black min-h-screen text-white antialiased">
      <ScrollAnimatedVideo 
        videoSrc="https://www.w3schools.com/html/mov_bbb.mp4" 
        heroContent={<Hero />}
        overlayContent={overlayJSX}
        showBadges={false}
      />
    </main>
  );
}

export default App;
