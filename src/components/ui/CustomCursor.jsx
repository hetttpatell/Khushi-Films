import React, { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

export function CustomCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 20, mass: 0.2 })
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 20, mass: 0.2 })
  
  const outerX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.5 })
  const outerY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.5 })

  const [hoverType, setHoverType] = useState('none') // 'none', 'link', 'media'
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateMousePosition = (e) => {
      if (!isVisible) setIsVisible(true)
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleMouseOver = (e) => {
      const target = e.target;
      const mediaTarget = target.closest('[data-cursor="media"]');
      
      if (mediaTarget) {
        setHoverType('media');
      } else if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setHoverType('link');
      } else {
        setHoverType('none');
      }
    }

    const handleMouseLeave = (e) => {
      if (!e.relatedTarget) {
        setIsVisible(false)
      }
    }

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640 || 'ontouchstart' in window)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    window.addEventListener("mousemove", updateMousePosition)
    window.addEventListener("mouseover", handleMouseOver)
    document.addEventListener("mouseout", handleMouseLeave)

    return () => {
      window.removeEventListener("resize", checkMobile)
      window.removeEventListener("mousemove", updateMousePosition)
      window.removeEventListener("mouseover", handleMouseOver)
      document.removeEventListener("mouseout", handleMouseLeave)
    }
  }, [isVisible])

  if (!isVisible || isMobile) return null

  const isHovering = hoverType !== 'none';

  return (
    <>
      <style>{`
        @media (min-width: 641px) {
          * {
            cursor: none !important;
          }
        }
      `}</style>

      {/* Outer outline ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full border border-white/30"
        style={{
          width: 32,
          height: 32,
          mixBlendMode: hoverType === 'media' ? "normal" : "difference",
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: hoverType === 'media' ? 1.8 : hoverType === 'link' ? 1.5 : 1,
          opacity: hoverType === 'media' ? 1 : isHovering ? 0 : 1,
          borderColor: hoverType === 'media' ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.5)",
          backgroundColor: hoverType === 'media' ? "rgba(255,255,255,0.1)" : "transparent",
        }}
      />

      {/* Inner solid dot / Lens label */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[100000] rounded-full flex items-center justify-center overflow-hidden"
        style={{
          mixBlendMode: hoverType === 'media' ? "normal" : "difference",
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: hoverType === 'media' ? "white" : "white",
        }}
        animate={{
          width: hoverType === 'media' ? 40 : hoverType === 'link' ? 40 : 8,
          height: hoverType === 'media' ? 40 : hoverType === 'link' ? 40 : 8,
          color: hoverType === 'media' ? "black" : "white",
        }}
      >
        <AnimatePresence>
          {hoverType === 'media' && (
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-[8px] font-black tracking-widest uppercase"
            >
              View
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  )
}

