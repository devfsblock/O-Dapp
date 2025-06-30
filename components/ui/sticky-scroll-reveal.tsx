"use client"

import { useRef, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "framer-motion"

interface Item {
  title: string
  content: string
}

export function StickyScrollReveal({ items }: { items: Item[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return

      const { top, height } = containerRef.current.getBoundingClientRect()
      const scrollPosition = window.innerHeight - top
      const sectionHeight = height / items.length

      const newIndex = Math.min(items.length - 1, Math.max(0, Math.floor(scrollPosition / sectionHeight)))

      setActiveIndex(newIndex)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [items.length])

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])

  return (
    <div ref={containerRef} className="relative h-[400px] space-y-16 py-8">
      {items.map((item, index) => (
        <motion.div
          key={index}
          className={`sticky top-1/2 -translate-y-1/2 rounded-lg border border-border p-4 transition-all duration-300 ${
            index === activeIndex ? "bg-primary/5 border-primary/50" : ""
          }`}
          style={{
            opacity: index === activeIndex ? 1 : 0.5,
            scale: index === activeIndex ? 1 : 0.95,
          }}
        >
          <h3 className="mb-2 font-medium">{item.title}</h3>
          <p className="text-sm text-muted-foreground">{item.content}</p>
        </motion.div>
      ))}
    </div>
  )
}
