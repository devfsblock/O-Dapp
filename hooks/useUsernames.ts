import useSWR from 'swr';

export function useUsernames(userIds: string[]) {
  // Only fetch if there are userIds
  const shouldFetch = userIds.length > 0;
  const { data, error, isLoading } = useSWR(
    shouldFetch ? `/api/usernames?ids=${userIds.join(',')}` : null,
    async (url: string) => {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to fetch usernames');
      return res.json(); // { [id]: username }
    }
  );
  return { usernames: data || {}, isLoading, isError: !!error };
}
