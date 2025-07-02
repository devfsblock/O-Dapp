"use client"

import { useState, useEffect } from "react"
import ProtectedLayout from "../components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { TextGenerateEffect } from "../components/ui/text-generate-effect"
import { Tabs } from "../components/ui/tabs"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { useAuth } from "../lib/auth-context"
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAccount } from 'wagmi'

export default function Settings() {
  const { walletAddress } = useAuth()
  const { user, updateUser, isLoading, isError } = useUserProfile()
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [picture, setPicture] = useState("")
  const [x, setX] = useState("")
  const [telegram, setTelegram] = useState("")
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveSuccess, setSaveSuccess] = useState(false)

  // Sync user data from backend
  useEffect(() => {
    if (user) {
      setUsername(user.username || "")
      setEmail(user.email || "")
      setPicture(user.picture || "")
      setX(user.socials?.x || "")
      setTelegram(user.socials?.telegram || "")
    }
  }, [user])

  const handleSave = async () => {
    setSaveError(null)
    setSaveSuccess(false)
    setSaveLoading(true)
    try {
      if (!user) throw new Error('User not loaded')
      await updateUser({
        ...user,
        username,
        email,
        picture,
        socials: { x, telegram },
      })
      setSaveSuccess(true)
    } catch (err: any) {
      setSaveError(err.message || 'Failed to update profile')
    } finally {
      setSaveLoading(false)
    }
  }

  const ImagesList = ["profile1.png", "profile2.png", "profile3.png", "profile4.png", "profile5.png"]
  const tabs = [
    {
      title: "Profile",
      value: "profile",
      content: (
        <div className="space-y-6">
          {/* Profile Picture Selection */}
          <div className="space-y-2">
            <label className="block text-gray-700 dark:text-gray-200 mb-1 font-medium">Profile Picture</label>
            <div className="flex gap-3">
              {ImagesList.map(img => (
                <button
                  type="button"
                  key={img}
                  className={`rounded-full border-2 p-1 transition-all ${picture === img ? 'border-blue-500' : 'border-transparent'} focus:outline-none`}
                  onClick={() => setPicture(img)}
                  aria-label={`Select ${img}`}
                >
                  <img
                    src={`/profile/${img}`}
                    alt={img}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          {/* Wallet Address */}
          <div className="space-y-2">
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input id="wallet" value={walletAddress || ""} disabled className="bg-muted/50" />
          </div>
          {/* Socials */}
          <div className="space-y-2">
            <Label htmlFor="x">X</Label>
            <Input id="x" value={x} readOnly disabled className="bg-muted/50" placeholder="@yourhandle" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="telegram">Telegram</Label>
            <Input id="telegram" value={telegram} readOnly disabled className="bg-muted/50" placeholder="@yourtelegram" />
          </div>
          {saveError && <div className="text-red-600 font-medium">{saveError}</div>}
          {saveSuccess && <div className="text-green-600 font-medium">Profile updated!</div>}
          <Button onClick={handleSave} disabled={saveLoading || isLoading}>
            {saveLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      ),
    },
    {
      title: "Notifications",
      value: "notifications",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Email Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketing">Marketing emails</Label>
                  <p className="text-sm text-muted-foreground">Receive emails about new features and updates</p>
                </div>
                <Switch id="marketing" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="social">Social notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive emails for friend requests and follows</p>
                </div>
                <Switch id="social" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="security">Security emails</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive emails about your account activity and security
                  </p>
                </div>
                <Switch id="security" defaultChecked />
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Push Notifications</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-everything">Everything</Label>
                  <p className="text-sm text-muted-foreground">Receive all push notifications</p>
                </div>
                <Switch id="push-everything" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-mentions">Mentions</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications when you're mentioned</p>
                </div>
                <Switch id="push-mentions" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="push-messages">Direct messages</Label>
                  <p className="text-sm text-muted-foreground">Receive push notifications for direct messages</p>
                </div>
                <Switch id="push-messages" defaultChecked />
              </div>
            </div>
          </div>
          <Button>Save Preferences</Button>
        </div>
      ),
    },
    {
      title: "Appearance",
      value: "appearance",
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Theme Preferences</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme-system">System theme</Label>
                  <p className="text-sm text-muted-foreground">Follow system theme preferences</p>
                </div>
                <Switch id="theme-system" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="theme-animations">Animations</Label>
                  <p className="text-sm text-muted-foreground">Enable animations and effects</p>
                </div>
                <Switch id="theme-animations" defaultChecked />
              </div>
            </div>
          </div>
          <Button>Save Preferences</Button>
        </div>
      ),
    },
    // {
    //   title: "Security",
    //   value: "security",
    //   content: (
    //     <div className="space-y-6">
    //       <div className="space-y-4">
    //         <h3 className="text-lg font-medium">Security Settings</h3>
    //         <div className="space-y-4">
    //           <div className="flex items-center justify-between">
    //             <div>
    //               <Label htmlFor="2fa">Two-factor authentication</Label>
    //               <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
    //             </div>
    //             <Switch id="2fa" />
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <div>
    //               <Label htmlFor="activity-log">Activity log</Label>
    //               <p className="text-sm text-muted-foreground">View and manage your account activity</p>
    //             </div>
    //             <Button variant="outline" size="sm">
    //               View
    //             </Button>
    //           </div>
    //           <div className="flex items-center justify-between">
    //             <div>
    //               <Label htmlFor="trusted-devices">Trusted devices</Label>
    //               <p className="text-sm text-muted-foreground">Manage devices that have access to your account</p>
    //             </div>
    //             <Button variant="outline" size="sm">
    //               Manage
    //             </Button>
    //           </div>
    //         </div>
    //       </div>
    //       <Button>Save Settings</Button>
    //     </div>
    //   ),
    // },
  ]

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            <TextGenerateEffect words="Settings" />
          </h1>
          {/* <p className="mt-2 text-muted-foreground">Manage your account settings and preferences</p> */}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
            <CardDescription>Manage your account settings and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="profile" tabs={tabs} />
          </CardContent>
        </Card>
      </div>
    </ProtectedLayout>
  )
}
