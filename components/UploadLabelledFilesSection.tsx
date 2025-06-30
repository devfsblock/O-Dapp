import React, { useState } from "react";
import { useSupabaseFileUpload } from "@/hooks/useSupabaseFileUpload";
import { Loader2, Upload } from "lucide-react";
import type { Project } from "@/types/ProjectType";

interface Props {
  project: Project;
  updateProject: (p: Project) => Promise<void>;
  mutate: () => void;
  setShowUploadLabelledFiles: React.Dispatch<React.SetStateAction<{ [id: number]: boolean }>>;
}

const UploadLabelledFilesSection: React.FC<Props> = ({ project, updateProject, mutate, setShowUploadLabelledFiles }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { uploadFile } = useSupabaseFileUpload();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    setError(null);
    try {
      const fileIds: string[] = [];
      for (const file of selectedFiles) {
        const id = await uploadFile(file);
        fileIds.push(id);
      }
      await updateProject({
        ...project,
        labelledFileIds: fileIds,
        lastActivity: new Date().toISOString(),
        progress: 30,
        status: "Files Submitted by Labeler",
      });
      mutate();
      setShowUploadLabelledFiles(prev => ({ ...prev, [project.id]: false }));
      setSelectedFiles([]);
    } catch (err: any) {
      setError(err.message || "Failed to upload files");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
      <label className="font-medium text-sm mb-1">Upload Labelled Files</label>
      <input
        type="file"
        multiple
        accept=".csv,.json,.zip,.txt"
        onChange={handleFileChange}
        className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
      />
      {selectedFiles.length > 0 && (
        <div className="mb-2 max-h-32 overflow-y-auto">
          <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
          {selectedFiles.map((file, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded mb-1">
              <span className="text-sm truncate">{file.name}</span>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-3">
        <button
          onClick={handleUpload}
          disabled={uploading || selectedFiles.length === 0}
          className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          Upload
        </button>
        <button
          onClick={() => setShowUploadLabelledFiles(prev => ({ ...prev, [project.id]: false }))}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-gray-100 rounded-lg font-medium transition-all"
        >
          Cancel
        </button>
      </div>
      {error && <div className="text-red-600 text-sm mt-1">{error}</div>}
    </div>
  );
};

export default UploadLabelledFilesSection;
