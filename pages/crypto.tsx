"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Star, Clock, CheckCircle, X, Award, Coins } from "lucide-react"
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card"
import ProtectedLayout from "../components/protected-layout"

const cryptoTasks = [
  {
    id: 1,
    image: "/cryptocurrency-trading-chart.png",
    title: "Bitcoin Price Pattern Analysis",
    description: "Analyze Bitcoin price movements and identify key trading patterns for algorithmic trading models.",
    address: "0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t",
    points: 150,
    difficulty: "Medium",
    timeEstimate: "15-20 min",
  },
  {
    id: 2,
    image: "/blockchain-transaction-network.png",
    title: "Transaction Flow Classification",
    description:
      "Classify blockchain transactions as legitimate or potentially suspicious for fraud detection systems.",
    address: "0x9s8r7q6p5o4n3m2l1k0j9i8h7g6f5e4d3c2b1a0z",
    points: 200,
    difficulty: "Hard",
    timeEstimate: "25-30 min",
  },
  {
    id: 3,
    image: "/cryptocurrency-wallet-interface.png",
    title: "Wallet Security Assessment",
    description: "Evaluate cryptocurrency wallet interfaces for security vulnerabilities and user experience issues.",
    address: "0x5f4e3d2c1b0a9z8y7x6w5v4u3t2s1r0q9p8o7n6m",
    points: 120,
    difficulty: "Easy",
    timeEstimate: "10-15 min",
  },
]

