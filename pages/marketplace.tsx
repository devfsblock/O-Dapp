"use client"

import { motion } from "framer-motion"
import ProtectedLayout from "../components/protected-layout"
import { TextGenerateEffect } from "../components/ui/text-generate-effect"
import { GitHubGlobe } from "../components/ui/github-globe"

export default function Marketplace() {
  return (
    <ProtectedLayout>
      <div className="flex h-full flex-col items-center justify-center space-y-8 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl"
        >
          <h1 className="mb-4 bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-4xl font-bold text-transparent">
            <TextGenerateEffect words="Marketplace - Coming Soon" />
          </h1>
          <p className="mb-8 text-lg text-muted-foreground">
            Our Web3 marketplace is under development. Soon you'll be able to buy, sell, and trade digital assets on our
            secure platform.
          </p>
        </motion.div>

     

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8"
        >
          <button className="rounded-md bg-primary px-6 py-3 font-medium text-primary-foreground">Join Waitlist</button>
        </motion.div>
      </div>
    </ProtectedLayout>
  )
}
