"use client"

import React, { useState, useEffect } from "react"
import ProtectedLayout from "../components/protected-layout";
import { motion } from "framer-motion"
import {
  Tag,
  Upload,
  Clock,
  CheckCircle,
  Calendar,
  DollarSign,
  FileText,
  ImageIcon,
  Database,
  Loader2,
  ChevronUp,
  Eye,
  User,
  FileCheck,
  AlertCircle,
  TrendingUp,
  Download
} from "lucide-react"
import { useProjects } from '@/hooks/useProjects';
import { useUserProfile } from '@/hooks/useUserProfile';
import { downloadSupabaseFiles, openFileInNewTab } from '@/hooks/useSupabaseFileDownload';
import { useUsernames } from '@/hooks/useUsernames';
import useSWR from 'swr';
import { getStatusColor, getPriorityColor } from "@/lib/project-colors";
import { Project } from "@/types/ProjectType";
import { getTimeAgo, formatDateTime } from "@/lib/time-utils";
import { UpdateProgressSection } from "@/components/UpdateProgressSection";
import ProjectStatusLabel from "@/components/ProjectStatusLabel";
import UploadLabelledFilesSection from "@/components/UploadLabelledFilesSection";

// Sample data for user's labeled tasks
const sampleLabeledTasks = [
  {
    id: 1,
    projectName: "Medical Image Classification",
    labelingStatus: "Completed",
    labelingType: "Image Classification",
    metadata: "1,250 images labeled",
    completedDate: "2025-01-15",
    accuracy: 98.5,
  },
  {
    id: 2,
    projectName: "Product Categorization",
    labelingStatus: "In Progress",
    labelingType: "Text Classification",
    metadata: "450/800 items labeled",
    completedDate: null,
    accuracy: null,
  },
  {
    id: 3,
    projectName: "Speech Recognition Dataset",
    labelingStatus: "Under Review",
    labelingType: "Audio Transcription",
    metadata: "320 audio files transcribed",
    completedDate: "2025-01-12",
    accuracy: 96.2,
  },
]

const getDataTypeIcon = (dataType: string) => {
  if (dataType.includes("Image") || dataType.includes("Video")) return ImageIcon
  if (dataType.includes("Text")) return FileText
  if (dataType.includes("Audio")) return Database
  return FileText
}

// UsernameDisplay component for labelers/validators
function UsernameDisplay({ id }: { id: string }) {
  const { data, isLoading, error } = useSWR(
    id ? `/api/usernames?ids=${id}` : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch username');
      const json = await res.json();
      return json.username;
    },
    { dedupingInterval: 3000, revalidateOnFocus: false, suspense: false }
  );

  if (!id) return null;
  if (data && typeof data === 'string') return <>{data}</>;
  if (isLoading) return <span className="italic text-gray-400">Loading...</span>;
  return <span className="italic text-gray-400">{data?.username?.toString() || "Unavailable"}</span>;
}

