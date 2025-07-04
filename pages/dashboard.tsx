"use client"

import { motion } from "framer-motion"
import { useAuth } from "../lib/auth-context"
import ProtectedLayout from "../components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { CardHoverEffect } from "../components/ui/card-hover-effect"
import { TextGenerateEffect } from "../components/ui/text-generate-effect"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import {
  FileText,
  CheckCircle,
  Clock,
  DollarSign,
  Award,
  Activity,
  BarChart3,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Download,
  Upload,
  Star,
  Wallet,
  TrendingUp,
} from "lucide-react"
import { useProjects } from '@/hooks/useProjects'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useRouter } from 'next/router'
import { getStatusColor, getPriorityColor } from "@/lib/project-colors";
import { Project } from "@/types/ProjectType"
import { useAllProjects } from '@/hooks/useAllProjects'

export default function Dashboard() {
  const { walletAddress, chainId } = useAuth()
  const router = useRouter();
  const { user } = useUserProfile();
  const userId = user?.id;
  const { projects, isLoading } = useProjects()

  // Use all projects for dashboard filtering
  const { projects: allProjects, isLoading: isAllProjectsLoading } = useAllProjects();

  // Dynamic stats based on wallet connection
  const stats = [
    {
      title: "Wallet Connected",
      description: "Your wallet is successfully connected to OanicAI",
      value: walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : "Not Connected",
      change: chainId ? `Chain ID: ${chainId}` : "",
      trend: "neutral",
      icon: Wallet,
      color: "from-blue-500 to-cyan-500",
    },
    {
      title: "Total Earnings",
      description: "Your accumulated rewards",
      value: "2,847 Oanic",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
    },
    {
      title: "Projects Completed",
      description: "Successfully finished projects",
      value: "47",
      change: "+8 this month",
      trend: "up",
      icon: CheckCircle,
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "Accuracy Rate",
      description: "Your validation quality score",
      value: "98.2%",
      change: "+0.8%",
      trend: "up",
      icon: Target,
      color: "from-amber-500 to-orange-500",
    },
  ]

  const recentProjects = (projects || []).filter(p => p.submitter === userId).slice(0, 2)

  const recentActivity = walletAddress
    ? [
        {
          action: "Completed validation",
          project: "E-commerce Product Classification",
          time: "2 hours ago",
          reward: "45 Oanic",
          type: "validation",
          txHash: "0x1a2b3c...",
        },
        {
          action: "Submitted labels",
          project: "Medical Image Classification",
          time: "4 hours ago",
          reward: "28.50 Oanic",
          type: "labeling",
          txHash: "0x4d5e6f...",
        },
        {
          action: "Project approved",
          project: "Sentiment Analysis Dataset",
          time: "1 day ago",
          reward: "320.00 Oanic",
          type: "completion",
          txHash: "0x7g8h9i...",
        },
        {
          action: "Started new task",
          project: "Object Detection - Autonomous Vehicles",
          time: "2 days ago",
          reward: "Pending",
          type: "start",
          txHash: null,
        },
      ]
    : [
        {
          action: "Connect wallet to start",
          project: "Get started with OanicAI",
          time: "Now",
          reward: "Connect wallet",
          type: "connect",
          txHash: null,
        },
      ]

  const upcomingEvents = [
    {
      title: "Weekly Validation Challenge",
      description: "Earn bonus rewards for high-quality validations",
      date: "Tomorrow",
      reward: "Up to 200 Oanic bonus",
      participants: walletAddress ? "1,247 participants" : "Connect to join",
    },
    {
      title: "New Dataset Release",
      description: "Medical imaging dataset for cancer detection",
      date: "In 3 days",
      reward: "50-500 Oanic per task",
      participants: walletAddress ? "Early access available" : "Connect to access",
    },
    {
      title: "Community AMA Session",
      description: "Ask questions about platform updates",
      date: "Friday 2PM UTC",
      reward: "Knowledge sharing",
      participants: walletAddress ? "RSVP now" : "Connect to RSVP",
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

  // Determine active projects based on user type
  let activeProjects: Project[] = [];
  if (user?.userType === 'submitter') {
    activeProjects = (allProjects || []).filter(p => p.submitter === userId).slice(0, 2);
  } else if (user?.userType === 'labeler') {
    activeProjects = (allProjects || []).filter(p => p.labelers?.includes(userId!)).slice(0, 2);
  } else if (user?.userType === 'validator') {
    activeProjects = (allProjects || []).filter(p => p.validators?.includes(userId!)).slice(0, 2);
  }
  console.log("active   projects", activeProjects)

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            <TextGenerateEffect words="Welcome to OanicAI Dashboard" />
          </h1>
          <p className="mt-2 text-muted-foreground">
            {walletAddress
              ? "Manage your Web3 labelled datasets and activities in one place"
              : "Connect your wallet to start earning rewards for data labeling and validation"}
          </p>
        </div>

        {/* Stats Overview */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={item}>
              <CardHoverEffect>
                <Card className="overflow-hidden border-gray-200 dark:border-gray-800 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <stat.icon className="h-4 w-4 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`bg-gradient-to-r ${stat.color} bg-clip-text text-xl font-bold text-transparent mb-1`}
                    >
                      {stat.value}
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      {stat.trend === "up" && <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />}
                      {stat.trend === "down" && <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />}
                      <span
                        className={stat.trend === "up" ? "text-green-500" : stat.trend === "down" ? "text-red-500" : ""}
                      >
                        {stat.change}
                      </span>
                    </div>
                    <CardDescription className="text-xs mt-1">{stat.description}</CardDescription>
                  </CardContent>
                </Card>
              </CardHoverEffect>
            </motion.div>
          ))}
        </motion.div>

        <div 
        // className="grid gap-6 lg:grid-cols-3"
        >
          {/* Recent Projects */}
          <div className="lg:col-span-2">
            <Card className="border-gray-200 dark:border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl">Active Projects</CardTitle>
                    <CardDescription>
                      {walletAddress
                        ? "Your current labeling and validation tasks"
                        : "Connect wallet to see available projects"}
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" disabled={!walletAddress} onClick={() => router.push('/upload-projects')}>
                    <Eye className="h-4 w-4 mr-2" />
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {walletAddress ? (
                  isAllProjectsLoading ? (
                    <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
                  ) : activeProjects.length > 0 ? (
                    activeProjects.map((project, index) => (
                      <motion.div
                        key={index}
                        variants={item}
                        className="flex items-center justify-between p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium">{project.name}</h4>
                            <Badge className={getPriorityColor(project.priority)}>
                              {project.priority}
                            </Badge>
                            <Badge className={`text-xs ${getStatusColor(project.status)}`}>
                              {project.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                            <span>{project.fileType}</span>
                            <span>•</span>
                            <span>{project.id}</span>
                            <span>•</span>
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {project.estimatedCompletion}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={project.progress} className="flex-1 h-2" />
                            <span className="text-xs text-muted-foreground min-w-[3rem]">{project.progress}%</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          {/* Optionally, show more project info here */}
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">No active projects found.</div>
                  )
                ) : (
                  <div className="text-center py-8">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-4">Connect your wallet to see available projects</p>
                    <Button>Connect Wallet</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance & Quick Actions */}
          {/* <div className="space-y-6">
            {walletAddress && (
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                    Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Quality Score</span>
                      <span className="font-semibold">98.2%</span>
                    </div>
                    <Progress value={98.2} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Speed Rating</span>
                      <span className="font-semibold">94.5%</span>
                    </div>
                    <Progress value={94.5} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Reliability</span>
                      <span className="font-semibold">96.8%</span>
                    </div>
                    <Progress value={96.8} className="h-2" />
                  </div>
                  <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Overall Rating</span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="ml-1 font-semibold">4.9</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

           
          </div> */}
        </div>

        {/* Recent Activity & Upcoming Events */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="h-5 w-5 mr-2 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>
                {walletAddress ? "Your latest contributions and earnings" : "Connect wallet to see your activity"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-100 dark:border-gray-800"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          activity.type === "completion"
                            ? "bg-green-100 dark:bg-green-900"
                            : activity.type === "validation"
                              ? "bg-blue-100 dark:bg-blue-900"
                              : activity.type === "labeling"
                                ? "bg-purple-100 dark:bg-purple-900"
                                : activity.type === "connect"
                                  ? "bg-orange-100 dark:bg-orange-900"
                                  : "bg-gray-100 dark:bg-gray-800"
                        }`}
                      >
                        {activity.type === "completion" ? (
                          <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
                        ) : activity.type === "validation" ? (
                          <CheckCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : activity.type === "labeling" ? (
                          <FileText className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        ) : activity.type === "connect" ? (
                          <Wallet className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        ) : (
                          <Zap className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">{activity.project}</p>
                        {activity.txHash && (
                          <p className="text-xs text-muted-foreground font-mono">Tx: {activity.txHash}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`font-semibold ${
                          activity.reward === "Pending" || activity.reward === "Connect wallet"
                            ? "text-muted-foreground"
                            : "text-green-600 dark:text-green-400"
                        }`}
                      >
                        {activity.reward}
                      </p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Stay updated with OanicAI events and opportunities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge variant="outline" className="text-xs">
                        {event.date}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-green-600 dark:text-green-400 font-medium">{event.reward}</span>
                      <span className="text-muted-foreground">{event.participants}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedLayout>
  )
}
