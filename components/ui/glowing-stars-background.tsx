// "use client"

// import { useEffect, useRef, useState } from "react"
// import { motion } from "framer-motion"

// export function GlowingStarsBackground() {
//   const [stars, setStars] = useState<{ x: number; y: number; size: number; opacity: number }[]>([])
//   const containerRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     if (!containerRef.current) return

//     const { width, height } = containerRef.current.getBoundingClientRect()
//     const newStars = Array.from({ length: 100 }, () => ({
//       x: Math.random() * width,
//       y: Math.random() * height,
//       size: Math.random() * 2 + 1,
//       opacity: Math.random() * 0.7 + 0.3,
//     }))

//     setStars(newStars)
//   }, [])

//   return (
//     <div ref={containerRef} className="absolute inset-0 overflow-hidden">
//       {stars.map((star, i) => (
//         <motion.div
//           key={i}
//           className="absolute rounded-full bg-white"
//           style={{
//             left: star.x,
//             top: star.y,
//             width: star.size,
//             height: star.size,
//           }}
//           animate={{
//             opacity: [star.opacity, star.opacity * 0.5, star.opacity],
//           }}
//           transition={{
//             duration: 2 + Math.random() * 3,
//             repeat: Number.POSITIVE_INFINITY,
//             ease: "easeInOut",
//           }}
//         />
//       ))}
//       <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80" />
//     </div>
//   )
// }
