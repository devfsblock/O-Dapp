import type { NextApiRequest, NextApiResponse } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase.config';


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const idsParam = req.query.ids;
    let id = '';
    if (typeof idsParam === 'string') {
        id = idsParam.trim();
    } else if (Array.isArray(idsParam) && idsParam.length > 0) {
        id = idsParam[0].trim();
    }

    if (!id) {
        return res.status(400).json({ error: 'No id provided' });
    }

    try {
        const userRef = doc(db, 'users', id);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
            const data = userSnap.data();
            if (data && data.username) {
                return res.status(200).json({ username: data.username });
            }
        }
        return res.status(404).json({ error: 'User not found' });
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch username' });
    }
}
