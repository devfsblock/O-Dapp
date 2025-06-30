import React from "react";
import { Loader2 } from "lucide-react";
import { Project, ProjectStatus } from "@/types/ProjectType";

interface UpdateProgressSectionProps {
  project: Project;
  progressSlider: { [id: number]: number };
  setProgressSlider: React.Dispatch<React.SetStateAction<{ [id: number]: number }>>;
  updateProgressLoading: { [id: number]: boolean };
  updateProgressError: { [id: number]: string | null };
  setUpdateProgressLoading: React.Dispatch<React.SetStateAction<{ [id: number]: boolean }>>;
  setUpdateProgressError: React.Dispatch<React.SetStateAction<{ [id: number]: string | null }>>;
  updateProject: (p: Project) => Promise<void>;
  mutate: () => void;
  setShowUpdateProgress: React.Dispatch<React.SetStateAction<{ [id: number]: boolean }>>;
}

// Helper to map progress to status
function getStatusForProgress(progress: number): ProjectStatus {
  if (progress >= 100) return "Completed";
  if (progress >= 90) return "Final Validation Completed";
  if (progress >= 80) return "Files Resubmitted by Labeler";
  if (progress >= 70) return "Sent Back for Fixes";
  if (progress >= 60) return "Initial Validation Completed";
  if (progress >= 50) return "Validation Ongoing";
  if (progress >= 40) return "Validation Started";
  if (progress >= 30) return "Files Submitted by Labeler";
  if (progress >= 20) return "Labeling Ongoing";
  if (progress >= 10) return "Labeling Started";
  return "Task Listed";
}

export const UpdateProgressSection: React.FC<UpdateProgressSectionProps> = ({
  project,
  progressSlider,
  setProgressSlider,
  updateProgressLoading,
  updateProgressError,
  setUpdateProgressLoading,
  setUpdateProgressError,
  updateProject,
  mutate,
  setShowUpdateProgress,
}) => {
  const currentProgress = typeof progressSlider[project.id] === 'number'
    ? progressSlider[project.id]
    : (typeof project.progress === 'number' ? project.progress : 0);
  const minSlider = Math.min(
    100,
    Math.max(0, Math.ceil((typeof project.progress === 'number' ? project.progress : 0) / 5) * 5)
  );
  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
      <label className="font-medium text-sm mb-1">Progress: {currentProgress}%</label>
      <input
        type="range"
        min={minSlider}
        max={100}
        step={5}
        value={currentProgress}
        onChange={e => setProgressSlider(s => ({ ...s, [project.id]: Number(e.target.value) }))}
        className="w-full accent-blue-600"
      />
      <button
        onClick={async () => {
          setUpdateProgressLoading(l => ({ ...l, [project.id]: true }));
          setUpdateProgressError(e => ({ ...e, [project.id]: null }));
          try {
            const newStatus = getStatusForProgress(currentProgress);
            await updateProject({ ...project, progress: currentProgress, status: newStatus, lastActivity: new Date().toISOString() });
            mutate();
            setShowUpdateProgress(p => ({ ...p, [project.id]: false }));
            setProgressSlider(s => {
              const copy = { ...s };
              delete copy[project.id];
              return copy;
            });
          } catch (err: any) {
            setUpdateProgressError(e => ({ ...e, [project.id]: err.message || 'Failed to update progress' }));
          } finally {
            setUpdateProgressLoading(l => ({ ...l, [project.id]: false }));
          }
        }}
        disabled={updateProgressLoading[project.id]}
        className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all flex items-center justify-center"
      >
        {updateProgressLoading[project.id] ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Update
      </button>
      {updateProgressError[project.id] && <div className="text-red-600 text-sm mt-1">{updateProgressError[project.id]}</div>}
    </div>
  );
};
