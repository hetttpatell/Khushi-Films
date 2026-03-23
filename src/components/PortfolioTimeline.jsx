import React from "react";
import { Timeline } from "./ui/Timeline";
import { Camera, Award, Star, Film } from "lucide-react";

/* ── Reusable image card ── */
const StoryImage = ({ src, alt }) => (
  <img
    src={src}
    alt={alt}
    width={500}
    height={500}
    className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full hover:scale-[1.02] transition-transform duration-300"
    style={{
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    }}
  />
);

/* ── Check item ── */
const CheckItem = ({ text }) => (
  <div className="flex gap-2 items-center text-neutral-300 text-xs md:text-sm">
    ✅ {text}
  </div>
);

/* ── Main Component ── */
export function PortfolioTimeline() {
  const data = [
    {
      title: "Weddings",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Capturing the Essence of Your Love Story. From the grand palaces of
            Rajasthan to intimate beach vows, we create cinematic masterpieces 
            that turn your fleeting moments into eternal memories.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <StoryImage
              src="/New/compressed_wedding-1.jpg"
              alt="Wedding ceremony"
            />
            <StoryImage
              src="/New/compressed_wedding-2.jpg"
              alt="Bride portrait"
            />
            <StoryImage
              src="/New/compressed_wedding-4.jpg"
              alt="Reception"
            />
            <StoryImage
              src="/New/compressed_wedding-5.jpg"
              alt="Couple shoot"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Concerts",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Feel the Pulse of Every Beat. Bringing the electric energy of the 
            stage to the screen with high-octane visuals and soul-stirring 
            performances captured across global arenas.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <StoryImage
              src="/New/compressed_concert-1.jpg"
              alt="Behind the scenes"
            />
            <StoryImage
              src="/New/compressed_concert-2.jpg"
              alt="Fashion shoot"
            />
            <StoryImage
              src="/New/compressed_concert-3.jpg"
              alt="Studio"
            />
            <StoryImage
              src="/New/compressed_concert-4.jpg"
              alt="Product film"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Openings",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Launching Legacies with Unrivaled Grandeur. Documenting prestige, 
            style, and the excitement of new beginnings at every major 
            launch, ensuring your story starts with a cinematic bang.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <StoryImage
              src="/New/compressed_opening-1.jpg"
              alt="Award ceremony"
            />
            <StoryImage
              src="/New/compressed_opening-2.jpg"
              alt="Event coverage"
            />
            <StoryImage
              src="/New/compressed_opening-3.jpg"
              alt="Film reel"
            />
            <StoryImage
              src="/New/compressed_opening-4.jpg"
              alt="Cinema"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Modeling",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Sophisticated portfolios that capture your unique essence. From 
            lifestyle to high-fashion, we bring professional direction and 
            cinematic lighting to every shoot, ensuring you stand out.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <StoryImage
              src="/New/compressed_Rakesh-1.png"
              alt="Modeling portfolio"
            />
            <StoryImage
              src="/New/compressed_Rakesh-2.jpg"
              alt="Studio session"
            />
            <StoryImage
              src="/New/compressed_concert-2.jpg"
              alt="Fashion shoot"
            />
            <StoryImage
              src="/New/compressed_concert-3.jpg"
              alt="Lifestyle portrait"
            />
          </div>
        </div>
      ),
    },
    {
      title: "Kids Photography",
      content: (
        <div>
          <p className="text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Capturing the pure joy and innocence of childhood. From first 
            milestones to grand birthday celebrations, we turn fleeting 
            moments into lifelong treasures with warmth and creativity.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <StoryImage
              src="/New/compressed_babyshower-1.jpg"
              alt="Baby milestone"
            />
            <StoryImage
              src="/New/compressed_babyshower-2.jpg"
              alt="Kid portrait"
            />
            <StoryImage
              src="/New/compressed_birthday-1.jpg"
              alt="Birthday celebration"
            />
            <StoryImage
              src="/New/compressed_birthday-2.jpg"
              alt="Playful moment"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-neutral-950">
      <Timeline data={data} />
    </div>
  );
}
