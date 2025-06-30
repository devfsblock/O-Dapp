"use client"

import { useState } from 'react'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'
import { useUserProfile } from '@/hooks/useUserProfile'
import { UserProfile, UserType } from '@/types/UserType'

export default function SignupPage() {
  const router = useRouter()
  const { address } = useAccount()
  const { user, createUser, isLoading } = useUserProfile()
  const [form, setForm] = useState<Omit<UserProfile, 'id'>>({
    username: '',
    walletAddress: address || '',
    email: '',
    userType: 'labeler',
    socials: { x: '', telegram: '' },
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [socialErrors, setSocialErrors] = useState<{ x?: string; telegram?: string }>({})

  const validateSocials = (x: string, telegram: string) => {
    let errors: { x?: string; telegram?: string } = {};
    // X: only allow alphanumeric and underscores, 4-15 chars
    if (!x || !/^([A-Za-z0-9_]{4,15})$/.test(x)) {
      errors.x = 'Enter a valid X (Twitter) username (4-15 chars, letters, numbers, underscores)';
    }
    // Telegram: only allow alphanumeric and underscores, 5-32 chars
    if (!telegram || !/^([A-Za-z0-9_]{5,32})$/.test(telegram)) {
      errors.telegram = 'Enter a valid Telegram username (5-32 chars, letters, numbers, underscores)';
    }
    return errors;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    if (name === 'x' || name === 'telegram') {
      setForm(prev => ({
        ...prev,
        socials: { ...prev.socials, [name]: value }
      }))
      setSocialErrors(prev => ({ ...prev, [name]: undefined }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setSocialErrors({})
    const { x, telegram } = form.socials
    const socialErrs = validateSocials(x, telegram)
    if (Object.keys(socialErrs).length > 0) {
      setSocialErrors(socialErrs)
      setLoading(false)
      return
    }
    try {
      if (!form.username || !form.walletAddress || !form.email || !x || !telegram) {
        setError('All fields are required')
        setLoading(false)
        return
      }
      await createUser(form)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 w-full max-w-md border border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-gray-100">Complete Your Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Username</label>
            <input name="username" value={form.username} onChange={handleChange} className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Wallet Address</label>
            <input name="walletAddress" value={form.walletAddress} readOnly className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-700 text-gray-500" />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" required />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">User Type</label>
            <select name="userType" value={form.userType} onChange={handleChange} className="w-full p-2 border rounded bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors">
              <option value="submitter">Submitter</option>
              <option value="labeler">Labeler</option>
              <option value="validator">Validator</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">X (Twitter)</label>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-2 rounded-l border border-r-0 border-gray-300 dark:border-gray-700 select-none">https://twitter.com/</span>
              <input
                name="x"
                value={form.socials?.x || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-r bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="username"
                required
              />
            </div>
            {socialErrors.x && <div className="text-red-600 text-sm mt-1">{socialErrors.x}</div>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Telegram</label>
            <div className="flex items-center">
              <span className="text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-2 rounded-l border border-r-0 border-gray-300 dark:border-gray-700 select-none">https://t.me/</span>
              <input
                name="telegram"
                value={form.socials?.telegram || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-r bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="username"
                required
              />
            </div>
            {socialErrors.telegram && <div className="text-red-600 text-sm mt-1">{socialErrors.telegram}</div>}
          </div>
          {error && <div className="text-red-600 font-medium">{error}</div>}
          <button type="submit" className="w-full px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-all" disabled={loading}>
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
