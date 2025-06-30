"use client"

import type React from "react"
import { motion } from "framer-motion"

export function CardHoverEffect({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="group relative overflow-hidden rounded-lg"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}
