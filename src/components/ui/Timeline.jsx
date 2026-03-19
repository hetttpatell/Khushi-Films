import {
  useScroll,
  useTransform,
  motion,
} from "framer-motion";
import React, { useEffect, useRef, useState } from "react";

export const Timeline = ({ data }) => {
  const ref = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setHeight(rect.height);
    }
  }, [ref, data]);

  // Track the window scroll, not a container!
  const { scrollYProgress } = useScroll();

  const heightTransform = useTransform(scrollYProgress, [0.1, 0.9], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0.1, 0.2], [0, 1]);

  return (
    <div
      className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10"
    >
      <div className="mx-auto py-20 px-4 md:px-8 lg:px-10" style={{ maxWidth: 1280 }}>
        <h2
          className="text-lg md:text-5xl mb-4 text-black dark:text-white font-bold"
          style={{ maxWidth: 896, fontFamily: "'Playfair Display', serif" }}
        >
          Showcase of Major Events
        </h2>
        <p
          className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base mt-4"
          style={{ maxWidth: 384 }}
        >
          We&apos;ve been capturing cinematic stories across the globe.
          Here&apos;s a glimpse into the events covered by Khushi Films.
        </p>
      </div>

      <div ref={ref} className="relative mx-auto pb-20" style={{ maxWidth: 1280 }}>
        {data.map((item, index) => (
          <div
            key={index}
            className="flex justify-start pt-10 md:pt-40 md:gap-10"
          >
            <div
              className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start md:w-full"
              style={{ maxWidth: 384 }}
            >
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 
                className="hidden md:block text-xl md:pl-20 md:text-5xl font-bold text-neutral-500 dark:text-neutral-500 "
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.title}
              </h3>
            </div>

            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 
                className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                {item.title}
              </h3>
              {item.content}
            </div>
          </div>
        ))}
        <div
          style={{
            height: height + "px",
          }}
          className="absolute md:left-8 left-8 top-0 overflow-hidden w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent from-[0%] via-neutral-200 dark:via-neutral-700 to-transparent to-[99%]  [mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)] "
        >
          <motion.div
            style={{
              height: heightTransform,
              opacity: opacityTransform,
            }}
            className="absolute inset-x-0 top-0  w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent from-[0%] via-[10%] rounded-full"
          />
        </div>
      </div>
    </div>
  );
};
