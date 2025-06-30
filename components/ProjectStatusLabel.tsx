// components/ProjectStatusLabel.tsx
import React from "react";
import { Clock, CheckCircle, AlertCircle, FileText, RefreshCcw, ShieldCheck, ListChecks, Upload } from "lucide-react";
import { getStatusColor } from "@/lib/project-colors";
import type { ProjectStatus } from "@/types/ProjectType";

const statusIconMap: Record<ProjectStatus, React.ReactNode> = {
  "Task Listed": <ListChecks className="w-4 h-4 mr-2 text-gray-500" />,
  "Labeling Started": <Clock className="w-4 h-4 mr-2 text-blue-500 dark:text-blue-400" />,
  "Labeling Ongoing": <Clock className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />,
  "Files Submitted by Labeler": <Upload className="w-4 h-4 mr-2 text-indigo-500 dark:text-indigo-400" />,
  "Validation Started": <ShieldCheck className="w-4 h-4 mr-2 text-yellow-500 dark:text-yellow-400" />,
  "Validation Ongoing": <ShieldCheck className="w-4 h-4 mr-2 text-yellow-600 dark:text-yellow-400" />,
  "Initial Validation Completed": <CheckCircle className="w-4 h-4 mr-2 text-green-500 dark:text-green-400" />,
  "Sent Back for Fixes": <AlertCircle className="w-4 h-4 mr-2 text-orange-500 dark:text-orange-400" />,
  "Files Resubmitted by Labeler": <RefreshCcw className="w-4 h-4 mr-2 text-blue-400 dark:text-blue-300" />,
  "Final Validation Completed": <CheckCircle className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />,
  "Completed": <CheckCircle className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />,
};

export default function ProjectStatusLabel({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
      {statusIconMap[status] || <FileText className="w-4 h-4 mr-2 text-gray-400" />} {status}
    </span>
  );
}
