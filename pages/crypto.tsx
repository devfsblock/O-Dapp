"use client"

import { useEffect, useState, useRef } from "react"
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
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "@/lib/auth-context"

export default function CryptoPage() {
  const { walletAddress } = useAuth()
  const userId = walletAddress
  const router = useRouter()
  const [tasks, setTasks] = useState<any[]>([])
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [recommendation, setRecommendation] = useState("")
  const [rejectReason, setRejectReason] = useState("")
  const [acceptReason, setAcceptReason] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)
  const [activeTab, setActiveTab] = useState("input")
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true)
    fetch("/api/task")
      .then(res => res.json())
      .then(data => {
        const filteredTasks = (data.tasks || []).filter((task: any) => {
          if (!Array.isArray(task.response)) return true;
          return !task.response.some((resp: any) => resp.userId === userId);
        });
        setTasks(filteredTasks)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [userId])

  const handleTaskClick = (task: any) => {
    setSelectedTask(task)
    setModalOpen(true)
    setRecommendation("")
    setRejectReason("")
    setAcceptReason("")
    setShowSuccess(false)
    setActiveTab("input")
  }

  const handleSubmit = async () => {
    if (!selectedTask) return
    setLoading(true)
    const answer = recommendation === "accept"
    const reason = answer ? acceptReason : rejectReason
    const res = await fetch("/api/task", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        taskId: selectedTask.id,
        answer,
        reason,
        userId,
      }),
    })
    setLoading(false)
    if (res.ok) {
      setShowSuccess(true)
    } else {
      // handle error
      alert("Failed to submit recommendation")
    }
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
                Crypto & DeFi
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300">
                Contribute to the future of cryptocurrency and blockchain technology
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {tasks.map((task, index) => (
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
                        {task.text}
                      </CardItem>
                      <CardItem translateZ="100" className="w-full mt-4">
                        <img
                          src={task.image ? `data:image/png;base64,${task.image}` : "/placeholder.svg"}
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
            )}
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
                              className={`text-base sm:text-lg font-medium pb-1 ${activeTab === "input"
                                ? "text-[#4F6BFE] border-b-2 border-[#4F6BFE]"
                                : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                                }`}
                            >
                              Input
                            </button>
                            <button
                              onClick={() => setActiveTab("example")}
                              className={`text-base sm:text-lg font-medium pb-1 ${activeTab === "example"
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
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden max-h-48 relative">
                              <img
                                src={selectedTask.image ? `data:image/png;base64,${selectedTask.image}` : "/placeholder.svg"}
                                alt={selectedTask.title}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => setPreviewImage(selectedTask.image ? `data:image/png;base64,${selectedTask.image}` : null)}
                              />
                              <Button
                                size="sm"
                                className="absolute bottom-2 right-2 bg-[#4F6BFE] text-white px-3 py-1 rounded shadow"
                                onClick={() => setPreviewImage(selectedTask.image ? `data:image/png;base64,${selectedTask.image}` : null)}
                              >
                                Preview
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <p className="text-gray-600 dark:text-gray-300">{selectedTask.text}</p>

                              <div className="text-sm text-gray-500 dark:text-gray-400 font-mono bg-gray-50 dark:bg-gray-800 p-3 rounded-lg border border-[#4F6BFE]/20">
                                {selectedTask.address}
                              </div>

                              <div className="flex items-center justify-between">
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
                            <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden max-h-48 relative">
                              <img
                                src={selectedTask.image ? `data:image/png;base64,${selectedTask.image}` : "/placeholder.svg"}
                                alt={`${selectedTask.title} - Example`}
                                className="w-full h-full object-cover cursor-pointer"
                                onClick={() => setPreviewImage(selectedTask.image ? `data:image/png;base64,${selectedTask.image}` : null)}
                              />
                              <Button
                                size="sm"
                                className="absolute bottom-2 right-2 bg-[#4F6BFE] text-white px-3 py-1 rounded shadow"
                                onClick={() => setPreviewImage(selectedTask.image ? `data:image/png;base64,${selectedTask.image}` : null)}
                              >
                                Preview
                              </Button>
                            </div>

                            <div className="space-y-4">
                              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                                Example Guidelines
                              </h3>
                              <p className="text-gray-600 dark:text-gray-300">
                                This is an example of how to approach this task. Review the image carefully and consider
                                the following criteria:
                              </p>

                              <div className="prose max-w-none">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{(selectedTask.example?.description || "No example description.").replace(/\\r\\n|\\n|\\r/g, "\n")}</ReactMarkdown>
                              </div>

                              {/* <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg space-y-3">
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
                            </div> */}

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

        {/* Image Preview Overlay */}
        {previewImage && (
          <div
            ref={previewRef}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 cursor-zoom-out"
            onClick={() => setPreviewImage(null)}
          >
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full max-h-full rounded shadow-2xl border-4 border-white"
              style={{ objectFit: "contain" }}
            />
            <button
              className="absolute top-6 right-6 bg-white/80 hover:bg-white text-black rounded-full p-2 shadow-lg"
              onClick={e => { e.stopPropagation(); setPreviewImage(null); }}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        )}
      </div>
    </ProtectedLayout>
  )
}
