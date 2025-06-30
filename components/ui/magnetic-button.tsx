"use client"

import type React from "react"
import { useRef, useState } from "react"
import { motion } from "framer-motion"

export function MagneticButton({ children }: { children: React.ReactNode }) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e
    const { left, top, width, height } = buttonRef.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    }

    const x = (clientX - (left + width / 2)) * 0.2
    const y = (clientY - (top + height / 2)) * 0.2

    setPosition({ x, y })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  return (
    <div ref={buttonRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="relative">
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15 }}
      >
        {children}
      </motion.div>
    </div>
  )
}
