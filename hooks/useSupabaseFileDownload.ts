import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const BUCKET = 'oadapp'; // Change as needed

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export async function downloadSupabaseFiles(fileIds: string[]): Promise<{ name: string; url: string }[]> {
  // fileIds are the file paths in the bucket
  const files: { name: string; url: string }[] = [];
  for (const fileId of fileIds) {
    const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(fileId, 60 * 10); // 10 min
    if (error) continue;
    files.push({ name: fileId.split('/').pop() || fileId, url: data.signedUrl });
  }
  return files;
}

// Utility to open file in new tab
export function openFileInNewTab(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}
