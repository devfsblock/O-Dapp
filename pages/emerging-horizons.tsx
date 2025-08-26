"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bitcoin, Heart, ShoppingCart, Car, Gamepad2, Building2, Leaf, GraduationCap, ArrowRight } from "lucide-react"
import ProtectedLayout from "@/components/protected-layout"

const niches = [
  {
    id: "crypto",
    title: "Crypto",
    description: "Label cryptocurrency data, trading patterns, and blockchain transactions for AI models.",
    icon: Bitcoin,
    image: "/cryptocurrency-trading-chart.png",
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description: "Annotate medical images, patient data, and clinical research for healthcare AI.",
    icon: Heart,
    image: "/medical-x-ray-scan.png",
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Categorize products, analyze customer reviews, and optimize shopping experiences.",
    icon: ShoppingCart,
    image: "/product-catalog-interface.png",
  },
  {
    id: "automotive",
    title: "Automotive",
    description: "Label vehicle data, autonomous driving scenarios, and transportation analytics.",
    icon: Car,
    image: "/autonomous-vehicle-dashboard-interface.png",
  },
  {
    id: "gaming",
    title: "Gaming",
    description: "Annotate game data, player behavior, and interactive entertainment content.",
    icon: Gamepad2,
    image: "/gaming-interface-with-data-analytics.png",
  },
  {
    id: "finance",
    title: "Finance",
    description: "Process financial documents, market data, and investment analysis for fintech AI.",
    icon: Building2,
    image: "/financial-trading-dashboard.png",
  },
  {
    id: "sustainability",
    title: "Sustainability",
    description: "Label environmental data, climate patterns, and green technology initiatives.",
    icon: Leaf,
    image: "/environmental-monitoring-dashboard-with-green-ener.png",
  },
  {
    id: "education",
    title: "Education",
    description: "Annotate educational content, learning patterns, and academic research data.",
    icon: GraduationCap,
    image: "/educational-platform-interface-with-learning-analy.png",
  },
]

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

export default function EmergingHorizonsPage() {
  const router = useRouter()

  const handleNicheClick = (nicheId: string) => {
    router.push(`/tasks/${nicheId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4F6BFE]/10 via-white to-[#4F6BFE]/5 dark:from-[#4F6BFE]/10 dark:via-gray-900 dark:to-[#4F6BFE]/5">
      {/* Landscape graphics with reduced height */}
      <div className="relative h-32 overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1200 128"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <path
            d="M0,64 C150,20 300,100 450,60 C600,20 750,80 900,50 C1050,20 1150,70 1200,60 L1200,128 L0,128 Z"
            fill="url(#landscapeGradient)"
            opacity="0.3"
          />
          <path
            d="M0,80 C200,40 400,90 600,70 C800,50 1000,85 1200,75 L1200,128 L0,128 Z"
            fill="url(#landscapeGradient2)"
            opacity="0.2"
          />
          <defs>
            <linearGradient id="landscapeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4F6BFE" />
              <stop offset="50%" stopColor="#00ffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#4F6BFE" />
            </linearGradient>
            <linearGradient id="landscapeGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00ffff" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#4F6BFE" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-[#4F6BFE] mb-6">Emerging Horizons</h1>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {niches.map((niche) => {
            return (
              <motion.div key={niche.id} variants={item}>
                <Card className="group cursor-pointer border-0 hover:border-[#4F6BFE]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#4F6BFE]/25 aspect-[4/3] overflow-hidden relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
                    style={{
                      backgroundImage: `linear-gradient(135deg, rgba(79,107,254,0.1), rgba(0,0,0,0.7)), url(${niche.image})`,
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-[#4F6BFE]/80 group-hover:via-[#4F6BFE]/20 transition-all duration-500" />

                  <CardContent className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#00ffff] transition-all duration-300 tracking-tight">
                          {niche.title}
                        </h3>
                        <p className="text-gray-200 text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                          {niche.description}
                        </p>
                      </div>
                      <div className="ml-4 p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-[#4F6BFE]/20 transition-all duration-300">
                        <niche.icon className="h-6 w-6 text-white group-hover:text-[#00ffff] transition-colors duration-300" />
                      </div>
                    </div>

                    <div className="flex justify-end mt-4">
                      <Button
                        onClick={() => handleNicheClick(niche.id)}
                        size="sm"
                        className="bg-[#4F6BFE] hover:bg-[#4F6BFE]/90 text-white font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#4F6BFE]/40 backdrop-blur-sm border border-[#4F6BFE] hover:border-[#4F6BFE]"
                      >
                        Start
                        <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-8 border border-gray-200 dark:border-gray-800 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Ready to Start Earning?</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Join thousands of data labelers contributing to the future of AI. Choose your specialty and start making
              an impact today.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-[#4F6BFE] hover:bg-[#4F6BFE]/90 text-white">
                Get Started Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#4F6BFE] text-[#4F6BFE] hover:bg-[#4F6BFE] hover:text-white bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
