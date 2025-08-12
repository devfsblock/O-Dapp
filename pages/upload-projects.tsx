"use client"

import React, { useState, useRef, useEffect } from "react"
import ProtectedLayout from "@/components/protected-layout"
import { motion, AnimatePresence } from "framer-motion"
import {
  Upload,
  FileText,
  ImageIcon,
  Database,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Calendar,
  BarChart3,
  ChevronUp,
  User,
  FileCheck,
  AlertCircle,
  TrendingUp,
} from "lucide-react"
import { useProjects } from '@/hooks/useProjects'
import { useUserProfile } from '@/hooks/useUserProfile'
import { useSupabaseFileUpload } from '@/hooks/useSupabaseFileUpload'
import { useToast } from "@/hooks/use-toast";
import UsernameDisplay from '@/components/username-display'
import { getStatusColor, getPriorityColor } from "@/lib/project-colors";
import ProjectStatusLabel from "@/components/ProjectStatusLabel";
import { getTimeRemaining, getTimeAgo } from "@/lib/time-utils";

const getFileIcon = (fileType: string) => {
  if (fileType.includes("Image")) return ImageIcon
  if (fileType.includes("CSV") || fileType.includes("JSON")) return Database
  return FileText
}

// Helper function for time remaining (future date)
// function getTimeRemaining(dateString: string) {
//   const now = new Date();
//   const date = new Date(dateString);
//   const diffMs = date.getTime() - now.getTime();
//   if (diffMs <= 0) return 'Due now';
//   const diffSec = Math.floor(diffMs / 1000);
//   if (diffSec < 60) return 'Less than 1 minute remaining';
//   const diffMin = Math.floor(diffSec / 60);
//   if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} remaining`;
//   const diffHr = Math.floor(diffMin / 60);
//   if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} remaining`;
//   const diffDay = Math.floor(diffHr / 24);
//   if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? '' : 's'} remaining`;
//   const diffMonth = Math.floor(diffDay / 30);
//   return `${diffMonth} month${diffMonth === 1 ? '' : 's'} remaining`;
// }

// Helper function for time difference (past)
// function getTimeAgo(dateString: string) {
//   const now = new Date();
//   const date = new Date(dateString);
//   const diffMs = now.getTime() - date.getTime();
//   const diffSec = Math.floor(diffMs / 1000);
//   if (diffSec < 60) return 'Less than 1 minute ago';
//   const diffMin = Math.floor(diffSec / 60);
//   if (diffMin < 60) return `${diffMin} minute${diffMin === 1 ? '' : 's'} ago`;
//   const diffHr = Math.floor(diffMin / 60);
//   if (diffHr < 24) return `${diffHr} hour${diffHr === 1 ? '' : 's'} ago`;
//   const diffDay = Math.floor(diffHr / 24);
//   if (diffDay < 30) return `${diffDay} day${diffDay === 1 ? '' : 's'} ago`;
//   const diffMonth = Math.floor(diffDay / 30);
//   return `${diffMonth} month${diffMonth === 1 ? '' : 's'} ago`;
// }

