"use client"

import React, { useState } from "react"
import ProtectedLayout from "../components/protected-layout";
import { motion } from "framer-motion"
import {
  CheckSquare,
  Send,
  CheckCircle,
  Clock,
  Calendar,
  User,
  Eye,
  FileText,
  ImageIcon,
  Database,
  Loader2,
  ChevronUp,
  Download,
  TrendingUp,
  FileCheck,
  AlertCircle,
  ArrowUpRight,
  TextIcon
} from "lucide-react"
import { useProjects } from '@/hooks/useProjects';
import { useUserProfile } from '@/hooks/useUserProfile';
import { downloadSupabaseFiles, openFileInNewTab } from '@/hooks/useSupabaseFileDownload';
import { useUsernames } from '@/hooks/useUsernames';
import { getStatusColor, getPriorityColor } from "@/lib/project-colors";
import { Project } from "@/types/ProjectType";
import { getTimeAgo, formatDateTime } from "@/lib/time-utils";
import { useSupabaseFileUpload } from '@/hooks/useSupabaseFileUpload';

const getDataTypeIcon = (dataType: string) => {
  if (dataType?.includes("Image") || dataType?.includes("Video")) return ImageIcon
  if (dataType?.includes("Text")) return FileText
  if (dataType?.includes("Audio")) return Database
  return FileText
}

function UsernameDisplay({ id }: { id: string }) {
  const { usernames: data, isLoading,  } = useUsernames([id]);
  if (!id) return null;
  if (data && typeof data === 'string') return <>{data}</>;
  if (isLoading) return <span className="italic text-gray-400">Loading...</span>;
  return <span className="italic text-gray-400">{data?.username?.toString() || "Unavailable"}</span>;
}

