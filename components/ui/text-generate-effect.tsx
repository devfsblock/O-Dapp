"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function TextGenerateEffect({ words, className = "" }: { words: string; className?: string }) {
  const [wordArray, setWordArray] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setWordArray(words.split(" "))
  }, [words])

  useEffect(() => {
    if (currentIndex < wordArray.length) {
      const timeout = setTimeout(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1)
      }, 40)

      return () => clearTimeout(timeout)
    } else {
      setIsComplete(true)
    }
  }, [currentIndex, wordArray.length])

  return (
    <div className={className}>
      {wordArray.map((word, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={index <= currentIndex ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="mr-1 inline-block"
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}