export default function UploadProjectsPage() {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const { user } = useUserProfile();
  const userId = user?.id;
  const { projects, isLoading, isError, createProject, updateProject, deleteProject, mutate } = useProjects(userId);
  const { uploadFile, uploading: fileUploading, error: fileUploadError, fileId } = useSupabaseFileUpload();
  const [expandedProject, setExpandedProject] = useState<number | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [addLoading, setAddLoading] = useState(false)
  const [fileIds, setFileIds] = useState<string[]>([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    categories: '',
    priority: 'Low',
    estimatedCompletion: '',
    notes: '',
  });
  const [projectFormError, setProjectFormError] = useState<string | null>(null);
  const [projectFormLoading, setProjectFormLoading] = useState(false)
  const { toast } = useToast();
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const selectedCategories = projectForm.categories.split(',').map(s => s.trim()).filter(Boolean);

  // Category options for dropdown
  const categoryOptions = [
    "Sentiment Analysis",
    "Named Entity Recognition (NER)",
    "Topic Classification",
    "Intent Classification",
    "Spam Detection",
    "Question-Answer Pairing",
    "Toxicity Detection",
    "Part-of-Speech (POS) Tagging",
    "Emotion Detection",
    "Language Detection"
  ];

  // Close dropdown on outside click
  useEffect(() => {
    if (!categoriesDropdownOpen) return;
    function handleClick(e: MouseEvent) {
      const dropdown = document.getElementById('categories-dropdown');
      if (dropdown && !dropdown.contains(e.target as Node)) {
        setCategoriesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [categoriesDropdownOpen]);

  const handleAddProject = async (data: any) => {
    setAddError(null)
    setAddLoading(true)
    try {
      await createProject({ ...data, submitter: userId })
      setShowAddDialog(false)
    } catch (err: any) {
      setAddError(err.message || 'Failed to add project')
    } finally {
      setAddLoading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      setUploadedFiles((prev) => [...prev, ...files])
      const ids: string[] = [];
      for (const file of files) {
        try {
          const fileid = await uploadFile(file)
          ids.push(fileid)
          toast({ title: 'File uploaded', description: `${file.name} uploaded successfully.`, variant: 'default' })
        } catch (err) {
          toast({ title: 'Upload failed', description: `Failed to upload ${file.name}.`, variant: 'destructive' })
          setAddError('File upload failed.');
        }
      }
      setFileIds((prev) => [...prev, ...ids]);
      setShowProjectForm(true);
    }
  }

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      setUploadedFiles((prev) => [...prev, ...files])
      const ids: string[] = [];
      for (const file of files) {
        try {
          const fileid = await uploadFile(file)
          ids.push(fileid)
          toast({ title: 'File uploaded', description: `${file.name} uploaded successfully.`, variant: 'default' })
        } catch (err) {
          toast({ title: 'Upload failed', description: `Failed to upload ${file.name}.`, variant: 'destructive' })
          setAddError('File upload failed.');
        }
      }
      setFileIds((prev) => [...prev, ...ids]);
      setShowProjectForm(true);
    }
  }

  const toggleProjectDetails = (projectId: number) => {
    setExpandedProject(expandedProject === projectId ? null : projectId)
  }

  const handleProjectFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProjectFormArrayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProjectForm((prev) => ({ ...prev, categories: e.target.value }));
  };

  const handleProjectFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjectFormError(null);
    setProjectFormLoading(true);
    if (!projectForm.name) {
      setProjectFormError('Project name is required');
      setProjectFormLoading(false);
      return;
    }
    if (!userId) {
      setProjectFormError('User ID is missing. Please reconnect your wallet or reload the page.');
      setProjectFormLoading(false);
      return;
    }
    if (!fileIds.length) {
      setProjectFormError('Please upload at least one file.');
      setProjectFormLoading(false);
      return;
    }
    // Calculate fileType and totalSize from uploadedFiles
    const uniqueTypes = Array.from(new Set(uploadedFiles.map(f => f.type || 'unknown')));
    const fileType = uniqueTypes.join(', ');
    const totalSize = (uploadedFiles.reduce((acc, f) => acc + f.size, 0) / 1024 / 1024).toFixed(2) + ' MB';
    try {
      await createProject({
        name: projectForm.name,
        description: projectForm.description,
        fileIds,
        submitter: userId,
        uploadDate: new Date().toISOString(),
        fileType,
        fileCount: fileIds.length,
        status: 'Labeling Started',
        progress: 0,
        estimatedCompletion: projectForm.estimatedCompletion,
        totalSize,
        labelers: [''],
        validators: [''],
        accuracy: 0,
        completedTasks: 0,
        totalTasks: 0,
        categories: projectForm.categories.split(',').map(s => s.trim()),
        notes: projectForm.notes,
        lastActivity: new Date().toISOString(),
        priority: projectForm.priority,
      });
      setShowProjectForm(false);
      setProjectForm({ name: '', description: '', categories: '', priority: '', estimatedCompletion: '', notes: '' });
      setFileIds([]);
      setUploadedFiles([]);
      setAddError(null);
      setAddLoading(false);
      setProjectFormLoading(false);
      mutate();
      toast({ title: 'Project saved', description: 'Project was saved successfully.', variant: 'default' })
    } catch (err: any) {
      setProjectFormError(err.message || 'Failed to add project');
      setProjectFormLoading(false);
      toast({ title: 'Save failed', description: err.message || 'Failed to add project', variant: 'destructive' })
    }
  };

  // Add feedback form state
  const [showFeedbackForm, setShowFeedbackForm] = useState<Record<number, boolean>>({});
  const [feedback, setFeedback] = useState<Record<number, {
    labelerPublic?: string;
    labelerPrivate?: string;
    validatorPublic?: string;
    validatorPrivate?: string;
    complete: string;
  }>>({});
  const [feedbackLoading, setFeedbackLoading] = useState<Record<number, boolean>>({});
  const [feedbackError, setFeedbackError] = useState<Record<number, string>>({});
  const [expandLabeler, setExpandLabeler] = useState<Record<number, boolean>>({});
  const [expandValidator, setExpandValidator] = useState<Record<number, boolean>>({});

  return (
    <ProtectedLayout>
      <main className="flex-1 p-6 md:p-8 overflow-auto bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#4F6BFE] to-purple-600 dark:from-[#4F6BFE] dark:to-purple-400 bg-clip-text text-transparent">
            Upload Projects
          </h1>
        </div>

        <div className="mx-auto space-y-8">
          {/* Section 1: Upload New Project */}
          <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-[0_0_15px_rgba(56,189,248,0.1)] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold flex items-center">
                <Upload className="h-5 w-5 mr-2 text-[#4F6BFE] dark:text-[#4F6BFE]" />
                Upload New Project
              </h2>
            </div>

            <div className="p-6">
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-300 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500"
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept=".csv,.json,.png,.jpg,.jpeg,.mp3,.wav"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Upload className="w-8 h-8 text-[#4F6BFE] dark:text-[#4F6BFE]" />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Drop your files here or click to browse</h3>
                    <p className="text-gray-600 dark:text-gray-400">Supported formats: CSV, JSON, PNG, JPG, MP3, WAV</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Maximum file size: 100MB per file</p>
                  </div>
                </div>
              </div>

              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Selected Files:</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                      >
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            ({(file.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <button
                          onClick={() => setUploadedFiles((prev) => prev.filter((_, i) => i !== index))}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Show reduced Add Project form after files uploaded or selected */}
                  {(showProjectForm || fileUploading) && (
                    <form onSubmit={e => e.preventDefault()} className="space-y-4 mt-6 bg-white dark:bg-gray-900 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Project Name */}
                        <label className="flex flex-col text-gray-700 dark:text-gray-200">
                          Project Name
                          <input name="name" value={projectForm.name} onChange={handleProjectFormChange} className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-[#4F6BFE] focus:border-[#4F6BFE] transition-colors" required />
                        </label>
                        {/* Priority Dropdown */}
                        <label className="flex flex-col text-gray-700 dark:text-gray-200">
                          Priority
                          <select
                            name="priority"
                            value={projectForm.priority}
                            onChange={handleProjectFormChange}
                            className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            {/* <option value="">Select Priority</option> */}
                            <option value="High">High</option>
                            <option value="Medium">Medium</option>
                            <option value="Low">Low</option>
                          </select>
                        </label>
                        {/* Estimated Completion */}
                        <label className="flex flex-col text-gray-700 dark:text-gray-200">
                          Estimated Completion
                          <input name="estimatedCompletion" type="date" value={projectForm.estimatedCompletion} onChange={handleProjectFormChange} className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" />
                        </label>
                        {/* Categories Dropdown with Multi-Select Checkboxes */}
                        <label className="flex flex-col text-gray-700 dark:text-gray-200 relative">
                          Categories
                          <div className="relative">
                            <button
                              type="button"
                              className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors flex justify-between items-center w-full min-h-[40px] text-left"
                              onClick={() => setCategoriesDropdownOpen((open) => !open)}
                            >
                              <span>
                                {selectedCategories.length > 0
                                  ? selectedCategories.join(', ')
                                  : 'Select categories'}
                              </span>
                              <svg className={`w-4 h-4 ml-2 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
                            </button>
                            {categoriesDropdownOpen && (
                              <div className="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow-lg max-h-48 overflow-y-auto" id="categories-dropdown">
                                {categoryOptions.map((cat) => (
                                  <label key={cat} className="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                                    <input
                                      type="checkbox"
                                      value={cat}
                                      checked={selectedCategories.includes(cat)}
                                      onChange={e => {
                                        let selected = [...selectedCategories];
                                        if (e.target.checked) {
                                          selected.push(cat);
                                        } else {
                                          selected = selected.filter(c => c !== cat);
                                        }
                                        setProjectForm(prev => ({ ...prev, categories: selected.join(', ') }));
                                      }}
                                      className="accent-blue-600"
                                    />
                                    {cat}
                                  </label>
                                ))}
                              </div>
                            )}
                          </div>
                        </label>
                        {/* Description textarea (below Estimated Completion, full width) */}
                        <label className="flex flex-col text-gray-700 dark:text-gray-200 md:col-span-2">
                          Technical Description
                          <textarea
                            name="description"
                            value={projectForm.description}
                            onChange={handleProjectFormChange}
                            className="p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[80px]"
                          />
                        </label>
                        {/* Notes */}
                        <label className="flex flex-col text-gray-700 dark:text-gray-200 md:col-span-2">
                          Notes
                          <textarea name="notes" value={projectForm.notes} onChange={handleProjectFormChange} className="p-2 border rounded w-full bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors min-h-[60px]" />
                        </label>
                      </div>
                      {(projectFormError || addError) && <div className="text-red-600 font-medium">{projectFormError || addError}</div>}
                      <div className="mt-4 flex gap-4">
                        <button
                          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center justify-center"
                          onClick={handleProjectFormSubmit}
                          disabled={projectFormLoading || fileUploading || !fileIds.length}
                          type="button"
                        >
                          {projectFormLoading && (
                            <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                          )}
                          {projectFormLoading ? 'Saving...' : 'Upload Project'}
                        </button>
                        <button
                          onClick={() => {
                            setUploadedFiles([]); setFileIds([]); setShowProjectForm(false); setProjectForm({ name: '', description: '', categories: '', priority: '', estimatedCompletion: '', notes: '' });
                          }}
                          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all"
                          disabled={projectFormLoading || fileUploading}
                          type="button"
                        >
                          Clear All
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Loading indicator and error for file upload */}
                  {fileUploading && (
                    <div className="mt-4 text-blue-600 dark:text-blue-400 font-medium flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 mr-2 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      Uploading file(s)...
                    </div>
                  )}
                  {fileUploadError && (
                    <div className="mt-2 text-red-600 font-medium">{fileUploadError}</div>
                  )}

                  {/* <div className="mt-4 flex gap-4">
                    <button
                      className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-500 dark:to-purple-500 dark:hover:from-blue-600 dark:hover:to-purple-600 text-white rounded-lg font-medium transition-all"
                      onClick={handleProjectFormSubmit}
                      disabled={projectFormLoading || fileUploading || !fileIds.length}
                    >
                      {projectFormLoading ? 'Saving...' : 'Upload Project'}
                    </button>
                    <button
                      onClick={() => {
                        setUploadedFiles([]); setFileIds([]); setShowProjectForm(false); setProjectForm({ name: '', description: '', categories: '', priority: '', estimatedCompletion: '', notes: '' });
                      }}
                      className="px-6 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all"
                      disabled={projectFormLoading || fileUploading}
                    >
                      Clear All
                    </button>
                  </div> */}
                </div>
              )}
            </div>
          </div>

          {/* Section 2: View My Projects - With Expandable Rows */}
          <div className="rounded-2xl bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-[0_0_15px_rgba(56,189,248,0.1)] overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold flex items-center">
                <Eye className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
                My Projects
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/50 dark:bg-gray-800/50 text-left">
                    <th className="p-6 font-medium text-gray-500 dark:text-gray-400">Project Details</th>
                    <th className="p-6 font-medium text-gray-500 dark:text-gray-400">Status & Progress</th>
                    <th className="p-6 font-medium text-gray-500 dark:text-gray-400">Timeline</th>
                    <th className="p-6 font-medium text-gray-500 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projects?.map((project, index) => {
                    const FileIcon = getFileIcon(project.fileType)
                    const isExpanded = expandedProject === project.id
                    return (
                      <React.Fragment key={project.id}>
                        <motion.tr
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="border-t border-gray-200 dark:border-gray-800 hover:bg-white/80 dark:hover:bg-gray-800/30 transition-colors"
                        >
                          {/* Project Details */}
                          <td className="p-6">
                            <div className="flex items-start space-x-4">
                              <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                                <FileIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-gray-100">
                                  {project.name}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                                  {project.description}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-500">
                                  <span className="flex items-center">
                                    <Database className="w-4 h-4 mr-1" />
                                    {project.fileType}
                                  </span>
                                  <span>•</span>
                                  <span>{project.fileCount} files</span>
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Status & Progress */}
                          <td className="p-6">
                            <div className="space-y-3">
                              <ProjectStatusLabel status={project.status} />

                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Progress</span>
                                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {project.progress}%
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                  <div
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${project.progress}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Timeline */}
                          <td className="p-6">
                            <div className="space-y-3">
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <Calendar className="w-4 h-4 mr-2" />
                                <div>
                                  <span className="font-medium">Uploaded:</span>
                                  <br />
                                  <span>{new Date(project.uploadDate).toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} (UTC+00:00)</span>
                                  <span className="ml-2 text-xs text-gray-500">{getTimeAgo(project.uploadDate)}</span>
                                </div>
                              </div>
                              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                <div>
                                  <span className="font-medium">Est. Completion:</span>
                                  <br />
                                  <span>{project.estimatedCompletion ? new Date(project.estimatedCompletion).toLocaleDateString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: '2-digit' }) : ''}</span>
                                  {project.estimatedCompletion && <span className="ml-2 text-xs text-gray-500">{getTimeRemaining(project.estimatedCompletion)}</span>}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-6">
                            <div className="flex flex-col space-y-2">
                              <button
                                onClick={() => toggleProjectDetails(project.id)}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all text-sm flex items-center justify-center"
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

                              {project.status === "Final Validation Completed" && (
                                <button className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-indigo-700 hover:from-indigo-600 hover:to-indigo-800 text-white rounded-lg font-medium transition-all flex items-center justify-center">
                                  <Download className="w-4 h-4 mr-2" />
                                  Export Data
                                </button>
                              )}
                            </div>
                          </td>
                        </motion.tr>

                        {/* Expandable Details Row */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.tr
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="border-t border-gray-200 dark:border-gray-800"
                            >
                              <td colSpan={4} className="p-0">
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
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Accuracy:</span>
                                          <span className="text-sm font-medium text-green-600 dark:text-green-400">
                                            {project.accuracy}%
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Completed:</span>
                                          <span className="text-sm font-medium">
                                            {project.completedTasks}/{project.totalTasks}
                                          </span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span className="text-sm text-gray-600 dark:text-gray-400">Priority:</span>
                                          <span
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(
                                              project.priority,
                                            )}`}
                                          >
                                            {project.priority}
                                          </span>
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
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Labelers:
                                          </span>
                                          <div className="mt-1 space-y-1">
                                            {project.labelers.map((labeler: string, idx: number) => (
                                              <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                                • <UsernameDisplay id={labeler} />
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Validators:
                                          </span>
                                          <div className="mt-1 space-y-1">
                                            {project.validators.map((validator: string, idx: number) => (
                                              <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                                                • <UsernameDisplay id={validator} />
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
                                        {project.categories.map((category: string, idx: number) => (
                                          <span
                                            key={idx}
                                            className="inline-block px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full mr-2 mb-1"
                                          >
                                            {category}
                                          </span>
                                        ))}
                                      </div>
                                      <div className="mt-4">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                          Last Activity:
                                        </span>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          {new Date(project.lastActivity).toLocaleString('en-US', { timeZone: 'UTC', year: 'numeric', month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })} (UTC+00:00)
                                          <span className="ml-2 text-xs text-gray-500">{getTimeAgo(project.lastActivity)}</span>
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
                                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                                      {project.notes}
                                    </p>
                                  </div>
                                  {/* Complete Project Button & Feedback Form */}
                                  {project.status === "Final Validation Completed" && project.progress === 90 && (
                                    <div className="mt-6">
                                      {!showFeedbackForm[project.id] ? (
                                        <button
                                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center"
                                          onClick={() => setShowFeedbackForm(prev => ({ ...prev, [project.id]: true }))}
                                        >
                                          Complete Project
                                        </button>
                                      ) : (
                                        <form
                                          className="mt-4 space-y-6 bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-md"
                                          onSubmit={async e => {
                                            e.preventDefault();
                                            setFeedbackLoading(f => ({ ...f, [project.id]: true }));
                                            setFeedbackError(f => ({ ...f, [project.id]: '' }));
                                            try {
                                              await updateProject({
                                                ...project,
                                                progress: 100,
                                                status: "Completed",
                                                feedback: {
                                                  labeler: {
                                                    public: feedback[project.id]?.labelerPublic || '',
                                                    private: feedback[project.id]?.labelerPrivate || '',
                                                  },
                                                  validator: {
                                                    public: feedback[project.id]?.validatorPublic || '',
                                                    private: feedback[project.id]?.validatorPrivate || '',
                                                  },
                                                  complete: feedback[project.id]?.complete || '',
                                                },
                                              });
                                              setShowFeedbackForm(f => ({ ...f, [project.id]: false }));
                                              mutate();
                                              toast({ title: 'Project completed', description: 'Feedback submitted and project marked as completed.', variant: 'default' });
                                            } catch (err: any) {
                                              setFeedbackError(f => ({ ...f, [project.id]: err.message || 'Failed to submit feedback' }));
                                            } finally {
                                              setFeedbackLoading(f => ({ ...f, [project.id]: false }));
                                            }
                                          }}
                                        >
                                          {/* Labeler Feedback (Expandable) */}
                                          <div className="border rounded-xl overflow-hidden">
                                            <button
                                              type="button"
                                              className="w-full flex items-center justify-between px-4 py-3 bg-blue-50 dark:bg-blue-900 hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors font-semibold text-left"
                                              onClick={() => setExpandLabeler(f => ({ ...f, [project.id]: !f[project.id] }))}
                                              aria-expanded={!!expandLabeler[project.id]}
                                            >
                                              <span>Labeler Feedback (optional)</span>
                                              <ChevronUp className={`w-5 h-5 ml-2 transition-transform ${expandLabeler[project.id] ? '' : 'rotate-180'}`} />
                                            </button>
                                            {expandLabeler[project.id] && (
                                              <div className="p-4 space-y-3 bg-blue-50 dark:bg-blue-950">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Public Feedback</label>
                                                <textarea
                                                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                  rows={2}
                                                  placeholder="How was your experience? tell us..."
                                                  value={feedback[project.id]?.labelerPublic || ''}
                                                  onChange={e => setFeedback(f => ({ ...f, [project.id]: { ...f[project.id], labelerPublic: e.target.value } }))}
                                                />
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Private Feedback <span className="text-xs text-gray-400">(internal use only)</span></label>
                                                <textarea
                                                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                  rows={2}
                                                  placeholder="Your opinion matters. type here..."
                                                  value={feedback[project.id]?.labelerPrivate || ''}
                                                  onChange={e => setFeedback(f => ({ ...f, [project.id]: { ...f[project.id], labelerPrivate: e.target.value } }))}
                                                />
                                              </div>
                                            )}
                                          </div>
                                          {/* Validator Feedback (Expandable) */}
                                          <div className="border rounded-xl overflow-hidden">
                                            <button
                                              type="button"
                                              className="w-full flex items-center justify-between px-4 py-3 bg-cyan-50 dark:bg-cyan-900 hover:bg-cyan-100 dark:hover:bg-cyan-800 transition-colors font-semibold text-left"
                                              onClick={() => setExpandValidator(f => ({ ...f, [project.id]: !f[project.id] }))}
                                              aria-expanded={!!expandValidator[project.id]}
                                            >
                                              <span>Validator Feedback (optional)</span>
                                              <ChevronUp className={`w-5 h-5 ml-2 transition-transform ${expandValidator[project.id] ? '' : 'rotate-180'}`} />
                                            </button>
                                            {expandValidator[project.id] && (
                                              <div className="p-4 space-y-3 bg-cyan-50 dark:bg-cyan-950">
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Public Feedback</label>
                                                <textarea
                                                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                  rows={2}
                                                  placeholder="How was your experience? tell us..."
                                                  value={feedback[project.id]?.validatorPublic || ''}
                                                  onChange={e => setFeedback(f => ({ ...f, [project.id]: { ...f[project.id], validatorPublic: e.target.value } }))}
                                                />
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Private Feedback <span className="text-xs text-gray-400">(internal use only)</span></label>
                                                <textarea
                                                  className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                                  rows={2}
                                                  placeholder="Your opinion matters. type here..."
                                                  value={feedback[project.id]?.validatorPrivate || ''}
                                                  onChange={e => setFeedback(f => ({ ...f, [project.id]: { ...f[project.id], validatorPrivate: e.target.value } }))}
                                                />
                                              </div>
                                            )}
                                          </div>
                                          {/* Complete Feedback (required) */}
                                          <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">Project Feedback <span className="text-red-500">*</span></label>
                                            <textarea
                                              className="w-full p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                              rows={3}
                                              placeholder="Share your feedback here..."

                                              value={feedback[project.id]?.complete || ''}
                                              onChange={e => setFeedback(f => ({ ...f, [project.id]: { ...f[project.id], complete: e.target.value } }))}
                                              required
                                            />
                                          </div>
                                          {feedbackError[project.id] && <div className="text-red-600 font-medium mb-2">{feedbackError[project.id]}</div>}
                                          <button
                                            type="submit"
                                            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-medium transition-all flex items-center"
                                            disabled={feedbackLoading[project.id] || !(feedback[project.id]?.complete && feedback[project.id]?.complete.trim())}
                                          >
                                            {feedbackLoading[project.id] ? 'Submitting...' : 'Submit Feedback'}
                                          </button>
                                        </form>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </td>
                            </motion.tr>
                          )}
                        </AnimatePresence>
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </ProtectedLayout>
  )
}