export default function ValidateNowPage() {
  const { user } = useUserProfile();
  const { projects, isLoading, isError, updateProject, mutate } = useProjects();
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [validatingLoading, setValidatingLoading] = useState<Record<number, boolean>>({});
  const [validatingError, setValidatingError] = useState<Record<number, string | null>>({});
  const [downloadingFiles, setDownloadingFiles] = useState<Record<string, boolean>>({});
  const [downloadedFiles, setDownloadedFiles] = useState<Record<string, { name: string; url: string }[]>>({});
  const [showRevisionUpload, setShowRevisionUpload] = useState<Record<number, boolean>>({});
  const [showCompleteUpload, setShowCompleteUpload] = useState<Record<number, boolean>>({});
  const [revisionFiles, setRevisionFiles] = useState<Record<number, File[]>>({});
  const [completeFiles, setCompleteFiles] = useState<Record<number, File[]>>({});
  const [revisionNotes, setRevisionNotes] = useState<Record<number, string>>({});
  const [completeNotes, setCompleteNotes] = useState<Record<number, string>>({});
  const { uploadFile, uploading } = useSupabaseFileUpload();

  // Find Work: progress >= 30, user not in validators, labelers, or submitter
  const findWorkProjects = (projects || []).filter((project: Project) =>
    project.progress >= 30 &&
    !project.validators?.includes(user?.id!) &&
    !project.labelers?.includes(user?.id!) &&
    project.submitter !== user?.id
  );
  // My Dashboard: user is a validator
  const myValidationProjects = (projects || []).filter((project: Project) =>
    project.validators?.includes(user?.id!)
  );

  // Start Validating handler
  const handleStartValidating = async (project: Project) => {
    if (!user?.id) return;
    setValidatingLoading(l => ({ ...l, [project.id]: true }));
    setValidatingError(e => ({ ...e, [project.id]: null }));
    try {
      if (project.validators && project.validators.includes(user.id)) return;
      const updatedProject: Project = {
        ...project,
        status: "Validation Started",
        validators: [...(project.validators || []), user.id],
        progress: 40,
        lastActivity: new Date().toISOString(),
      };
      await updateProject(updatedProject);
      mutate();
    } catch (err: any) {
      setValidatingError(e => ({ ...e, [project.id]: err.message || 'Failed to apply' }));
    } finally {
      setValidatingLoading(l => ({ ...l, [project.id]: false }));
    }
  };

  // Download handlers
  const handleDownloadFiles = async (project: Project, field: 'fileIds' | 'labelledFileIds') => {
    const key = `${project.id}-${field}`;
    setDownloadingFiles(d => ({ ...d, [key]: true }));
    try {
      const files = await downloadSupabaseFiles(project[field] || []);
      setDownloadedFiles(f => ({ ...f, [key]: files }));
      files.forEach(file => {
        openFileInNewTab(file.url);
      });
    } finally {
      setDownloadingFiles(d => ({ ...d, [key]: false }));
    }
  };

  // Download Labeler Files handler with project update
  const handleDownloadLabelerFiles = async (project: Project) => {
    const key = `${project.id}-labelledFileIds`;
    setDownloadingFiles(d => ({ ...d, [key]: true }));
    try {
      const files = await downloadSupabaseFiles(project.labelledFileIds || []);
      setDownloadedFiles(f => ({ ...f, [key]: files }));
      files.forEach(file => {
        openFileInNewTab(file.url);
      });
      // Update project status/progress/activity
      await updateProject({
        ...project,
        status: 'Validation Ongoing',
        progress: 50,
        lastActivity: new Date().toISOString(),
      });
      mutate();
    } finally {
      setDownloadingFiles(d => ({ ...d, [key]: false }));
    }
  };

  // Upload handler for revision/complete
  const handleUploadValidatedFiles = async (project: Project, files: File[], notes: string, type: 'revision' | 'complete') => {
    if (!files.length) return;
    let uploadedFileIds: string[] = [];
    for (const file of files) {
      const fileId = await uploadFile(file);
      uploadedFileIds.push(fileId);
    }
    // Append notes
    const prevNotes = project.notes || '';
    const newNotes = prevNotes ? `${prevNotes}\n\n[VALIDATOR NOTES ${new Date().toLocaleString()}] ${notes}` : notes;
    let update: Partial<Project> = {
      validatedFileIds: uploadedFileIds,
      notes: newNotes,
      lastActivity: new Date().toISOString(),
    };
    if (type === 'revision') {
      update.status = 'Sent Back for Fixes';
      update.progress = 70;
    } else {
      update.status = 'Final Validation Completed';
      update.progress = 90;
    }
    await updateProject({ ...project, ...update });
    mutate();
    if (type === 'revision') {
      setShowRevisionUpload(prev => ({ ...prev, [project.id]: false }));
      setRevisionFiles(prev => ({ ...prev, [project.id]: [] }));
      setRevisionNotes(prev => ({ ...prev, [project.id]: '' }));
    } else {
      setShowCompleteUpload(prev => ({ ...prev, [project.id]: false }));
      setCompleteFiles(prev => ({ ...prev, [project.id]: [] }));
      setCompleteNotes(prev => ({ ...prev, [project.id]: '' }));
    }
  };

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
            Validate Now
          </h1>
        </div>
        <div className="mx-auto space-y-8">
          {/* Section 1: My Dashboard */}
          <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-[0_0_15px_rgba(56,189,248,0.1)] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold flex items-center">
                <CheckSquare className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                My Dashboard
              </h2>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-6 text-center text-blue-500">Loading your projects...</div>
              ) : myValidationProjects.length === 0 ? (
                <div className="p-6 text-center text-gray-500">No validation projects yet.</div>
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
                    {myValidationProjects.map((project: Project, index: number) => {
                      const isExpanded = expandedProject === project.id;
                      const DataIcon = getDataTypeIcon(project.fileType);
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
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>{project.status}</span>
                            </td>
                            <td className="p-4">
                              <span className="font-medium">{project.fileType || 'N/A'}</span>
                            </td>
                            <td className="p-4">
                              <div className="text-sm">
                                <div>{project.fileCount} files</div>
                                <div className="text-green-600 dark:text-green-400">Progress: {project.progress || 0}%</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-2 flex-wrap">
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
                                    <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                      {project.notes && project.notes.split(/(\[VALIDATOR NOTES [^\]]+\])/g).map((part, idx) => {
                                        if (/^\[VALIDATOR NOTES/.test(part)) {
                                          return <span key={idx}><b>{part}</b></span>;
                                        }
                                        return <span key={idx}>{part}</span>;
                                      })}
                                    </div>
                                  </div>
                                  <div className="flex flex-wrap gap-3 mt-4 items-center">
                                    {project.fileIds?.length > 0 && (
                                      <button
                                        onClick={() => handleDownloadFiles(project, 'fileIds')}
                                        disabled={downloadingFiles[`${project.id}-fileIds`]}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center"
                                      >
                                        {downloadingFiles[`${project.id}-fileIds`] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                        Download Submitter Files
                                      </button>
                                    )}
                                    {project.labelledFileIds && project.labelledFileIds.length > 0 && (
                                      <button
                                        onClick={() => handleDownloadLabelerFiles(project)}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                                      >
                                        <Download className="w-4 h-4 mr-2" />
                                        Download Labeler Files
                                      </button>
                                    )}
                                    {/* Hide revision/complete buttons if project.progress === 100 */}
                                    {project.progress !== 100 && (
                                      <>
                                        {/* Submit For Revision Button */}
                                        <button
                                          onClick={() => setShowRevisionUpload(prev => ({ ...prev, [project.id]: true }))}
                                          className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-gray-900 dark:text-gray-900 rounded-lg font-medium transition-all flex items-center gap-2"
                                        >
                                          <ArrowUpRight className="w-4 h-4 mr-2" />
                                          Submit For Revision
                                        </button>
                                        {/* Complete Project Button */}
                                        <button
                                          onClick={() => setShowCompleteUpload(prev => ({ ...prev, [project.id]: true }))}
                                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                                        >
                                          <CheckCircle className="w-4 h-4 mr-2" />
                                          Complete Project
                                        </button>
                                      </>
                                    )}
                                  </div>
                                  {/* Revision Upload Section */}
                                  {showRevisionUpload[project.id] && (
                                    <div className="w-full mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-700">
                                      <h4 className="font-semibold mb-2">Upload Revision Files</h4>
                                      <input
                                        type="file"
                                        multiple
                                        onChange={e => setRevisionFiles(prev => ({ ...prev, [project.id]: Array.from(e.target.files || []) }))}
                                        className="mb-2"
                                      />
                                      <textarea
                                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-2"
                                        rows={3}
                                        placeholder="Add project notes for revision..."
                                        value={revisionNotes[project.id] || ''}
                                        onChange={e => setRevisionNotes(prev => ({ ...prev, [project.id]: e.target.value }))}
                                      />
                                      <button
                                        onClick={() => handleUploadValidatedFiles(project, revisionFiles[project.id] || [], revisionNotes[project.id] || '', 'revision')}
                                        disabled={uploading || !(revisionFiles[project.id]?.length) || !revisionNotes[project.id]?.trim()}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                                      >
                                        Upload Revision
                                      </button>
                                    </div>
                                  )}
                                  {/* Complete Upload Section */}
                                  {showCompleteUpload[project.id] && (
                                    <div className="w-full mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-700">
                                      <h4 className="font-semibold mb-2">Upload Completion Files</h4>
                                      <input
                                        type="file"
                                        multiple
                                        onChange={e => setCompleteFiles(prev => ({ ...prev, [project.id]: Array.from(e.target.files || []) }))}
                                        className="mb-2"
                                      />
                                      <textarea
                                        className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 mb-2"
                                        rows={3}
                                        placeholder="Add project notes for completion..."
                                        value={completeNotes[project.id] || ''}
                                        onChange={e => setCompleteNotes(prev => ({ ...prev, [project.id]: e.target.value }))}
                                      />
                                      <button
                                        onClick={() => handleUploadValidatedFiles(project, completeFiles[project.id] || [], completeNotes[project.id] || '', 'complete')}
                                        disabled={uploading || !(completeFiles[project.id]?.length) || !completeNotes[project.id]?.trim()}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center gap-2"
                                      >
                                        Upload Complete
                                      </button>
                                    </div>
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
                <Eye className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
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
                            {/* <TextIcon className="w-4 h-4 mr-2 size-full min-w-fit" /> */}
                            <span className="ml-1">{project.description}</span>
                          </div>
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
                            <Clock className="w-4 h-4 mr-2" />
                            <span className="font-medium">Est. Time:</span>
                            <span className="ml-1">N/A</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700 gap-2 flex-wrap">
                          <span className="text-sm text-gray-500 dark:text-gray-400">{project.fileCount} items</span>
                          <div className="flex gap-2 flex-wrap">
                            <button
                              disabled={!user?.id || (project.validators && project.validators.includes(user.id)) || validatingLoading[project.id]}
                              onClick={() => user?.id && handleStartValidating(project)}
                              className={`px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center justify-center
                                ${project.validators && user?.id && project.validators.includes(user.id)
                                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                                  : 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white'}
                            `}
                            >
                              {validatingLoading[project.id] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                              {project.validators && user?.id && project.validators.includes(user.id) ? 'Applied' : 'Start Validating'}
                            </button>
                            {validatingError[project.id] && <span className="text-red-500 text-xs ml-2">{validatingError[project.id]}</span>}
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
                              <div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                                {project.notes && project.notes.split(/(\[VALIDATOR NOTES [^\]]+\])/g).map((part, idx) => {
                                  if (/^\[VALIDATOR NOTES/.test(part)) {
                                    return <span key={idx}><b>{part}</b></span>;
                                  }
                                  return <span key={idx}>{part}</span>;
                                })}
                              </div>
                            </div>
                            {/* <div className="flex flex-wrap gap-3 mt-4 items-center">
                              {project.fileIds?.length > 0 && (
                                <button
                                  onClick={() => handleDownloadFiles(project, 'fileIds')}
                                  disabled={downloadingFiles[`${project.id}-fileIds`]}
                                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center"
                                >
                                  {downloadingFiles[`${project.id}-fileIds`] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                  Download Submitter Files
                                </button>
                              )}
                              {project.labelledFileIds && project.labelledFileIds.length > 0 && (
                                <button
                                  onClick={() => handleDownloadFiles(project, 'labelledFileIds')}
                                  disabled={downloadingFiles[`${project.id}-labelledFileIds`]}
                                  className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-lg font-medium transition-all flex items-center"
                                >
                                  {downloadingFiles[`${project.id}-labelledFileIds`] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
                                  Download Labeler Files
                                </button>
                              )}
                            </div> */}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedLayout>
  )
}
