import React, { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export function CustomCursor() {
  const mouseX = useMotionValue(-100)
  const mouseY = useMotionValue(-100)
  
  const smoothX = useSpring(mouseX, { stiffness: 300, damping: 20, mass: 0.2 })
  const smoothY = useSpring(mouseY, { stiffness: 300, damping: 20, mass: 0.2 })
  
  const outerX = useSpring(mouseX, { stiffness: 150, damping: 15, mass: 0.5 })
  const outerY = useSpring(mouseY, { stiffness: 150, damping: 15, mass: 0.5 })

  const [isHovering, setIsHovering] = useState(false)
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
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
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
  }, [])

  if (!isVisible || isMobile) return null

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
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full border border-white/50"
        style={{
          width: 32,
          height: 32,
          mixBlendMode: "difference",
          pointerEvents: "none",
          x: outerX,
          y: outerY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 1,
        }}
      />

      {/* Inner solid dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[10000] rounded-full bg-white"
        style={{
          mixBlendMode: "difference",
          pointerEvents: "none",
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%"
        }}
        animate={{
          width: isHovering ? 48 : 8,
          height: isHovering ? 48 : 8,
        }}
      />
    </>
  )
}
