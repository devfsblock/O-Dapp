import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase.config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Project } from '@/types/ProjectType';

const PROJECTS_COLLECTION = 'projects';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Fetch all projects or filter by submitter
      const submitter = req.query.submitter as string | undefined;
      const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
      let projects = querySnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          // name: data.name,
          // uploadDate: data.uploadDate,
          // fileType: data.fileType,
          // fileCount: data.fileCount,
          // status: data.status,
          // progress: data.progress,
          // description: data.description,
          // estimatedCompletion: data.estimatedCompletion,
          // submitter: data.submitter,
          // fileIds: data.fileIds,
          // totalSize: data.totalSize,
          // labelers: data.labelers,
          // validators: data.validators,
          // accuracy: data.accuracy,
          // completedTasks: data.completedTasks,
          // totalTasks: data.totalTasks,
          // categories: data.categories,
          // notes: data.notes,
          // lastActivity: data.lastActivity,
          // priority: data.priority,
        } as unknown as Project;
      });
      if (submitter) {
        projects = projects.filter(p => p.submitter === submitter);
      }
      return res.status(200).json(projects);
    }
    if (req.method === 'POST') {
      // Create new project
      const newProject: Omit<Project, 'id'> = req.body;
      const docRef = await addDoc(collection(db, PROJECTS_COLLECTION), newProject);
      return res.status(201).json({ id: docRef.id, ...newProject });
    }
    if (req.method === 'PUT') {
      // Update project
      const { id, ...updateData } = req.body;
      if (!id) return res.status(400).json({ error: 'Project id is required' });
      await updateDoc(doc(db, PROJECTS_COLLECTION, id), updateData);
      return res.status(200).json({ id, ...updateData });
    }
    if (req.method === 'DELETE') {
      // Delete project
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: 'Project id is required' });
      await deleteDoc(doc(db, PROJECTS_COLLECTION, id));
      return res.status(204).end();
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
