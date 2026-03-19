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
    className="rounded-lg object-cover h-20 md:h-44 lg:h-60 w-full"
    style={{
      boxShadow:
        "0 0 24px rgba(34,42,53,0.06), 0 1px 1px rgba(0,0,0,0.05), 0 0 0 1px rgba(34,42,53,0.04), 0 0 4px rgba(34,42,53,0.08), 0 16px 68px rgba(47,48,55,0.05), inset 0 1px 0 rgba(255,255,255,0.1)",
    }}
  />
);

/* ── Check item ── */
const CheckItem = ({ text }) => (
  <div className="flex gap-2 items-center text-neutral-700 dark:text-neutral-300 text-xs md:text-sm">
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
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Built and launched over 50 cinematic wedding films across Rajasthan,
            Mumbai and Dubai. Introduced aerial drone footage and multi-cam
            live-switching into the production workflow.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <StoryImage
              src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&auto=format&fit=crop&q=80"
              alt="Wedding ceremony"
            />
            <StoryImage
              src="https://images.unsplash.com/photo-1519741497674-611481863552?w=600&auto=format&fit=crop&q=80"
              alt="Bride portrait"
            />
            <StoryImage
              src="https://images.unsplash.com/photo-1525772764200-be829a350797?w=600&auto=format&fit=crop&q=80"
              alt="Reception"
            />
            <StoryImage
              src="https://images.unsplash.com/photo-1606800052052-a08af7148866?w=600&auto=format&fit=crop&q=80"
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
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Expanded into commercial videography — partnering with fashion labels,
            hospitality brands and lifestyle startups to produce scroll-stopping
            content.
          </p>
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-8">
            Colour-grading pipeline upgraded to DaVinci Resolve with a bespoke
            LUT library. Shot 12 brand campaigns across 3 countries.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <StoryImage
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=600&auto=format&fit=crop&q=80"
              alt="Behind the scenes"
            />
            <StoryImage
              src="https://images.unsplash.com/photo-1533158307587-828f0a76ef46?w=600&auto=format&fit=crop&q=80"
              alt="Fashion shoot"
            />
            <StoryImage
              src="https://images.unsplash.com/photo-1574717024453-354056aed74d?w=600&auto=format&fit=crop&q=80"
              alt="Studio"
            />
            <StoryImage
              src="https://images.unsplash.com/photo-1585396023483-5ac1f3da1a7d?w=600&auto=format&fit=crop&q=80"
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
          <p className="text-neutral-800 dark:text-neutral-200 text-xs md:text-sm font-normal mb-4">
            Deployed 5 new components on Khushi Films today
          </p>
          <div className="mb-8">
            <CheckItem text="Best Wedding Film — India Wedding Awards 2022" />
            <CheckItem text="Top 10 Videographers — Wedding Sutra" />
            <CheckItem text="Featured in Vogue India vendor list" />
            <CheckItem text="Launched Cinematic Reels for Instagram brands" />
            <CheckItem text="Onboarded full post-production colour team" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <StoryImage
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80"
              alt="Award ceremony"
            />
            <StoryImage
              src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&auto=format&fit=crop&q=80"
              alt="Event coverage"
            />
            <StoryImage
              src="https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=600&auto=format&fit=crop&q=80"
              alt="Film reel"
            />
            <StoryImage
              src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80"
              alt="Cinema"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-white dark:bg-neutral-950">
      <Timeline data={data} />
    </div>
  );
}
