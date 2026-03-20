import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Github,
  Twitter,
  Youtube,
  Linkedin,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Facebook
} from "lucide-react";
import { cn } from "../../lib/utils";

const testimonials = [
  {
    name: "Priya & Rahul",
    title: "Wedding Clients",
    description:
      "Khushi Films completely changed how we look at our wedding memories. The cinematography and emotional storytelling were incredible. They delivered well beyond our expectations and captured every single beautiful moment.",
    imageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=600&auto=format&fit=crop",
    instagramUrl: "#",
    facebookUrl: "#",
  },
  {
    name: "Jessica Roberts",
    title: "Event Organizer, InsightX",
    description:
      "The team from Khushi Films gave our corporate events the perfect visual representation. Their level of professionalism and the cinematic quality of the final videos went above and beyond our expectations.",
    imageUrl: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=600&q=80",
    linkedinUrl: "#",
    twitterUrl: "#",
  },
  {
    name: "Ananya & Vikram",
    title: "Pre-Wedding Shoot",
    description:
      "Khushi Films made our pre-wedding shoot an absolute dream. The locations, the lighting, and how they made us feel so comfortable resulted in a video that looks straight out of a movie.",
    imageUrl: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80",
    instagramUrl: "#",
    youtubeUrl: "#",
  },
];

export function TestimonialCarousel({ className }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () =>
    setCurrentIndex((index) => (index + 1) % testimonials.length);
  const handlePrevious = () =>
    setCurrentIndex((index) => (index - 1 + testimonials.length) % testimonials.length);

  const currentTestimonial = testimonials[currentIndex];

  const getSocialIcons = (testimonial) => {
    const icons = [];
    if (testimonial.instagramUrl) icons.push({ icon: Instagram, url: testimonial.instagramUrl, label: "Instagram" });
    if (testimonial.facebookUrl) icons.push({ icon: Facebook, url: testimonial.facebookUrl, label: "Facebook" });
    if (testimonial.linkedinUrl) icons.push({ icon: Linkedin, url: testimonial.linkedinUrl, label: "LinkedIn" });
    if (testimonial.twitterUrl) icons.push({ icon: Twitter, url: testimonial.twitterUrl, label: "Twitter" });
    if (testimonial.youtubeUrl) icons.push({ icon: Youtube, url: testimonial.youtubeUrl, label: "YouTube" });
    if (testimonial.githubUrl) icons.push({ icon: Github, url: testimonial.githubUrl, label: "GitHub" });
    return icons;
  };

  const socialIcons = getSocialIcons(currentTestimonial);

  return (
    <div
      className={cn("w-full relative z-[50] isolate pointer-events-auto", className)}
      style={{ maxWidth: "1200px", margin: "0 auto" }}
    >
      {/* Desktop Layout */}
      <div className="hidden md:flex relative items-center">
        <div className="w-[470px] h-[470px] rounded-3xl overflow-hidden bg-neutral-200 dark:bg-neutral-800 flex-shrink-0 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={currentTestimonial.imageUrl}
                alt={currentTestimonial.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-8 ml-[-80px] z-10 min-w-[300px] flex-1 border border-neutral-100 dark:border-neutral-800 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                  {currentTestimonial.name}
                </h2>
                <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  {currentTestimonial.title}
                </p>
              </div>

              <p className="text-neutral-800 dark:text-neutral-200 text-lg leading-relaxed mb-8 italic">
                "{currentTestimonial.description}"
              </p>

              <div className="flex space-x-4">
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <a
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white dark:text-neutral-900" />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden w-full max-w-lg mx-auto text-center bg-transparent px-4">
        <div className="w-full aspect-square bg-neutral-200 dark:bg-neutral-800 rounded-3xl overflow-hidden mb-6 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.imageUrl}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="absolute inset-0 w-full h-full"
            >
              <img
                src={currentTestimonial.imageUrl}
                alt={currentTestimonial.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-2 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.name}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>
                {currentTestimonial.name}
              </h2>
              <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-4">
                {currentTestimonial.title}
              </p>
              <p className="text-neutral-800 dark:text-neutral-200 text-base leading-relaxed mb-6 italic">
                "{currentTestimonial.description}"
              </p>
              <div className="flex justify-center space-x-4">
                {socialIcons.map(({ icon: IconComponent, url, label }) => (
                  <a
                    key={label}
                    href={url || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-neutral-900 dark:bg-white rounded-full flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                    aria-label={label}
                  >
                    <IconComponent className="w-5 h-5 text-white dark:text-neutral-900" />
                  </a>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Controls - Shared */}
      <div className="flex justify-center items-center gap-6 mt-12 relative z-[70] pointer-events-auto">
        <button
          type="button"
          onClick={handlePrevious}
          aria-label="Previous testimonial"
          className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-md flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer pointer-events-auto"
        >
          <ChevronLeft className="w-6 h-6 text-neutral-700 dark:text-neutral-300 pointer-events-none" />
        </button>

        <div className="flex gap-2 z-[70] relative pointer-events-auto">
          {testimonials.map((_, testimonialIndex) => (
            <button
              key={testimonialIndex}
              type="button"
              onClick={() => setCurrentIndex(testimonialIndex)}
              className={cn(
                "w-3 h-3 rounded-full transition-all cursor-pointer pointer-events-auto",
                testimonialIndex === currentIndex
                  ? "bg-neutral-900 dark:bg-white"
                  : "bg-neutral-400 dark:bg-neutral-600"
              )}
              aria-label={`Go to testimonial ${testimonialIndex + 1}`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next testimonial"
          className="w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 shadow-md flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all active:scale-95 cursor-pointer pointer-events-auto"
        >
          <ChevronRight className="w-6 h-6 text-neutral-700 dark:text-neutral-300 pointer-events-none" />
        </button>
      </div>
    </div>
  );
}
