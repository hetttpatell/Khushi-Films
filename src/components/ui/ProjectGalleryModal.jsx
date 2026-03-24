import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const VideoPlayer = ({ src, poster }) => {
  const videoRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black/20 rounded-xl overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        controls
        playsInline
        className={`max-h-[70vh] w-auto rounded-xl transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoadedData={() => setIsLoaded(true)}
      />
    </div>
  );
};

export const ProjectGalleryModal = ({ isOpen, onClose, title, items = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'image', 'video'

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setCurrentIndex(0);
      setActiveFilter('all');
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredItems = items.filter(item => {
    if (activeFilter === 'all') return true;
    return item.type === activeFilter;
  });

  const nextSlide = (e) => {
    if (e) e.stopPropagation();
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % filteredItems.length);
  };

  const prevSlide = (e) => {
    if (e) e.stopPropagation();
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
  };

  const handleDragEnd = (e, { offset, velocity }) => {
    const swipe = offset.x;
    if (swipe < -50) nextSlide();
    else if (swipe > 50) prevSlide();
  };

  if (!isOpen) return null;

  const currentItem = filteredItems[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-3xl p-4 md:p-10 overflow-hidden touch-none"
        onClick={onClose}
      >
        {/* Cinematic Grain Overlay */}
        <div className="absolute inset-0 z-1 pointer-events-none opacity-20 contrast-[1.1] mix-blend-soft-light" style={{ backgroundImage: 'url("https://grainy-gradients.vercel.app/noise.svg")' }} />

        {/* Close Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-8 right-8 z-[10000] w-12 h-12 rounded-full bg-white/5 hover:bg-white hover:text-black border border-white/10 flex items-center justify-center text-white transition-all duration-500 backdrop-blur-xl"
          onClick={onClose}
        >
          <span className="text-xl">✕</span>
        </motion.button>

        {/* Filter Tabs - Premium Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-8 left-1/2 -translate-x-1/2 z-[10000] flex gap-2 p-1.5 rounded-full bg-white/[0.03] border border-white/10 backdrop-blur-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {['all', 'image', 'video'].map((filter) => {
            const count = filter === 'all' 
              ? items.length 
              : items.filter(i => i.type === filter).length;
            
            if (count === 0 && filter !== 'all') return null;

            return (
              <button
                key={filter}
                onClick={() => {
                  setDirection(0);
                  setActiveFilter(filter);
                  setCurrentIndex(0);
                }}
                className={`relative px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                  activeFilter === filter ? 'text-black' : 'text-white/40 hover:text-white'
                }`}
              >
                {activeFilter === filter && (
                  <motion.div
                    layoutId="activeFilterBg"
                    className="absolute inset-0 bg-white rounded-full -z-1 shadow-[0_4px_15px_rgba(255,255,255,0.2)]"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{filter} {count > 0 && `(${count})`}</span>
              </button>
            );
          })}
        </motion.div>

        {/* corner labels : Title & Counter */}
        <div className="hidden md:block fixed bottom-10 left-10 z-[10000] select-none pointer-events-none">
          <motion.h4
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white/30 text-xs font-medium tracking-[0.4em] uppercase"
          >
            Project
          </motion.h4>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-3xl font-serif mt-1 italic"
          >
            {title}
          </motion.div>
        </div>

        <div className="hidden md:block fixed bottom-10 right-10 z-[10000] text-right select-none pointer-events-none">
           <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-white/30 text-xs font-medium tracking-[0.4em] uppercase"
          >
            Sequence
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-white text-3xl font-serif mt-1"
          >
            {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}
            <span className="text-white/20 mx-2">/</span>
            <span className="text-white/40">{filteredItems.length < 10 ? `0${filteredItems.length}` : filteredItems.length}</span>
          </motion.div>
        </div>

        {/* Navigation Buttons */}
        {filteredItems.length > 1 && (
          <>
            <button
              className="fixed left-6 md:left-12 top-1/2 -translate-y-1/2 z-[10000] w-14 h-14 md:w-20 md:h-20 flex items-center justify-center text-white/20 hover:text-white transition-all duration-500 group"
              onClick={prevSlide}
            >
              <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 blur-xl opacity-0 group-hover:opacity-10" />
              <span className="text-5xl font-light">‹</span>
            </button>
            <button
              className="fixed right-6 md:right-12 top-1/2 -translate-y-1/2 z-[10000] w-14 h-14 md:w-20 md:h-20 flex items-center justify-center text-white/20 hover:text-white transition-all duration-500 group"
              onClick={nextSlide}
            >
              <div className="absolute inset-0 bg-white/5 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500 blur-xl opacity-0 group-hover:opacity-10" />
              <span className="text-5xl font-light">›</span>
            </button>
          </>
        )}

        {/* Content Wrapper */}
        <div 
          className="relative w-full h-full max-w-7xl flex flex-col items-center justify-center z-10"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Mobile only Title & Counter */}
          <div className="md:hidden mb-8 text-center">
            <h3 className="text-xl font-serif font-bold text-white italic">{title}</h3>
            <p className="text-white/40 text-[10px] tracking-[0.2em] font-bold mt-2 uppercase">
              {currentIndex + 1} / {filteredItems.length}
            </p>
          </div>

          <div className="relative w-full flex items-center justify-center min-h-[50vh]">
            <AnimatePresence mode="wait" custom={direction}>
              {filteredItems.length > 0 ? (
                <motion.div
                  key={currentItem.url}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 50, scale: 0.98, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, x: 0, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, x: direction * -50, scale: 0.98, filter: 'blur(10px)' }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.5}
                  onDragEnd={handleDragEnd}
                  className="w-full flex justify-center cursor-grab active:cursor-grabbing"
                >
                  {currentItem.type === 'video' ? (
                    <VideoPlayer src={currentItem.url} poster={currentItem.thumbnail} />
                  ) : (
                    <img
                      src={currentItem.url}
                      alt={title}
                      className="max-h-[75vh] md:max-h-[80vh] w-auto rounded-xl object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)] pointer-events-none"
                    />
                  )}
                </motion.div>
              ) : (
                <div className="text-white/20 text-xl font-serif italic py-32">No items match your selection.</div>
              )}
            </AnimatePresence>
          </div>

          {/* Thumbnails Strip - Discrete Bottom Placement */}
          {filteredItems.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-12 flex gap-3 overflow-x-auto pb-4 px-6 no-scrollbar max-w-[90vw] md:max-w-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {filteredItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`flex-shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border transition-all duration-700 ${
                    idx === currentIndex ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,255,255,0.2)]' : 'border-white/5 opacity-30 grayscale hover:opacity-100 hover:grayscale-0'
                  }`}
                  data-cursor="media"
                >
                  <img 
                    src={item.type === 'video' ? item.thumbnail : item.url} 
                    alt="" 
                    className="w-full h-full object-cover pointer-events-none"
                  />
                </button>
              ))}
            </motion.div>
          )}

        </div>
      </motion.div>
    </AnimatePresence>
  );
};