export default function LabelNowPage() {
  const [labeledTasks] = useState(sampleLabeledTasks)
  const { user } = useUserProfile();
  const { projects, isLoading, isError, updateProject, mutate } = useProjects();
  const [uploadingTaskId, setUploadingTaskId] = useState<number | null>(null)
  const [uploadedTaskFiles, setUploadedTaskFiles] = useState<Record<number, File[]>>({})
  const [showUploadModal, setShowUploadModal] = useState<number | null>(null)
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [labelingLoading, setLabelingLoading] = useState<Record<number, boolean>>({});
  const [labelingError, setLabelingError] = useState<Record<number, string | null>>({});
  // Use string keys for these states to allow keys like "123-validator"
  const [downloadingFiles, setDownloadingFiles] = useState<Record<string, boolean>>({});
  const [downloadedFiles, setDownloadedFiles] = useState<Record<string, { name: string; url: string }[]>>({});
  // State for update progress UI
  const [showUpdateProgress, setShowUpdateProgress] = useState<Record<number, boolean>>({});
  const [progressSlider, setProgressSlider] = useState<Record<number, number>>({});
  const [updateProgressLoading, setUpdateProgressLoading] = useState<Record<number, boolean>>({});
  const [updateProgressError, setUpdateProgressError] = useState<Record<number, string | null>>({});
  const [showUploadLabelledFiles, setShowUploadLabelledFiles] = useState<Record<number, boolean>>({});

  const handleTaskFileSelect = (taskId: number, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files)
      setUploadedTaskFiles((prev) => ({
        ...prev,
        [taskId]: [...(prev[taskId] || []), ...fileArray],
      }))
    }
  }

  const handleUploadTaskData = async (taskId: number) => {
    setUploadingTaskId(taskId)
    // Simulate upload process
    setTimeout(() => {
      setUploadingTaskId(null)
      setUploadedTaskFiles((prev) => ({
        ...prev,
        [taskId]: [],
      }))
      setShowUploadModal(null)
      // You could show a success message here
    }, 2000)
  }

  const removeTaskFile = (taskId: number, fileIndex: number) => {
    setUploadedTaskFiles((prev) => ({
      ...prev,
      [taskId]: prev[taskId]?.filter((_, index) => index !== fileIndex) || [],
    }))
  }

  // Handler for Start Labeling
  const handleStartLabeling = async (project: any) => {
    if (!user?.id) return;
    setLabelingLoading(l => ({ ...l, [project.id]: true }));
    setLabelingError(e => ({ ...e, [project.id]: null }));
    try {
      // Prevent duplicate
      if (project.labelers && project.labelers.includes(user.id)) return;
      const updatedProject: Project = {
        ...project,
        status: "Labeling in Progress",
        labelers: [...(project.labelers || []), user.id],
      };
      await updateProject(updatedProject);
      mutate();
      // Download files if available
      if (project.fileIds && project.fileIds.length > 0) {
        const files = await downloadSupabaseFiles(project.fileIds);
        setDownloadedFiles(f => ({ ...f, [project.id]: files }));
      }
    } catch (err: any) {
      setLabelingError(e => ({ ...e, [project.id]: err.message || 'Failed to apply' }));
    } finally {
      setLabelingLoading(l => ({ ...l, [project.id]: false }));
    }
  };

  // Download handler for details section
  const handleDownloadFiles = async (project: any) => {
    setDownloadingFiles(d => ({ ...d, [project.id]: true }));
    try {
      const files = await downloadSupabaseFiles(project.fileIds || []);
      setDownloadedFiles(f => ({ ...f, [project.id]: files }));
      files.forEach(file => {
        openFileInNewTab(file.url);
      });
      // Update lastActivity after successful download
      let updatedFields: any = { lastActivity: new Date().toISOString() };
      if ((typeof project.progress !== 'number' || project.progress <= 10)) {
        updatedFields.progress = 20;
        updatedFields.status = "Labeling Ongoing";
      }
      await updateProject({ ...project, ...updatedFields });
      mutate();
    } finally {
      setDownloadingFiles(d => ({ ...d, [project.id]: false }));
    }
  };

  // Add handler for downloading validator files
  const handleDownloadValidatorFiles = async (project: any) => {
    setDownloadingFiles(d => ({ ...d, [project.id + "-validator"]: true }));
    try {
      const files = await downloadSupabaseFiles(project.validatedFileIds || []);
      setDownloadedFiles(f => ({ ...f, [project.id + "-validator"]: files }));
      files.forEach(file => {
        openFileInNewTab(file.url);
      });
      await updateProject({ ...project, lastActivity: new Date().toISOString() });
      mutate();
    } finally {
      setDownloadingFiles(d => ({ ...d, [project.id + "-validator"]: false }));
    }
  };

  // Filter projects for Find Work and My Dashboard
  const findWorkProjects = (projects || []).filter(
    (project: Project) => !project.labelers?.includes(user?.id!)
  );
  const myLabeledProjects = (projects || []).filter(
    (project: Project) => project.labelers?.includes(user?.id!)
  );

  // Collect all labeler/validator ids for username fetching
  const allLabelerIds = Array.from(new Set((projects||[]).flatMap(p => p.labelers || []))).filter(Boolean);
  const allValidatorIds = Array.from(new Set((projects||[]).flatMap(p => p.validators || []))).filter(Boolean);
  const { usernames: labelerUsernames } = useUsernames(allLabelerIds);
  const { usernames: validatorUsernames } = useUsernames(allValidatorIds);

  return (
    <ProtectedLayout>
      <main className="flex-1 p-6 md:p-8 overflow-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            Label Now
          </h1>
        </div>

        <div className="mx-auto space-y-8">
          {/* Section 1: My Dashboard */}
          <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-[0_0_15px_rgba(56,189,248,0.1)] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold flex items-center">
                <Tag className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                My Dashboard
              </h2>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-6 text-center text-blue-500">Loading your projects...</div>
              ) : myLabeledProjects.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No labeled projects yet.</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-white/50 dark:bg-gray-800/50 text-left">
                      <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Project Name</th>
                      <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Status</th>
                      <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Type</th>
                      <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Progress</th>
                      <th className="p-4 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myLabeledProjects.map((project: Project, index: number) => {
                      const isExpanded = expandedProject === project.id;
                      const DataIcon = getDataTypeIcon(project.fileType);
                      // Only define these inside the expanded section where they're needed
                      return (
                        <React.Fragment key={project.id}>
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="border-t border-gray-200 dark:border-gray-800 hover:bg-white/80 dark:hover:bg-gray-800/30 transition-colors"
                          >
                            <td className="p-4">
                              <div>
                                <div className="font-medium">{project.name}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <ProjectStatusLabel status={project.status} />
                            </td>
                            <td className="p-4">
                              <span className="font-medium">{project.fileType || 'N/A'}</span>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div>{project.fileCount} files</div>
                                {/* {project.accuracy && ( */}
                                  <div className="text-green-600 dark:text-green-400">Progress: {project.progress || 0}%</div>
                                {/* )} */}
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
                                {/* {(project.fileIds && project.fileIds.length > 0) && (
                                  <button
                                    onClick={() => handleDownloadFiles(project)}
                                    disabled={downloadingFiles[project.id]}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all text-sm flex items-center"
                                  >
                                    {downloadingFiles[project.id] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                    Download Files
                                  </button>
                                )} */}
                                <button
                                  onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all text-sm flex items-center"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-4 h-4 mr-2" />
                                      Hide Details
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-4 h-4 mr-2" />
                                      View Details
                                    </>
                                  )}
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                          {/* Expandable Details Section */}
                          {isExpanded && (
                            <tr>
                              <td colSpan={5} className="p-0">
                                <div className="bg-white/50 dark:bg-gray-800/50 p-6">
                                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {/* Project Statistics */}
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-lg flex items-center">
                                        <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                        Statistics
                                      </h4>
                                      <div className="space-y-3">
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Total Size:</span>
                                          <span className="text-sm font-medium">{project.totalSize}</span>
                                        </div>
                                        {/* <div className="flex justify-between">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy:</span>
                                          <span className="text-sm font-medium text-green-600 dark:text-green-400">{project.accuracy}%</span>
                                        </div> */}
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Progress:</span>
                                          <span className="text-sm font-medium text-green-600 dark:text-green-400">{typeof project.progress === 'number' ? project.progress : 0}%</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Completed:</span>
                                          <span className="text-sm font-medium">{project.completedTasks}/{project.totalTasks}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(project.priority)}`}>{project.priority}</span>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Team Information */}
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-lg flex items-center">
                                        <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                        Team
                                      </h4>
                                      <div className="space-y-3">
                                        <div>
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Labelers:</span>
                                          <div className="mt-1 space-y-1">
                                            {project.labelers?.filter((i: string) => i !== '')?.map((labeler: string, idx: number) => (
                                              <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                                • <UsernameDisplay id={labeler || ''} />
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Validators:</span>
                                          <div className="mt-1 space-y-1">
                                            {project.validators?.filter((i: string) => i !== '')?.map((validator: string, idx: number) => (
                                              <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                                • <UsernameDisplay id={validator || ''} />
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {/* Categories & Activity */}
                                    <div className="space-y-4">
                                      <h4 className="font-semibold text-lg flex items-center">
                                        <FileCheck className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                        Categories
                                      </h4>
                                      <div className="space-y-2">
                                        {project.categories?.map((category: string, idx: number) => (
                                          <span key={idx} className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full mr-2 mb-1">{category}</span>
                                        ))}
                                      </div>
                                      <div className="mt-4">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Activity:</span>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          {project.lastActivity ? (
                                            <>
                                              <span>{formatDateTime(project.lastActivity)}</span>
                                              <span className="ml-2 text-xs text-gray-500">({getTimeAgo(project.lastActivity)})</span>
                                            </>
                                          ) : (
                                            <span>—</span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {/* Project Notes */}
                                  <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-lg flex items-center mb-3">
                                      <AlertCircle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                      Project Notes
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{project.notes}</p>
                                  </div>
                                  {(user?.id && project.labelers?.includes(user.id)) && (
                                    <div className="flex flex-wrap gap-3 mt-4 items-center">
                                      {project.fileIds?.length > 0 && (
                                        <button
                                          onClick={() => handleDownloadFiles(project)}
                                          disabled={downloadingFiles[String(project.id)]}
                                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center"
                                        >
                                          {downloadingFiles[String(project.id)] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                          Download Files
                                        </button>
                                      )}
                                      {project.status === "Sent Back for Fixes" ? (
                                        <button
                                          onClick={() => setShowUploadLabelledFiles((prev) => ({ ...prev, [project.id]: !prev[project.id] }))}
                                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all flex items-center"
                                        >
                                          Re-Submit Labelled Files
                                        </button>
                                      ) : (
                                        <button
                                          onClick={() => setShowUploadLabelledFiles((prev) => ({ ...prev, [project.id]: !prev[project.id] }))}
                                          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all flex items-center"
                                        >
                                          Upload Labelled Files
                                        </button>
                                      )}
                                      {/* Always show Download Validator Files if validatedFileIds exist for labelers */}
                                      {project.validatedFileIds && project.validatedFileIds.length > 0 && (
                                        <button
                                          onClick={() => handleDownloadValidatorFiles(project)}
                                          disabled={downloadingFiles[`${project.id}-validator`]}
                                          className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-lg font-medium transition-all flex items-center"
                                        >
                                          {downloadingFiles[`${project.id}-validator`] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                          Download Validator Files
                                        </button>
                                      )}
                                    </div>
                                  )}
                                  {showUpdateProgress[project.id] && (
                                    <UpdateProgressSection
                                      project={project}
                                      progressSlider={progressSlider}
                                      setProgressSlider={setProgressSlider}
                                      updateProgressLoading={updateProgressLoading}
                                      updateProgressError={updateProgressError}
                                      setUpdateProgressLoading={setUpdateProgressLoading}
                                      setUpdateProgressError={setUpdateProgressError}
                                      updateProject={updateProject}
                                      mutate={mutate}
                                      setShowUpdateProgress={setShowUpdateProgress}
                                    />
                                  )}
                                  {showUploadLabelledFiles?.[project.id] && (
                                    <UploadLabelledFilesSection
                                      project={project}
                                      updateProject={updateProject}
                                      mutate={mutate}
                                      setShowUploadLabelledFiles={setShowUploadLabelledFiles}
                                    />
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Section 2: Find Work */}
          <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-[0_0_15px_rgba(56,189,248,0.1)] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold flex items-center">
                <FileText className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                Find Work
              </h2>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="text-center text-blue-500">Loading available projects...</div>
              ) : findWorkProjects.length === 0 ? (
                <div className="text-center text-gray-500">No projects available.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {findWorkProjects.map((project, index) => {
                    const DataIcon = getDataTypeIcon(project.fileType)
                    const isExpanded = expandedProject === project.id;
                    return (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:shadow-[0_0_10px_rgba(56,189,248,0.15)] transition-all duration-200 group mb-4"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <DataIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(project?.priority || '')}`}>{project?.priority || 'N/A'}</span>
                        </div>

                        <h3 className="font-semibold text-lg mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {project.name}
                        </h3>

                        <div className="space-y-3 mb-4">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Database className="w-4 h-4 mr-2" />
                            <span className="font-medium">File Type:</span>
                            <span className="ml-1">{project.fileType}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span className="font-medium">Deadline:</span>
                            <span className="ml-1">{project.estimatedCompletion}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4 mr-2" />
                            <span className="font-medium">Reward:</span>
                            <span className="ml-1 text-green-600 dark:text-green-400 font-semibold">N/A</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">Est. Time:</span>
                            <span className="ml-1">N/A</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-2 flex-wrap">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{project.fileCount} items</span>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              disabled={!user?.id || (project.labelers && project.labelers.includes(user.id)) || labelingLoading[project.id]}
                              onClick={() => user?.id && handleStartLabeling(project)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center justify-center
                                ${project.labelers && user?.id && project.labelers.includes(user.id)
                                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'}
                            `}
                            >
                              {labelingLoading[project.id] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              {project.labelers && user?.id && project.labelers.includes(user.id) ? 'Applied' : 'Start Labeling'}
                            </button>
                            {labelingError[project.id] && <span className="text-red-500 text-xs ml-2">{labelingError[project.id]}</span>}
                            <button
                              onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all text-sm flex items-center"
                            >
                              {isExpanded ? (
                                <>
                                  <ChevronUp className="w-4 h-4 mr-2" />
                                  Hide Details
                                </>
                              ) : (
                                <>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Details
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Expandable Details Section */}
                        {isExpanded && (
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {/* Project Statistics */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex items-center">
                                  <TrendingUp className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                  Statistics
                                </h4>
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Total Size:</span>
                                    <span className="text-sm font-medium">{project.totalSize}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy:</span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{project.accuracy}%</span>
                                  </div>
                                   <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Progress:</span>
                                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{typeof project.progress === 'number' ? project.progress : 0}%</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Completed:</span>
                                    <span className="text-sm font-medium">{project.completedTasks}/{project.totalTasks}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(project.priority)}`}>{project.priority}</span>
                                  </div>
                                </div>
                              </div>
                              {/* Team Information */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex items-center">
                                  <User className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                  Team
                                </h4>
                                <div className="space-y-3">
                                  <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Labelers:</span>
                                    <div className="mt-1 space-y-1">
                                      {project.labelers?.filter(i=>i !== '')?.map((labeler: string, idx: number) => (
                                        <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                          • <UsernameDisplay id={labeler || ''} />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div>
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Validators:</span>
                                    <div className="mt-1 space-y-1">
                                      {project.validators?.filter(i=>i !== '')?.map((validator: string, idx: number) => (
                                        <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                          • <UsernameDisplay id={validator || ''} />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* Categories & Activity */}
                              <div className="space-y-4">
                                <h4 className="font-semibold text-lg flex items-center">
                                  <FileCheck className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                  Categories
                                </h4>
                                <div className="space-y-2">
                                  {project.categories?.map((category: string, idx: number) => (
                                    <span key={idx} className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full mr-2 mb-1">{category}</span>
                                  ))}
                                </div>
                                <div className="mt-4">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Last Activity:</span>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {project.lastActivity ? (
                                      <>
                                        <span>{formatDateTime(project.lastActivity)}</span>
                                        <span className="ml-2 text-xs text-gray-500">({getTimeAgo(project.lastActivity)})</span>
                                      </>
                                    ) : (
                                      <span>—</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            {/* Project Notes */}
                            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                              <h4 className="font-semibold text-lg flex items-center mb-3">
                                <AlertCircle className="w-5 h-5 mr-2 text-blue-600 dark:text-blue-400" />
                                Project Notes
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{project.notes}</p>
                            </div>
                            {(user?.id && project.labelers?.includes(user.id)) && (
                              <div className="flex flex-wrap gap-3 mt-4 items-center">
                                {project.fileIds?.length > 0 && (
                                  <button
                                    onClick={() => handleDownloadFiles(project)}
                                    disabled={downloadingFiles[String(project.id)]}
                                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center"
                                  >
                                    {downloadingFiles[String(project.id)] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                    Download Files
                                  </button>
                                )}
                                {project.status === "Sent Back for Fixes" ? (
                                  <button
                                    onClick={() => setShowUploadLabelledFiles((prev) => ({ ...prev, [project.id]: !prev[project.id] }))}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all flex items-center"
                                  >
                                    Re-Submit Labelled Files
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => setShowUploadLabelledFiles((prev) => ({ ...prev, [project.id]: !prev[project.id] }))}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all flex items-center"
                                  >
                                    Upload Labelled Files
                                  </button>
                                )}
                                {/* Always show Download Validator Files if validatedFileIds exist for labelers */}
                                {project.validatedFileIds && project.validatedFileIds.length > 0 && (
                                  <button
                                    onClick={() => handleDownloadValidatorFiles(project)}
                                    disabled={downloadingFiles[`${project.id}-validator`]}
                                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-lg font-medium transition-all flex items-center"
                                  >
                                    {downloadingFiles[`${project.id}-validator`] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                    Download Validator Files
                                  </button>
                                )}
                              </div>
                            )}
                            {showUpdateProgress[project.id] && (
                              <UpdateProgressSection
                                project={project}
                                progressSlider={progressSlider}
                                setProgressSlider={setProgressSlider}
                                updateProgressLoading={updateProgressLoading}
                                updateProgressError={updateProgressError}
                                setUpdateProgressLoading={setUpdateProgressLoading}
                                setUpdateProgressError={setUpdateProgressError}
                                updateProject={updateProject}
                                mutate={mutate}
                                setShowUpdateProgress={setShowUpdateProgress}
                              />
                            )}
                            {showUploadLabelledFiles?.[project.id] && (
                              <UploadLabelledFilesSection
                                project={project}
                                updateProject={updateProject}
                                mutate={mutate}
                                setShowUploadLabelledFiles={setShowUploadLabelledFiles}
                              />
                            )}
                          </div>
                        )}
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold mb-4">Upload Labeled Data</h3>

              <div className="mb-4">
                <input
                  type="file"
                  multiple
                  accept=".csv,.json,.zip,.txt"
                  onChange={(e) => handleTaskFileSelect(showUploadModal, e.target.files)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supported formats: CSV, JSON, ZIP, TXT</p>
              </div>

              {uploadedTaskFiles[showUploadModal]?.length > 0 && (
                <div className="mb-4 max-h-32 overflow-y-auto">
                  <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                  {uploadedTaskFiles[showUploadModal].map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded mb-1"
                    >
                      <span className="text-sm truncate">{file.name}</span>
                      <button
                        onClick={() => removeTaskFile(showUploadModal, index)}
                        className="text-red-500 hover:text-red-700 text-xs ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => handleUploadTaskData(showUploadModal)}
                  disabled={!uploadedTaskFiles[showUploadModal]?.length || uploadingTaskId === showUploadModal}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {uploadingTaskId === showUploadModal ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Upload"
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowUploadModal(null)
                    setUploadedTaskFiles((prev) => ({
                      ...prev,
                      [showUploadModal]: [],
                    }))
                  }}
                  className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </ProtectedLayout>
  )
}
