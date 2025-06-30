import { useCallback } from 'react';
import useSWR from 'swr';
import { UserProfile } from '@/types/UserType';
import { useAccount } from 'wagmi';

const fetcher = (url: string) => fetch(url).then(res => {
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
});

export function useUserProfile() {
  const { address } = useAccount();
  const shouldFetch = !!address;
  const { data, error, mutate, isLoading } = useSWR<UserProfile>(
    shouldFetch ? `/api/users?walletAddress=${address}` : null,
    fetcher
  );

  const createUser = useCallback(async (profile: Omit<UserProfile, 'id'>) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to create user');
    mutate();
    return res.json();
  }, [mutate]);

  const updateUser = useCallback(async (profile: Partial<UserProfile>) => {
    const res = await fetch('/api/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (!res.ok) throw new Error('Failed to update user');
    mutate();
    return res.json();
  }, [mutate]);

  return {
    user: data,
    isLoading,
    isError: !!error,
    createUser,
    updateUser,
    mutate,
    address,
  };
}
