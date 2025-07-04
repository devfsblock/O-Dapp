"use client"
import { useState } from "react"
import type React from "react"

import ProtectedLayout from "../components/protected-layout"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../components/ui/card"
import { Tabs } from "../components/ui/tabs"
import { TextGenerateEffect } from "../components/ui/text-generate-effect"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import {
  CheckCircle,
  Copy,
  Code,
  BookOpen,
  Compass,
  FileText,
  ImageIcon,
  CheckSquare,
  Brain,
  BarChart,
  Bot,
  Key,
  FileCode,
  BookMarked,
  ChevronRight,
  ExternalLink,
  Upload,
  Download,
  Users,
  AlertTriangle,
  Clock,
  Zap,
  TrendingUp,
  Shield,
  Target,
} from "lucide-react"

export default function Academy() {
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null)

  const copyToClipboard = (text: string, snippetId: string) => {
    navigator.clipboard.writeText(text)
    setCopiedSnippet(snippetId)
    setTimeout(() => setCopiedSnippet(null), 2000)
  }

  const CodeSnippet = ({
    title,
    language,
    code,
    id,
  }: {
    title: string
    language: string
    code: string
    id: string
  }) => {
    return (
      <div className="rounded-lg border border-border overflow-hidden mb-6">
        <div className="bg-muted px-4 py-2 flex justify-between items-center">
          <div className="flex items-center">
            <Code className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="mr-2 text-xs">
              {language}
            </Badge>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyToClipboard(code, id)}>
              {copiedSnippet === id ? <CheckCircle className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        <div className="bg-black p-4 overflow-x-auto">
          <pre className="text-sm text-white font-mono">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    )
  }

  const StepItem = ({
    title,
    children,
  }: {
    title: string
    children: React.ReactNode
  }) => {
    return (
      <div className="mb-4">
        <h4 className="text-base font-medium mb-2 flex items-center">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary mr-2 text-xs">
            <ChevronRight className="h-3 w-3" />
          </span>
          {title}
        </h4>
        <div className="pl-8 text-sm text-muted-foreground">{children}</div>
      </div>
    )
  }

  const InfoCard = ({
    icon,
    title,
    children,
    variant = "default",
  }: {
    icon: React.ReactNode
    title: string
    children: React.ReactNode
    variant?: "default" | "warning" | "success" | "info"
  }) => {
    const variantStyles = {
      default: "border-primary/20 hover:border-primary/40",
      warning: "border-orange-200 bg-orange-50/50 dark:border-orange-800 dark:bg-orange-950/20",
      success: "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20",
      info: "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20",
    }

    return (
      <Card className={`mb-6 transition-colors ${variantStyles[variant]}`}>
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">{icon}</div>
            <CardTitle className="text-lg">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    )
  }

  const WorkflowStep = ({
    number,
    title,
    description,
    icon,
    status = "current",
  }: {
    number: number
    title: string
    description: string
    icon: React.ReactNode
    status?: "completed" | "current" | "upcoming"
  }) => {
    const statusStyles = {
      completed: "bg-green-500 text-white",
      current: "bg-primary text-primary-foreground",
      upcoming: "bg-muted text-muted-foreground",
    }

    return (
      <div className="flex items-start space-x-4 p-4 rounded-lg border border-border">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${statusStyles[status]}`}>
          {status === "completed" ? <CheckCircle className="h-5 w-5" /> : icon}
        </div>
        <div className="flex-1">
          <h4 className="font-medium mb-1">
            Step {number}: {title}
          </h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    )
  }

  const tabs = [
    {
      title: "Current Phase Overview",
      value: "current-phase",
      icon: <Compass className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-6 rounded-lg border border-primary/20">
            <h3 className="text-xl font-semibold flex items-center mb-4">
              <Compass className="h-5 w-5 mr-2 text-primary" />
              Current Development Phase: Manual Workflow
            </h3>
            <p className="text-muted-foreground mb-4">
              OanicAI is currently in its manual phase, where all labeling and validation tasks are performed by human
              contributors. This phase establishes quality standards and workflows before introducing AI assistance.
            </p>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <Users className="h-5 w-5 text-blue-500 mr-2" />
                  <h4 className="font-medium">100% Human-Driven</h4>
                </div>
                <p className="text-sm text-muted-foreground">All tasks completed by skilled human annotators</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <Shield className="h-5 w-5 text-green-500 mr-2" />
                  <h4 className="font-medium">Quality First</h4>
                </div>
                <p className="text-sm text-muted-foreground">Establishing high standards for future AI integration</p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <div className="flex items-center mb-2">
                  <Target className="h-5 w-5 text-purple-500 mr-2" />
                  <h4 className="font-medium">Foundation Building</h4>
                </div>
                <p className="text-sm text-muted-foreground">Creating robust workflows for hybrid AI system</p>
              </div>
            </div>
          </div>

          <InfoCard
            icon={<Bot className="h-4 w-4 text-primary" />}
            title="Upcoming AI Integration Preview"
            variant="info"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                The next phase will introduce AI-powered labeling and validation working alongside human contributors in
                a hybrid system.
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm">AI-assisted pre-labeling</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Improved throughput</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-purple-500" />
                  <span className="text-sm">Smart quality checks</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BarChart className="h-4 w-4 text-blue-500" />
                  <span className="text-sm">Progress tracking</span>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<BookOpen className="h-4 w-4 text-primary" />} title="How to Use This Academy">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                This academy is designed to help you master the current manual workflow and prepare for the upcoming AI
                integration:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Manual Workflow:</strong> Learn the current step-by-step process
                </li>
                <li>
                  <strong>Quality & Edge Cases:</strong> Understand standards and handle complex scenarios
                </li>
                <li>
                  <strong>AI Integration Preview:</strong> Prepare for the hybrid future
                </li>
                <li>
                  <strong>Tutorials & API:</strong> Detailed guides and technical documentation
                </li>
              </ul>
            </div>
          </InfoCard>
        </div>
      ),
    },
    {
      title: "Manual Workflow Guide",
      value: "manual-workflow",
      icon: <Users className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Users className="h-5 w-5 mr-2 text-primary" />
            Complete Manual Workflow Guide
          </h3>
          <p className="text-muted-foreground mb-6">
            Follow this comprehensive guide to understand the current manual labeling and validation process on OanicAI.
          </p>

          <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h4 className="font-semibold mb-4 flex items-center">
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Current Workflow Overview
            </h4>
            <div className="grid gap-4 md:grid-cols-4 text-center">
              <div className="flex flex-col items-center">
                <Upload className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium">1. Upload</span>
                <span className="text-xs text-muted-foreground">Submitter uploads project</span>
              </div>
              <div className="flex flex-col items-center">
                <FileText className="h-8 w-8 text-purple-500 mb-2" />
                <span className="text-sm font-medium">2. Label</span>
                <span className="text-xs text-muted-foreground">Labelers annotate data</span>
              </div>
              <div className="flex flex-col items-center">
                <CheckSquare className="h-8 w-8 text-orange-500 mb-2" />
                <span className="text-sm font-medium">3. Validate</span>
                <span className="text-xs text-muted-foreground">Validators review work</span>
              </div>
              <div className="flex flex-col items-center">
                <Download className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium">4. Deliver</span>
                <span className="text-xs text-muted-foreground">Final dataset delivery</span>
              </div>
            </div>
          </div>

          <InfoCard icon={<Upload className="h-4 w-4 text-primary" />} title="Phase 1: Project Submission">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Companies or individuals (submitters) upload their projects through the "Upload Projects" page.
              </p>

              <div className="space-y-3">
                <StepItem title="Access Upload Page">
                  Navigate to the "Upload Projects" section from the main dashboard.
                </StepItem>

                <StepItem title="Prepare Your Data">
                  <div className="space-y-2">
                    <p>Supported file types include:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Text Data:</strong> CSV, JSON, JSONL, TXT files
                      </li>
                      <li>
                        <strong>Image Data:</strong> JPG, PNG, TIFF, BMP files
                      </li>
                      <li>
                        <strong>Mixed Projects:</strong> ZIP archives containing multiple file types
                      </li>
                    </ul>
                  </div>
                </StepItem>

                <StepItem title="Define Project Requirements">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Specify labeling task type (classification, NER, object detection, etc.)</li>
                    <li>Provide clear labeling guidelines and examples</li>
                    <li>Set quality requirements and acceptance criteria</li>
                    <li>Define timeline and budget constraints</li>
                  </ul>
                </StepItem>

                <StepItem title="Submit Project">
                  Upload files, review project details, and submit for processing.
                </StepItem>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<FileText className="h-4 w-4 text-primary" />} title="Phase 2: Labeling Process">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Labelers can perform data labeling directly in the <b>Labeling Workspace</b> (see the "Label Now" page in the sidebar). This section provides a list of available projects for labeling, progress tracking, and file download/upload features. All labeling is performed securely within the OanicAI platform.
              </p>
              <div className="space-y-3">
                <StepItem title="Access Labeling Workspace">
                  Go to the <b>Labeling Workspace</b> from the sidebar. Here, you can browse and apply for available labeling projects.
                </StepItem>
             
                <StepItem title="Label the Data">
                  Download project files, label them using your preferred offline tools (such as Excel, VS Code, or open-source annotation tools like <a href='https://label-studio.io/' target='_blank' rel='noopener noreferrer' className='underline text-blue-600'>Label Studio</a> or <a href='https://doccano.github.io/doccano/' target='_blank' rel='noopener noreferrer' className='underline text-blue-600'>Doccano</a>), and re-upload the labeled files to the platform. 
                </StepItem>
                <StepItem title="Submit Labeled Data">
                  Upload your labeled files back to the project using the provided upload interface. Your work will be reviewed by validators before final approval.
                </StepItem>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <h5 className="font-medium mb-2 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                  Important Notes
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Incomplete or improperly labeled submissions may be rejected</li>
                  <li>• Quality standards must be met to receive full payment</li>
                  <li>• Communication with validators is encouraged for clarification</li>
                  <li>• Do not use or upload data from commercial platforms such as Labelbox, Scale AI, Kotwel, Codatta, or Kaggle.</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<CheckSquare className="h-4 w-4 text-primary" />} title="Phase 3: Validation Process">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Validators review submitted work and ensure quality standards are met.
              </p>

              <div className="space-y-3">
                <StepItem title="Access Validation Tasks">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Find submitted work in "Find Work" section of "Validate Now" page</li>
                    <li>Review project requirements and labeling guidelines</li>
                    <li>Download labeled data for review</li>
                  </ul>
                </StepItem>

                <StepItem title="Quality Review Process">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Check accuracy of labels against original data</li>
                    <li>Verify consistency across all annotations</li>
                    <li>Ensure compliance with project guidelines</li>
                    <li>Identify any missing or incorrect labels</li>
                  </ul>
                </StepItem>

                <StepItem title="Validation Decision">
                  <div className="space-y-2">
                    <p>Based on quality assessment, validators can:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>
                        <strong>Approve:</strong> Mark as finalized if meets standards
                      </li>
                      <li>
                        <strong>Request Revision:</strong> Return with specific feedback
                      </li>
                      <li>
                        <strong>Reject:</strong> If quality is below acceptable threshold
                      </li>
                    </ul>
                  </div>
                </StepItem>

                <StepItem title="Provide Feedback">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Give detailed feedback for rejected or revision-requested work</li>
                    <li>Highlight specific issues and improvement areas</li>
                    <li>Suggest corrections or clarifications</li>
                  </ul>
                </StepItem>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<Download className="h-4 w-4 text-primary" />} title="Phase 4: Final Delivery">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Once validation is complete, the processed dataset is delivered to the submitter.
              </p>

              <div className="space-y-3">
                <StepItem title="Completion Notification">
                  Submitters receive notification when all labeling and validation is finalized.
                </StepItem>

                <StepItem title="Quality Report">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Detailed quality metrics and statistics</li>
                    <li>Inter-annotator agreement scores</li>
                    <li>Validation feedback summary</li>
                  </ul>
                </StepItem>

                <StepItem title="Dataset Download">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Download complete, processed dataset</li>
                    <li>Receive data in requested format</li>
                    <li>Access to annotation metadata and statistics</li>
                  </ul>
                </StepItem>

                <StepItem title="Payment Processing">
                  Automatic payment distribution to labelers and validators based on contribution and quality.
                </StepItem>
              </div>
            </div>
          </InfoCard>
        </div>
      ),
    },
    {
      title: "Quality & Edge Cases",
      value: "quality-edge-cases",
      icon: <Shield className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Shield className="h-5 w-5 mr-2 text-primary" />
            Quality Standards & Edge Case Management
          </h3>
          <p className="text-muted-foreground mb-6">
            Understanding quality requirements and how to handle complex scenarios in the labeling and validation
            process.
          </p>

          <InfoCard
            icon={<Target className="h-4 w-4 text-primary" />}
            title="Quality Standards for Labelers"
            variant="success"
          >
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Accuracy Requirements</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Minimum 95% accuracy for text classification</li>
                    <li>• 90% accuracy for complex NER tasks</li>
                    <li>• 92% accuracy for image object detection</li>
                    <li>• 88% accuracy for detailed image segmentation</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Consistency Standards</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Follow project-specific guidelines exactly</li>
                    <li>• Maintain consistent labeling approach</li>
                    <li>• Document decision-making process</li>
                    <li>• Seek clarification when uncertain</li>
                  </ul>
                </div>
              </div>

              <div className="mt-4 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-medium mb-2">Best Practices</h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Take regular breaks to maintain focus and accuracy</li>
                  <li>• Double-check work before submission</li>
                  <li>• Keep detailed notes for complex cases</li>
                  <li>• Communicate with validators when guidelines are unclear</li>
                </ul>
              </div>
            </div>
          </InfoCard>

          <InfoCard
            icon={<CheckCircle className="h-4 w-4 text-primary" />}
            title="Quality Standards for Validators"
            variant="success"
          >
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Review Thoroughness</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Check minimum 20% of all annotations</li>
                    <li>• Focus on edge cases and difficult examples</li>
                    <li>• Verify consistency across the dataset</li>
                    <li>• Validate against project requirements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Feedback Quality</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Provide specific, actionable feedback</li>
                    <li>• Include examples of correct annotations</li>
                    <li>• Explain reasoning for rejections</li>
                    <li>• Suggest improvements for future work</li>
                  </ul>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard
            icon={<AlertTriangle className="h-4 w-4 text-primary" />}
            title="Edge Cases & Complex Scenarios"
            variant="warning"
          >
            <div className="space-y-6">
              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Multiple Reviewers
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  In future updates, multiple validators may review a single project to ensure consensus-based quality.
                </p>
                <div className="space-y-2">
                  <StepItem title="Consensus Building">
                    When validators disagree, a senior reviewer makes the final decision.
                  </StepItem>
                  <StepItem title="Conflict Resolution">
                    Disagreements are documented and used to improve guidelines.
                  </StepItem>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <FileText className="h-4 w-4 mr-2" />
                  Incomplete Submissions
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Files not fully labeled may result in rejection or delay in validation.
                </p>
                <div className="space-y-2">
                  <StepItem title="Partial Work Policy">
                    Incomplete submissions receive proportional payment based on completed work.
                  </StepItem>
                  <StepItem title="Resubmission Process">
                    Labelers can complete and resubmit partial work within extended deadlines.
                  </StepItem>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Project Abandonment
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  If a labeler downloads but doesn't upload within a certain time, the task returns to the available
                  pool.
                </p>
                <div className="space-y-2">
                  <StepItem title="Timeout Policy">
                    Tasks automatically return to pool after 48-72 hours of inactivity.
                  </StepItem>
                  <StepItem title="Penalty System">
                    Repeated abandonment may result in reduced access to premium tasks.
                  </StepItem>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3 flex items-center">
                  <FileCode className="h-4 w-4 mr-2" />
                  File Type Limitations
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  Non-standard formats may be unsupported in the manual phase but could be included later with AI
                  processing.
                </p>
                <div className="space-y-2">
                  <StepItem title="Current Limitations">
                    Some proprietary formats require manual conversion before processing.
                  </StepItem>
                  <StepItem title="Future Support">
                    AI integration will expand supported file types and formats.
                  </StepItem>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<BarChart className="h-4 w-4 text-primary" />} title="Task Lifecycle Management">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Understanding all possible states and transitions in the task lifecycle.
              </p>

              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h5 className="font-medium text-blue-700 dark:text-blue-300 mb-1">Available</h5>
                  <p className="text-xs text-muted-foreground">Task is open for labelers to claim</p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h5 className="font-medium text-yellow-700 dark:text-yellow-300 mb-1">In Progress</h5>
                  <p className="text-xs text-muted-foreground">Labeler is actively working on task</p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h5 className="font-medium text-purple-700 dark:text-purple-300 mb-1">Submitted</h5>
                  <p className="text-xs text-muted-foreground">Awaiting validation review</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h5 className="font-medium text-orange-700 dark:text-orange-300 mb-1">Under Review</h5>
                  <p className="text-xs text-muted-foreground">Validator is reviewing submission</p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                  <h5 className="font-medium text-red-700 dark:text-red-300 mb-1">Revision Needed</h5>
                  <p className="text-xs text-muted-foreground">Returned to labeler for corrections</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <h5 className="font-medium text-green-700 dark:text-green-300 mb-1">Completed</h5>
                  <p className="text-xs text-muted-foreground">Approved and ready for delivery</p>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      ),
    },
    {
      title: "AI Integration Preview",
      value: "ai-integration",
      icon: <Bot className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center">
            <Bot className="h-5 w-5 mr-2 text-primary" />
            Upcoming AI Integration: Hybrid Workflow
          </h3>
          <p className="text-muted-foreground mb-6">
            Get ready for the next phase where AI-powered labeling and validation will work alongside human contributors
            to create a more efficient and accurate annotation system.
          </p>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h4 className="font-semibold mb-4 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-purple-500" />
              Hybrid AI + Human System
            </h4>
            <p className="text-sm text-muted-foreground mb-4">
              The upcoming hybrid system will combine the speed of AI with the accuracy and nuance of human judgment,
              creating a more efficient and reliable annotation process.
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h5 className="font-medium mb-2 flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-blue-500" />
                  AI Contributions
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Pre-labeling and suggestions</li>
                  <li>• Quality consistency checks</li>
                  <li>• Automated edge case detection</li>
                  <li>• Progress optimization</li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border">
                <h5 className="font-medium mb-2 flex items-center">
                  <Users className="h-4 w-4 mr-2 text-green-500" />
                  Human Expertise
                </h5>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Complex decision making</li>
                  <li>• Contextual understanding</li>
                  <li>• Quality validation</li>
                  <li>• Edge case resolution</li>
                </ul>
              </div>
            </div>
          </div>

          <InfoCard
            icon={<BarChart className="h-4 w-4 text-primary" />}
            title="Enhanced Progress Tracking"
            variant="info"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Projects will be tagged with detailed progress indicators to show the status of both AI and human
                contributions.
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <span className="text-sm font-medium">Manual Labeling Done, AI Labeling Remaining</span>
                  <Badge variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    50% Complete
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <span className="text-sm font-medium">AI Labeling Done, Awaiting Manual Validation</span>
                  <Badge
                    variant="outline"
                    className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                  >
                    75% Complete
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                  <span className="text-sm font-medium">Fully Processed by Human and AI</span>
                  <Badge
                    variant="outline"
                    className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                  >
                    100% Complete
                  </Badge>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<TrendingUp className="h-4 w-4 text-primary" />} title="Expected Benefits">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-medium mb-2">Faster Turnaround</h4>
                <p className="text-sm text-muted-foreground">
                  Reduce time per task by 60-80% with AI pre-labeling and smart routing
                </p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <Target className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-medium mb-2">Higher Accuracy</h4>
                <p className="text-sm text-muted-foreground">
                  Improve overall accuracy with AI consistency checks and human oversight
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h4 className="font-medium mb-2">Better Throughput</h4>
                <p className="text-sm text-muted-foreground">
                  Handle larger datasets with intelligent task distribution and optimization
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<Brain className="h-4 w-4 text-primary" />} title="AI-Only Workflow Option">
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For specific low-risk datasets, an optional AI-only workflow will be available for maximum speed and
                cost efficiency.
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Suitable for AI-Only:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Simple classification tasks</li>
                    <li>• Well-defined object detection</li>
                    <li>• Standardized data formats</li>
                    <li>• High-volume, low-complexity projects</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Requires Human Review:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Complex contextual analysis</li>
                    <li>• Ambiguous or edge cases</li>
                    <li>• High-stakes applications</li>
                    <li>• Novel or specialized domains</li>
                  </ul>
                </div>
              </div>
            </div>
          </InfoCard>

          <InfoCard
            icon={<CheckCircle className="h-4 w-4 text-primary" />}
            title="Preparing for AI Integration"
            variant="success"
          >
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-4">
                Here's how current users can prepare for the upcoming AI integration:
              </p>

              <div className="space-y-3">
                <StepItem title="Master Current Workflows">
                  Become proficient with manual processes to understand quality standards and best practices.
                </StepItem>

                <StepItem title="Document Edge Cases">
                  Keep detailed notes on complex scenarios you encounter - this will help train AI systems.
                </StepItem>

                <StepItem title="Build Quality Reputation">
                  Maintain high accuracy scores to gain access to premium AI-assisted tasks.
                </StepItem>

                <StepItem title="Stay Updated">
                  Follow academy updates and participate in beta testing when AI features become available.
                </StepItem>
              </div>

              <div className="mt-6 p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                <h5 className="font-medium mb-2 flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-green-600" />
                  Timeline
                </h5>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>AI Pre-labeling Beta</span>
                    <span className="font-medium">Q2 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Hybrid Workflow Launch</span>
                    <span className="font-medium">Q3 2024</span>
                  </div>
                  <div className="flex justify-between">
                    <span>AI-Only Option</span>
                    <span className="font-medium">Q4 2024</span>
                  </div>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      ),
    },
    {
      title: "Tutorials",
      value: "tutorials",
      icon: <BookOpen className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Detailed Tutorials
          </h3>
          <p className="text-muted-foreground mb-6">
            Follow these step-by-step tutorials to master different types of data labeling and validation tasks.
          </p>

          <InfoCard
            icon={<FileText className="h-4 w-4 text-primary" />}
            title="Text Data Labeling (NER, Sentiment, Classification)"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Task Types:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Named Entity Recognition (NER)</li>
                  <li>Sentiment Classification</li>
                  <li>Topic Categorization</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Steps:</h4>

                <StepItem title="Open a Task">
                  <p>From your dashboard, click "Label" next to a batch of text.</p>
                </StepItem>

                <StepItem title="Highlight & Annotate">
                  <p>Select a span of text (e.g., a person's name) → choose label "Person."</p>
                  <p>For classification, select one label per document (radio-style).</p>
                </StepItem>

                <StepItem title="Shortcuts & Tools">
                  <p>Use Tab to move to the next task.</p>
                  <p>Use Ctrl + arrow keys to jump between sentences.</p>
                </StepItem>

                <StepItem title="Auto-Save">
                  <p>Labels auto-save every 5 seconds or when you navigate to the next item.</p>
                </StepItem>
              </div>

              <div className="mt-4">
                <CodeSnippet
                  id="text-labeling-example"
                  title="Example NER Annotation JSON"
                  language="json"
                  code={`{
  "id": "doc_123",
  "text": "Apple CEO Tim Cook announced new products at their Cupertino headquarters.",
  "entities": [
    {
      "start": 0,
      "end": 5,
      "label": "ORGANIZATION"
    },
    {
      "start": 9,
      "end": 17,
      "label": "TITLE"
    },
    {
      "start": 18,
      "end": 27,
      "label": "PERSON"
    },
    {
      "start": 58,
      "end": 67,
      "label": "LOCATION"
    }
  ]
}`}
                />
              </div>
            </div>
          </InfoCard>

          <InfoCard
            icon={<ImageIcon className="h-4 w-4 text-primary" />}
            title="Image Data Labeling (Bounding Boxes, Segmentation)"
          >
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Task Types:</h4>
                <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Object Detection</li>
                  <li>Instance Segmentation</li>
                  <li>Image Classification</li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Steps:</h4>

                <StepItem title="Open a Task">
                  <p>Go to "Label" under an image batch.</p>
                </StepItem>

                <StepItem title="Drawing Tools">
                  <p>Bounding Box: Click and drag over object.</p>
                  <p>Polygon: Click to outline shape, double-click to close.</p>
                  <p>Segmentation: Use brush tool to paint areas.</p>
                </StepItem>

                <StepItem title="Assign Labels">
                  <p>After drawing, select a label from the side panel.</p>
                </StepItem>

                <StepItem title="Tips">
                  <p>Use zoom (mouse wheel) for precision.</p>
                  <p>Shift + drag to move the image.</p>
                </StepItem>
              </div>

              <div className="mt-4">
                <CodeSnippet
                  id="image-labeling-example"
                  title="Example Bounding Box Annotation JSON"
                  language="json"
                  code={`{
  "id": "img_456",
  "file_name": "street_scene.jpg",
  "width": 1280,
  "height": 720,
  "annotations": [
    {
      "id": 1,
      "category_id": 1,
      "category_name": "car",
      "bbox": [100, 150, 200, 100],
      "area": 20000,
      "iscrowd": 0
    },
    {
      "id": 2,
      "category_id": 2,
      "category_name": "person",
      "bbox": [400, 200, 50, 120],
      "area": 6000,
      "iscrowd": 0
    }
  ]
}`}
                />
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<CheckSquare className="h-4 w-4 text-primary" />} title="Validation Workflows (Text & Image)">
            <div className="space-y-6">
              <div>
                <h4 className="text-base font-medium mb-3">Text Data Validation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Goal: Ensure span labels or class tags are consistent with schema.
                </p>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">Steps:</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Open validation view (Validator role required).</li>
                    <li>Review label(s) vs. raw text.</li>
                    <li>
                      Options:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Approve – correct label</li>
                        <li>Reject – incorrect or missing labels</li>
                        <li>Edit – fix span or label and resubmit</li>
                      </ul>
                    </li>
                    <li>Leave comments for labelers if correction is needed.</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="text-base font-medium mb-3">Image Data Validation</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Goal: Ensure shapes match object boundaries and correct labels.
                </p>

                <div className="space-y-3">
                  <h5 className="text-sm font-medium">Steps:</h5>
                  <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                    <li>Open the image validation panel.</li>
                    <li>Toggle mask overlay for segmentation.</li>
                    <li>Use outline or bounding box visual mode.</li>
                    <li>
                      Check for:
                      <ul className="list-disc pl-5 mt-1">
                        <li>Overlapping shapes</li>
                        <li>Misaligned labels</li>
                        <li>Missing objects</li>
                      </ul>
                    </li>
                    <li>Approve, edit, or reject as needed.</li>
                  </ul>
                </div>
              </div>
            </div>
          </InfoCard>
        </div>
      ),
    },
    {
      title: "API Documentation",
      value: "api-documentation",
      icon: <FileCode className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center">
            <FileCode className="h-5 w-5 mr-2 text-primary" />
            API Documentation
          </h3>
          <p className="text-muted-foreground mb-6">
            Comprehensive documentation for OanicAI's API endpoints and integration guides.
          </p>

          <InfoCard icon={<Key className="h-4 w-4 text-primary" />} title="Authentication">
            <p className="text-sm text-muted-foreground mb-4">Obtain API Key in user dashboard.</p>

            <CodeSnippet
              id="auth-header"
              title="Authorization Header"
              language="makefile"
              code={`Authorization: Bearer YOUR_API_KEY`}
            />

            <CodeSnippet
              id="curl-example"
              title="Curl Request Example"
              language="bash"
              code={`curl -H "Authorization: Bearer YOUR_API_KEY" https://api.oanicai.com/projects`}
            />
          </InfoCard>

          <InfoCard icon={<FileCode className="h-4 w-4 text-primary" />} title="Core Endpoints">
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Project Management</h4>
                <CodeSnippet id="create-project" title="Create Project" language="http" code={`POST /projects`} />
                <CodeSnippet id="get-projects" title="Get Projects" language="http" code={`GET /projects`} />
                <CodeSnippet id="upload-data" title="Upload Data" language="http" code={`POST /projects/:id/data`} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Labeling</h4>
                <CodeSnippet id="get-tasks" title="Get Available Tasks" language="http" code={`GET /tasks/available`} />
                <CodeSnippet id="claim-task" title="Claim Task" language="http" code={`POST /tasks/:id/claim`} />
                <CodeSnippet id="submit-labels" title="Submit Labels" language="http" code={`POST /tasks/:id/labels`} />
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Validation</h4>
                <CodeSnippet
                  id="get-validation-tasks"
                  title="Get Validation Tasks"
                  language="http"
                  code={`GET /validation/tasks`}
                />
                <CodeSnippet
                  id="submit-validation"
                  title="Submit Validation"
                  language="http"
                  code={`POST /validation/:id`}
                />
              </div>
            </div>
          </InfoCard>
        </div>
      ),
    },
    {
      title: "Resources",
      value: "resources",
      icon: <BookMarked className="h-4 w-4 mr-2" />,
      content: (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center">
            <BookMarked className="h-5 w-5 mr-2 text-primary" />
            Additional Resources
          </h3>
          <p className="text-muted-foreground mb-6">
            Explore these resources to enhance your OanicAI experience and deepen your knowledge.
          </p>

          <InfoCard icon={<BookOpen className="h-4 w-4 text-primary" />} title="Glossary">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="text-sm font-medium mb-2">Labeler</h4>
                <p className="text-sm text-muted-foreground">Annotates raw data according to project guidelines</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Validator</h4>
                <p className="text-sm text-muted-foreground">Reviews and approves labeled data for quality</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Submitter</h4>
                <p className="text-sm text-muted-foreground">Organization or individual who uploads projects</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">NER</h4>
                <p className="text-sm text-muted-foreground">Named Entity Recognition - identifying entities in text</p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Segmentation</h4>
                <p className="text-sm text-muted-foreground">
                  Pixel-wise image labeling for detailed object boundaries
                </p>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Gold Dataset</h4>
                <p className="text-sm text-muted-foreground">
                  High-quality reference data used for testing and training
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<ExternalLink className="h-4 w-4 text-primary" />} title="Community & Support">
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-primary/10 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Discord Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">
                      Connect with other OanicAI users and get real-time help
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Join Discord
                    </Button>
                  </CardFooter>
                </Card>

                <Card className="border-primary/10 hover:border-primary/30 transition-colors">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Telegram Updates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground">Get platform updates and announcements</p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="outline" size="sm" className="w-full">
                      Join Telegram
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium mb-2">Weekly Office Hours</h4>
                <p className="text-sm text-muted-foreground">
                  Join our team every Thursday at 10 AM UTC for live Q&A sessions
                </p>
              </div>
            </div>
          </InfoCard>

          <InfoCard icon={<FileText className="h-4 w-4 text-primary" />} title="Quick Reference Guides">
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span className="text-sm">Labeling Shortcuts</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <ImageIcon className="h-6 w-6 mb-2" />
                  <span className="text-sm">Image Tools Guide</span>
                </Button>
                <Button variant="outline" className="h-auto p-4 flex flex-col items-center">
                  <CheckSquare className="h-6 w-6 mb-2" />
                  <span className="text-sm">Validation Checklist</span>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground text-center">
                Download printable PDF guides for offline reference
              </p>
            </div>
          </InfoCard>
        </div>
      ),
    },
  ]

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            <TextGenerateEffect words="OanicAI Academy" />
          </h1>
          <p className="mt-2 text-muted-foreground">
            Master the current manual workflow and prepare for the AI-powered future of data labeling
          </p>
        </div>

        <Tabs defaultValue="current-phase" tabs={tabs} />
      </div>
    </ProtectedLayout>
  )
}
