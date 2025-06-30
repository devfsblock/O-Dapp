import { useCallback } from 'react';
import useSWR from 'swr';
import { Project } from '@/types/ProjectType';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

export function useProjects(userId?: string) {
  const url = userId ? `/api/upload-projects?submitter=${userId}` : '/api/upload-projects';
  const { data, error, mutate, isLoading } = useSWR<Project[]>(url, fetcher);

  // CRUD helpers
  const createProject = useCallback(async (project: Omit<Project, 'id'>) => {
    const res = await fetch('/api/upload-projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to create project');
    mutate();
    return res.json();
  }, [mutate]);

  const updateProject = useCallback(async (project: Project) => {
    const res = await fetch('/api/upload-projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    if (!res.ok) throw new Error('Failed to update project');
    mutate();
    return res.json();
  }, [mutate]);

  const deleteProject = useCallback(async (id: string) => {
    const res = await fetch('/api/upload-projects', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to delete project');
    mutate();
  }, [mutate]);

  return {
    projects: data,
    isLoading,
    isError: !!error,
    createProject,
    updateProject,
    deleteProject,
    mutate,
  };
}
