// ProjectType.ts
// TypeScript interface for a project as used in sampleProjects

export interface ProjectFeedbackSection {
  public?: string;
  private?: string;
}

export interface ProjectFeedback {
  labeler?: ProjectFeedbackSection;
  validator?: ProjectFeedbackSection;
  complete: string;
}

export interface Project {
  id: number;
  name: string;
  uploadDate: string;
  fileType: string;
  fileCount: number;
  status: ProjectStatus;
  progress: number;
  description: string;
  estimatedCompletion: string;
  submitter: string; // user id of the submitter
  fileIds: string[]; // supabase file ids
  labelledFileIds?: string[]; 
  validatedFileIds?: string[]; 
  totalSize: string;
  labelers: string[];
  validators: string[];
  accuracy: number;
  completedTasks: number;
  totalTasks: number;
  categories: string[];
  notes: string;
  lastActivity: string;
  priority: string;
  feedback?: ProjectFeedback;
}

export type ProjectStatus =
  | "Task Listed"
  | "Labeling Started"
  | "Labeling Ongoing"
  | "Files Submitted by Labeler"
  | "Validation Started"
  | "Validation Ongoing"
  | "Initial Validation Completed"
  | "Sent Back for Fixes"
  | "Files Resubmitted by Labeler"
  | "Final Validation Completed"
  | "Completed";