export default function CryptoPage() {
  const router = useRouter()
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [recommendation, setRecommendation] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [acceptReason, setAcceptReason] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("input")

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setModalOpen(true)
    setRecommendation("")
    setRejectReason("")
    setAcceptReason("")
    setShowSuccess(false)
    setActiveTab("input")
  }

  const handleSubmit = () => {
    setShowSuccess(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setSelectedTask(null)
    setShowSuccess(false)
  }

  return (
    <ProtectedLayout>
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#4F6BFE]/5 dark:from-gray-950 dark:via-gray-900 dark:to-[#4F6BFE]/10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push("/emerging-horizons")}
            className="mb-3 sm:mb-4 hover:bg-[#4F6BFE]/10 dark:hover:bg-[#4F6BFE]/20 text-sm sm:text-base"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Emerging Horizons
          </Button>

          <div className="mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#4F6BFE] to-cyan-400 bg-clip-text text-transparent mb-3 sm:mb-4">
              Crypto Tasks
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
              Contribute to the future of cryptocurrency and blockchain technology
            </p>
          </div>
        </motion.div>

        {/* How to Earn Rewards Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 sm:mb-8"
        >
          <Card className="border-gray-200 dark:border-gray-800 overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Award className="mr-2 h-5 w-5 text-yellow-500" />
                How to Earn Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4F6BFE]/10 dark:bg-[#4F6BFE]/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-[#4F6BFE] font-bold text-sm sm:text-base">1</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Select a Task</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Choose from available tasks that match your expertise and interests.
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4F6BFE]/10 dark:bg-[#4F6BFE]/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-[#4F6BFE] font-bold text-sm sm:text-base">2</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Complete the Work</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Follow the guidelines and provide high-quality annotations or classifications.
                  </p>
                </div>
                <div className="text-center sm:col-span-2 lg:col-span-1">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#4F6BFE]/10 dark:bg-[#4F6BFE]/20 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                    <span className="text-[#4F6BFE] font-bold text-sm sm:text-base">3</span>
                  </div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Earn Rewards</h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                    Receive points and tokens based on the quality and complexity of your work.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div> */}

      

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
            {cryptoTasks.map((task, index) => (
              <CardContainer key={task.id} className="inter-var" containerClassName="py-0">
                <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-full h-auto rounded-xl p-4 sm:p-6 border">
                  <CardItem
                    translateZ="50"
                    className="text-lg sm:text-xl font-bold text-neutral-600 dark:text-white cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    {task.title}
                  </CardItem>
                  <CardItem
                    as="p"
                    translateZ="60"
                    className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                  >
                    {task.description}
                  </CardItem>
                  <CardItem translateZ="100" className="w-full mt-4">
                    <img
                      src={task.image || "/placeholder.svg"}
                      height="1000"
                      width="1000"
                      className="h-48 sm:h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl cursor-pointer"
                      alt={task.title}
                      onClick={() => handleTaskClick(task)}
                    />
                  </CardItem>
                  <div className="flex justify-between items-center mt-4 sm:mt-6">
                    <CardItem
                      translateZ={20}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-[#4F6BFE] text-white text-xs font-bold flex items-center gap-1"
                    >
                      <Coins className="h-3 w-3 sm:h-4 sm:w-4" />
                      {task.points} points
                    </CardItem>
                    <CardItem
                      as="button"
                      translateZ={20}
                      className="px-3 sm:px-4 py-2 rounded-xl bg-[#4F6BFE] text-white text-xs font-bold hover:bg-[#4F6BFE]/90 transition-colors"
                      onClick={() => handleTaskClick(task)}
                    >
                      Start Task →
                    </CardItem>
                  </div>
                </CardBody>
              </CardContainer>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
                rotateX: -15,
                rotateY: 10,
                z: -100,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                rotateX: 0,
                rotateY: 0,
                z: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                rotateX: 15,
                rotateY: -10,
                z: -50,
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.6,
              }}
              className="relative w-full max-w-xs sm:max-w-2xl lg:max-w-3xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden mx-2 sm:mx-0"
              style={{
                perspective: "1000px",
                transformStyle: "preserve-3d",
              }}
            >
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden max-h-[90vh] sm:max-h-[85vh] overflow-y-auto">
                {showSuccess ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8 sm:py-12 px-4 sm:px-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6"
                    >
                      <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
                      Submission Successful
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 text-base sm:text-lg">
                      We have received your recommendation, and will share our decision within approximately 48 hours.
                    </p>
                    <div className="flex gap-4 justify-center">
                      <Button
                        onClick={handleCloseModal}
                        style={{ backgroundColor: "#4F6BFE" }}
                        className="hover:bg-[#4F6BFE]/90 px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg"
                      >
                        Got It
                      </Button>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <X className="h-5 w-5 text-gray-500" />
                    </button>
                  </motion.div>
                ) : (
                  selectedTask && (
                    <div className="p-4 sm:p-6">
                      <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white pr-2">
                          {selectedTask.title}
                        </h2>
                        <button
                          onClick={handleCloseModal}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
                        >
                          <X className="h-5 w-5 text-gray-500" />
                        </button>
                      </div>

                      <div className="mb-4 sm:mb-6">
                        <div className="flex gap-4 sm:gap-8 mb-4">
                          <button
                            onClick={() => setActiveTab("input")}
                            className={`text-base sm:text-lg font-medium pb-1 ${
                              activeTab === "input"
                                ? "text-[#4F6BFE] border-b-2 border-[#4F6BFE]"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                          >
                            Input
                          </button>
                          <button
                            onClick={() => setActiveTab("example")}
                            className={`text-base sm:text-lg font-medium pb-1 ${
                              activeTab === "example"
                                ? "text-[#4F6BFE] border-b-2 border-[#4F6BFE]"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            }`}
                          >
                            Example
                          </button>
                        </div>
                      </div>

                      {activeTab === "input" ? (
                        <div className="space-y-6">
                          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden max-h-48">
                            <img
                              src={selectedTask.image || "/placeholder.svg"}
                              alt={selectedTask.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-4">
                            <p className="text-gray-600 dark:text-gray-300">{selectedTask.description}</p>

                            <div className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-[#4F6BFE]/20">
                              {selectedTask.address}
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{selectedTask.timeEstimate}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-green-600 dark:text-green-400 font-semibold">
                                <Star className="h-4 w-4" />
                                <span>{selectedTask.points} points</span>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4 pt-4 border-t">
                            <Label className="text-base font-medium">Your Recommendation:</Label>
                            <RadioGroup value={recommendation} onValueChange={setRecommendation}>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="accept" id="accept" />
                                <Label htmlFor="accept">Accept</Label>
                              </div>
                              <div className="flex items-center space-x-3">
                                <RadioGroupItem value="reject" id="reject" />
                                <Label htmlFor="reject">Reject</Label>
                              </div>
                            </RadioGroup>

                            <AnimatePresence>
                              {recommendation === "reject" && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-3"
                                >
                                  <Label htmlFor="reject-reason">Reason for rejection:</Label>
                                  <Textarea
                                    id="reject-reason"
                                    placeholder="Please explain why you're rejecting this task..."
                                    value={rejectReason}
                                    onChange={(e) => setRejectReason(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </motion.div>
                              )}

                              {recommendation === "accept" && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="space-y-3"
                                >
                                  <Label htmlFor="accept-reason">Additional comments (optional):</Label>
                                  <Textarea
                                    id="accept-reason"
                                    placeholder="Any additional thoughts or observations about this task..."
                                    value={acceptReason}
                                    onChange={(e) => setAcceptReason(e.target.value)}
                                    className="min-h-[100px]"
                                  />
                                </motion.div>
                              )}
                            </AnimatePresence>

                            <Button
                              onClick={handleSubmit}
                              disabled={!recommendation || (recommendation === "reject" && !rejectReason.trim())}
                              className="w-full py-3"
                              style={{ backgroundColor: "#4F6BFE" }}
                            >
                              Submit Recommendation
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-6">
                          <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden max-h-48">
                            <img
                              src={selectedTask.image || "/placeholder.svg"}
                              alt={`${selectedTask.title} - Example`}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                              Example Guidelines
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                              This is an example of how to approach this task. Review the image carefully and consider
                              the following criteria:
                            </p>

                            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#4F6BFE] rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">Quality Assessment</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Evaluate the clarity, relevance, and accuracy of the data presented.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#4F6BFE] rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">Technical Accuracy</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Verify that technical details and specifications are correct and up-to-date.
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-[#4F6BFE] rounded-full mt-2 flex-shrink-0"></div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-white">Completeness</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Ensure all required information is present and properly formatted.
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="border-l-4 border-[#4F6BFE] pl-4 bg-[#4F6BFE]/5 dark:bg-[#4F6BFE]/10 p-4 rounded-r-lg">
                              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Example Decision</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                <strong>Recommendation:</strong> Accept - The data meets all quality standards and
                                provides valuable insights for the AI model training.
                              </p>
                            </div>

                            <div className="text-center pt-4">
                              <Button
                                onClick={() => setActiveTab("input")}
                                variant="outline"
                                className="border-[#4F6BFE] text-[#4F6BFE] hover:bg-[#4F6BFE] hover:text-white"
                              >
                                Switch to Input Tab
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </ProtectedLayout>
  )
}
