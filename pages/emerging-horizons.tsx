"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bitcoin, ArrowRight, Hospital, Landmark } from "lucide-react"
import ProtectedLayout from "../components/protected-layout"
import { TextGenerateEffect } from "../components/ui/text-generate-effect"
import Image from "next/image"
import { useState } from "react"

const niches = [
	{
		id: "crypto",
		title: "Crypto & Defi",
		description: "Label cryptocurrency data, trading patterns, and blockchain transactions for AI models.",
		icon: Bitcoin,
		image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?auto=format&fit=crop&w=400&q=80", // Crypto
		comingSoon: false,
	},
	{
		id: "healthcare",
		title: "Healthcare",
		description: "Annotate medical images, patient data, and clinical research for healthcare AI.",
		icon: Hospital,
		image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=400&q=80", // Healthcare
		comingSoon: true,
	},

	// {
	//   id: "automotive",
	//   title: "Automotive",
	//   description: "Label autonomous vehicle data and traffic scenarios for smart transportation.",
	//   icon: ArrowRight,
	//   image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=80", // Automotive
	//   comingSoon: true,
	// },
	{
		id: "gaming",
		title: "Gaming",
		description: "Enhance gaming experiences through intelligent data analysis.",
		icon: ArrowRight,
		image: "https://images.unsplash.com/photo-1606813907291-96e4d91dc5d6?auto=format&fit=crop&w=400&q=80", // Gaming
		comingSoon: true,
	},
	{
		id: "finance",
		title: "Finance",
		description: "Power the next generation of fintech solutions.",
		icon: Landmark,
		image: "https://images.unsplash.com/photo-1542744173-05336fcc7ad4?auto=format&fit=crop&w=400&q=80", // Finance
		comingSoon: true,
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
	const [currentSlide, setCurrentSlide] = useState(0)
	const sliderImages = [
		"/images/defi-01.png",
		"/images/cod-airdrop.png", // Add another image path here if needed
	]

	const handleNextSlide = () => {
		setCurrentSlide((prev) => (prev + 1) % sliderImages.length)
	}

	const handlePrevSlide = () => {
		setCurrentSlide((prev) => (prev - 1 + sliderImages.length) % sliderImages.length)
	}

	const handleNicheClick = (nicheId: string) => {
		router.push(`/${nicheId}`)
	}

	return (
		<ProtectedLayout>
			<div className="space-y-8 container">
				<div className="relative w-full max-w-screen-lg mx-auto overflow-hidden rounded-lg">
					<div
						className="flex transition-transform duration-500 w-full"
						style={{ transform: `translateX(-${currentSlide * 100}%)` }}
					>
						{sliderImages.map((src, index) => (
							<div key={index} className="w-full flex-shrink-0">
								<Image
									src={src}
									alt={`Slide ${index + 1}`}
									width={1920}
									height={1080}
									className="w-full h-auto"
								/>
							</div>
						))}
					</div>
					<button
						onClick={handlePrevSlide}
						className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/70 p-2 rounded-full"
					>
						Prev
					</button>
					<button
						onClick={handleNextSlide}
						className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/70 p-2 rounded-full"
					>
						Next
					</button>
				</div>

				<div>
					<h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
						<TextGenerateEffect words="Emerging Horizons" />
					</h1>
					<p className="mt-2  text-muted-foreground"> Explore Data Labeling Opportunities.
						Choose a niche below to view available data labeling tasks. New categories are launching soon!</p>

				</div>

				<motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center">
					{niches.map((niche, idx) => {
						const isLaunchingSoon = niche.comingSoon;
						return (
							<motion.div key={niche.id} variants={item} className="w-full max-w-md sm:max-w-lg">
								<Card className="group cursor-pointer border-0 hover:border-[#4F6BFE]/30 transition-all duration-500 hover:shadow-2xl hover:shadow-[#4F6BFE]/25 aspect-[4/3] overflow-hidden relative bg-gradient-to-br from-white/90 to-gray-50/90 dark:from-gray-800/90 dark:to-gray-900/90 backdrop-blur-sm">
									<div
										className="absolute inset-0 bg-cover bg-center transition-all duration-500 group-hover:scale-110"
										style={{
											backgroundImage: `linear-gradient(135deg, rgba(150, 168, 255, 0.1), rgba(0,0,0,0.7)), url(${niche.image})`,
										}}
									/>
									<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:from-[#4F6BFE]/80 group-hover:via-[#4F6BFE]/20 transition-all duration-500" />
									{isLaunchingSoon && (
										<div className="absolute inset-0 flex items-center justify-center bg-black/70 z-20">
											<span className="text-white text-lg font-bold bg-[#4F6BFE] px-4 py-2 rounded-xl shadow-lg">Launching Soon</span>
										</div>
									)}
									<CardContent className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6">
										<div className="flex items-start justify-between">
											<div className="flex-1">
												<h3 className="text-xl sm:text-2xl font-bold text-white mb-2 sm:mb-3 group-hover:text-[#00ffff] transition-all duration-300 tracking-tight">
													{niche.title}
												</h3>
												<p className="text-gray-200 text-sm sm:text-base leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
													{niche.description}
												</p>
											</div>
											<div className="ml-3 sm:ml-4 p-2 rounded-full bg-white/10 backdrop-blur-sm group-hover:bg-[#4F6BFE]/20 transition-all duration-300">
												<niche.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white group-hover:text-[#00ffff] transition-colors duration-300" />
											</div>
										</div>
										<div className="flex justify-end mt-4">
											<Button
												onClick={() => handleNicheClick(niche.id)}
												size="sm"
												disabled={isLaunchingSoon}
												className={`bg-[#4F6BFE] hover:bg-[#4F6BFE]/90 text-white font-medium transition-all duration-300 group-hover:shadow-lg group-hover:shadow-[#4F6BFE]/40 backdrop-blur-sm border border-[#4F6BFE] hover:border-[#4F6BFE] text-xs sm:text-sm px-3 sm:px-4 py-2 ${isLaunchingSoon ? 'opacity-50 cursor-not-allowed' : ''}`}
											>
												{isLaunchingSoon ? 'Coming Soon' : 'Start'}
												{!isLaunchingSoon && <ArrowRight className="ml-1 h-3 w-3 group-hover:translate-x-1 transition-transform duration-300" />}
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
					className="text-center mt-12 sm:mt-16"
				>
					<div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-gray-200 dark:border-gray-800 shadow-lg">
						<h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
							Ready to Start Earning?
						</h3>
						<p className="text-gray-600 dark:text-gray-300 mb-4 sm:mb-6 max-w-2xl mx-auto text-sm sm:text-base">
							Join thousands of data labelers contributing to the future of AI. Choose your specialty and start making
							an impact today.
						</p>
						<div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4">
							<Button onClick={() => router.push("/academy")} size="lg" className="bg-[#4F6BFE] hover:bg-[#4F6BFE]/90 text-white w-full sm:w-auto">
								Get Started Now
							</Button>

						</div>
					</div>
				</motion.div>
			</div>

		</ProtectedLayout>
	)
}
