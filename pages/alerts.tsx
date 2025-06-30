"use client"

import { motion } from "framer-motion"
import ProtectedLayout from "../components/protected-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { TextGenerateEffect } from "../components/ui/text-generate-effect"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import { useEffect, useState } from "react"
import { useUserProfile } from "../hooks/useUserProfile"

export default function Alerts() {
  const alertTypes = [
    {
      id: "price-alerts",
      title: "Price Alerts",
      description: "Get notified when prices change significantly",
    },
    {
      id: "new-features",
      title: "New Features",
      description: "Stay updated with new platform features",
    },
    {
      id: "security-alerts",
      title: "Security Alerts",
      description: "Important security notifications",
    },
    {
      id: "reward-alerts",
      title: "Reward Alerts",
      description: "Get notified about new rewards",
    },
  ]

  const recentAlerts = [
    {
      id: 1,
      title: "Welcome to OanicAI",
      description: "Thank you for joining OanicAI platform",
      date: "2023-04-15",
      read: true,
    },
    {
      id: 2,
      title: "New Feature: Academy",
      description: "We've launched our educational platform",
      date: "2023-04-10",
      read: false,
    },
    {
      id: 3,
      title: "Security Update",
      description: "Important security enhancements have been implemented",
      date: "2023-04-05",
      read: true,
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  }

  const { user, mutate, updateUser } = useUserProfile();
  const [preferences, setPreferences] = useState({
    price: false,
    features: false,
    security: false,
    email: false,
    reward: false,
  });
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (user) {
      setPreferences({
        price: user.preferences?.price ?? false,
        features: user.preferences?.features ?? false,
        security: user.preferences?.security ?? false,
        email: user.preferences?.email ?? false,
        reward: user.preferences?.reward ?? false,
      });
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSwitch = (key: keyof typeof preferences) => async (checked: boolean) => {
    const newPrefs = { ...preferences, [key]: checked };
    setPreferences(newPrefs);
    setSaving(true);
    await updateUser({ ...user, preferences: newPrefs });
    setSaving(false);
    mutate && mutate();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleEmailSave = async () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setSaving(true);
    await updateUser({ ...user, email });
    setSaving(false);
    mutate && mutate();
  };

  return (
    <ProtectedLayout>
      <div className="space-y-8">
        <div>
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            <TextGenerateEffect words="Alerts" />
          </h1>
          <p className="mt-2 text-muted-foreground">Manage your notification preferences and view recent alerts</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Preferences</CardTitle>
                <CardDescription>Choose which notifications you want to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                  {alertTypes.map((alert) => (
                    <motion.div key={alert.id} variants={item} className="flex items-center justify-between space-x-2">
                      <div className="space-y-0.5">
                        <Label htmlFor={alert.id}>{alert.title}</Label>
                        <p className="text-xs text-muted-foreground">{alert.description}</p>
                      </div>
                      <Switch
                        id={alert.id}
                        checked={
                          alert.id === "price-alerts" ? preferences.price :
                          alert.id === "new-features" ? preferences.features :
                          alert.id === "security-alerts" ? preferences.security :
                          alert.id === "reward-alerts" ? preferences.reward : false
                        }
                        onCheckedChange={checked => {
                          if (alert.id === "price-alerts") handleSwitch("price")(checked);
                          if (alert.id === "new-features") handleSwitch("features")(checked);
                          if (alert.id === "security-alerts") handleSwitch("security")(checked);
                          if (alert.id === "reward-alerts") handleSwitch("reward")(checked);
                        }}
                        disabled={saving}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Receive alerts via email</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="email"
                      placeholder="Enter your email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      disabled={saving}
                    />
                    <Button onClick={handleEmailSave} disabled={saving || !email}>
                      Save
                    </Button>
                  </div>
                  {emailError && <div className="text-red-600 text-xs mt-1">{emailError}</div>}
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="email-notifications"
                    checked={preferences.email}
                    onCheckedChange={handleSwitch("email")}
                    disabled={saving}
                  />
                  <Label htmlFor="email-notifications">Enable email notifications</Label>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Recent Alerts</CardTitle>
                <CardDescription>Your latest notifications</CardDescription>
              </CardHeader>
              <CardContent>
                <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <motion.div
                      key={alert.id}
                      variants={item}
                      className={`rounded-lg border p-4 ${!alert.read ? "border-primary/50 bg-primary/5" : ""}`}
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <h3 className="font-medium">{alert.title}</h3>
                        <span className="text-xs text-muted-foreground">{alert.date}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.description}</p>
                      {!alert.read && (
                        <div className="mt-2 text-right">
                          <Button variant="ghost" size="sm">
                            Mark as read
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  )
}
