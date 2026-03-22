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
  ];

  return (
    <div className="w-full h-full bg-neutral-950">
      <Timeline data={data} />
    </div>
  );
}
