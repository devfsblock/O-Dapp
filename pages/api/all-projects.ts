// pages/api/all-projects.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase.config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { Project } from '@/types/ProjectType';
const PROJECTS_COLLECTION = 'projects';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
     const querySnapshot = await getDocs(collection(db, PROJECTS_COLLECTION));
       let projects = querySnapshot.docs.map(docSnap => {
         const data = docSnap.data();
         return {
           id: docSnap.id,
           ...data,
         
         }
       });
     
       return res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch all projects' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
