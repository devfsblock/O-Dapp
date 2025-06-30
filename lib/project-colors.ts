// lib/project-colors.ts
import type { ProjectStatus } from "@/types/ProjectType";

export function getStatusColor(status: ProjectStatus): string {
  switch (status) {
    case "Task Listed":
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-800";
    case "Labeling Started":
      return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 border-blue-200 dark:border-blue-800";
    case "Labeling Ongoing":
      return "bg-blue-200 dark:bg-blue-900/40 text-blue-900 dark:text-blue-300 border-blue-300 dark:border-blue-700";
    case "Files Submitted by Labeler":
      return "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800";
    case "Validation Started":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800";
    case "Validation Ongoing":
      return "bg-yellow-200 dark:bg-yellow-900/40 text-yellow-900 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700";
    case "Initial Validation Completed":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 border-green-200 dark:border-green-800";
    case "Sent Back for Fixes":
      return "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 border-orange-200 dark:border-orange-800";
    case "Files Resubmitted by Labeler":
      return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-200 border-blue-200 dark:border-blue-700";
    case "Final Validation Completed":
      return "bg-green-200 dark:bg-green-900/40 text-green-900 dark:text-green-300 border-green-300 dark:border-green-700";
    case "Completed":
      return "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-800";
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "High":
      return "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400";
    case "Medium":
      return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
    case "Low":
      return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
    default:
      return "bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-400";
  }
}
