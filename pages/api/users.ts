import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/lib/firebase.config';
import { collection, getDocs, addDoc, updateDoc, doc, query, where } from 'firebase/firestore';
import { UserProfile } from '@/types/UserType';

const USERS_COLLECTION = 'users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === 'GET') {
      // Get user by walletAddress
      const { walletAddress } = req.query;
      if (!walletAddress || typeof walletAddress !== 'string') {
        return res.status(400).json({ error: 'walletAddress is required' });
      }
      const q = query(collection(db, USERS_COLLECTION), where('walletAddress', '==', walletAddress));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return res.status(404).json({ error: 'User not found' });
      const user = { id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() };
      return res.status(200).json(user);
    }
    if (req.method === 'POST') {
      // Create new user
      const user: Omit<UserProfile, 'id'> = req.body;
      if (!user.walletAddress) return res.status(400).json({ error: 'walletAddress is required' });
      const docRef = await addDoc(collection(db, USERS_COLLECTION), user);
      return res.status(201).json({ id: docRef.id, ...user });
    }
    if (req.method === 'PUT') {
      // Update user
      const { id, ...updateData } = req.body;
      if (!id) return res.status(400).json({ error: 'User id is required' });
      await updateDoc(doc(db, USERS_COLLECTION, id), updateData);
      return res.status(200).json({ id, ...updateData });
    }
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    return res.status(500).json({ error: (error as Error).message });
  }
}
