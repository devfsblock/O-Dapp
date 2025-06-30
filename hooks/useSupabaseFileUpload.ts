import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// You should set your Supabase URL and public anon key in environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const BUCKET = 'oadapp'; // Change as needed

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export function useSupabaseFileUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    setFileId(null);
    try {
      const safeFileName = file.name.replace(/[^a-zA-Z0-9.]/g, '');
      const filePath = `${Date.now()}_${safeFileName}`;
      const { data, error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, file, { upsert: false });
      if (uploadError) throw uploadError;
      setFileId(data?.path || filePath);
      return data?.path || filePath;
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
      throw err;
    } finally {
      setUploading(false);
    }
  };

  return { uploadFile, uploading, error, fileId };
}

