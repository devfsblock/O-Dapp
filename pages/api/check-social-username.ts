import type { NextApiRequest, NextApiResponse } from 'next';

async function checkUrlExists(url: string) {
  try {
    const res = await fetch(url, { method: 'HEAD' });
    return res.status === 200;
  } catch {
    return false;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { platform, username } = req.query;
  if (!platform || !username) {
    return res.status(400).json({ valid: false, error: 'Missing platform or username' });
  }
  let url = '';
  if (platform === 'x') {
    url = `https://twitter.com/${username}`;
  } else if (platform === 'telegram') {
    url = `https://t.me/${username}`;
  } else {
    return res.status(400).json({ valid: false, error: 'Invalid platform' });
  }
  const valid = await checkUrlExists(url);
  res.status(200).json({ valid });
}
