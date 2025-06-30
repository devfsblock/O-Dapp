import useSWR from 'swr';
import React from 'react';

interface UsernameDisplayProps {
  id: string;
}

const UsernameDisplay: React.FC<UsernameDisplayProps> = ({ id }) => {
  const { data, isLoading } = useSWR(
    id ? `/api/usernames?ids=${id}` : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch username');
      const json = await res.json();
      return json.username;
    },
    { dedupingInterval: 3000, revalidateOnFocus: false, suspense: false }
  );

  if (!id) return null;
  if (data && typeof data === 'string') return <>{data}</>;
  if (isLoading) return <span className="italic text-gray-400">Loading...</span>;
  return <span className="italic text-gray-400">{data?.username?.toString() || 'Unavailable'}</span>;
};

export default UsernameDisplay;
