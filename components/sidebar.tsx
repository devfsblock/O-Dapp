"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Settings,
  ChevronLeft,
  ShoppingBag,
  HelpCircle,
  Award,
  Tag,
  CheckSquare,
  Bell,
  LogOut,
  Upload,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "@/lib/auth-context"
import { useUserProfile } from '@/hooks/useUserProfile'
import { useAccount, useDisconnect } from 'wagmi'
import Image from "next/image"

type SidebarItem = {
  title: string
  icon: React.ElementType
  href: string
  comingSoon?: boolean
}

const sidebarItems: SidebarItem[] = [
  {
    title: "My Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    // title: "Upload Projects",
    title: "Data Ingestion",
    icon: Upload,
    href: "/upload-projects",
  },
  {
    title: "OanicAI Academy",
    icon: GraduationCap,
    href: "/academy",
  },
  {
    title: "Earnings & Rewards",
    icon: Award,
    href: "/rewards",
  },
  {
    title: "Labeling Workspace",
    icon: Tag,
    href: "/label",
  },
  {
    title: "Validation Center",
    icon: CheckSquare,
    href: "/validate",
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    href: "/marketplace",
    comingSoon: true,
  },
  {
    title: "Alerts",
    icon: Bell,
    href: "/alerts",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    title: "Help",
    icon: HelpCircle,
    href: "/help",
  },
]

export function Sidebar() {
  const [expanded, setExpanded] = useState(true)
  const [showUserPopup, setShowUserPopup] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)
  const [logoutError, setLogoutError] = useState<string | null>(null)
  const router = useRouter()
  const { walletAddress } = useAuth()
  const { user } = useUserProfile()
  const { disconnect } = useDisconnect()

  const shortAddress = walletAddress
    ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
    : "Not Connected"

  const displayName = user?.username || "User"
  const truncatedName = displayName.length > 16 ? displayName.slice(0, 13) + '...' : displayName

  // Filter sidebar items based on userType
  const filteredSidebarItems = sidebarItems.filter((item) => {
    if (user?.userType === 'labeler') {
      return item.title !== 'Data Ingestion' && item.title !== 'Validation Center';
    }
    if (user?.userType === 'validator') {
      return item.title !== 'Data Ingestion' && item.title !== 'Labeling Workspace';
    }
    if (user?.userType === 'submitter') {
      return item.title !== 'Labeling Workspace' && item.title !== 'Validation Center';
    }
    return true;
  });

  return (
    <div className="h-screen">
      <motion.div
        initial={{ width: expanded ? "16rem" : "4rem" }}
        animate={{ width: expanded ? "16rem" : "4rem" }}
        transition={{ duration: 0.2, type: "spring", damping: 10 }}
        className={cn(
          "relative h-full bg-white dark:bg-gray-950 border-r border-border p-3 flex flex-col",
          expanded ? "px-4" : "px-2",
        )}
      >
        <div className="flex items-center mb-6 mt-2">
          {expanded ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xl font-bold"
            >
              {/* Logo for expanded sidebar */}
              <span className="relative w-40 h-10 flex items-center rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1">
                <Image
                  src={require("./OanicAi-01.png")}
                  alt="OanicAI Logo"
                  fill
                  className="object-contain select-none"
                  priority
                />
              </span>
            </motion.span>
          ) : (
            // Logo for collapsed sidebar
            <span className="relative w-8 h-8 flex items-center rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1">
              <Image
                src={require("./square.jpg")}
                alt="OanicAI Square Logo"
                fill
                className="object-contain select-none"
                priority
              />
            </span>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            className={cn(
              "p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 absolute right-2",
              expanded ? "right-2" : "right-0 left-0 mx-auto",
            )}
          >
            <ChevronLeft className={cn("h-5 w-5 transition-all", !expanded && "rotate-180")} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {filteredSidebarItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center py-2 px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
                    router.pathname === item.href && "bg-gray-100 dark:bg-gray-800 text-primary",
                    !expanded && "justify-center",
                  )}
                >
                  <item.icon className="h-5 w-5 mr-2" />
                  {expanded && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex items-center justify-between"
                    >
                      <span
                        className="block whitespace-nowrap overflow-hidden text-ellipsis max-w-[10.5rem]"
                        style={{ minWidth: 0 }}
                      >
                        {item.title}
                      </span>
                    </motion.div>
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto relative">
          <button
            onClick={() => setShowUserPopup(!showUserPopup)}
            className={cn(
              "w-full flex items-center p-3 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700",
              !expanded && "justify-center",
            )}
          >
            {user?.picture ? (
              <Image
                src={`/profile/${user.picture}`}
                alt="Profile"
                width={32}
                height={32}
                className="h-8 w-8 rounded-full object-cover bg-primary"
                priority
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white">
                {walletAddress ? walletAddress.substring(2, 3).toUpperCase() : "?"}
              </div>
            )}
            {expanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="ml-3 text-left max-w-[8rem] truncate"
              >
                <p className="text-sm font-medium truncate">{truncatedName}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-mono">{shortAddress}</p>
              </motion.div>
            )}
          </button>

          {showUserPopup && (
            <div className="absolute bottom-16 left-0 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-border p-4 z-10">
              <div className="flex items-center mb-4">
                {user?.picture ? (
                  <Image
                    src={`/profile/${user.picture}`}
                    alt="Profile"
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover bg-primary mr-3"
                    priority
                  />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-white mr-3">
                    {walletAddress ? walletAddress.substring(2, 3).toUpperCase() : "?"}
                  </div>
                )}
                <div className="max-w-[8rem] truncate">
                  <p className="font-medium truncate">{truncatedName}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-mono">{shortAddress}</p>
                </div>
              </div>
              <div className="space-y-2">
                <button onClick={()=>router.push('/settings')} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                  Profile
                </button>
                <div className="border-t border-border my-2 pt-2">
                  <button
                    onClick={async () => {
                      try {
                        await disconnect();
                        setShowUserPopup(false);
                        router.push('/login');
                      } catch (err) {
                        // Optionally, show a toast or alert
                        alert('Failed to disconnect wallet. Please try again.');
                      }
                    }}
                    className="w-full text-left px-3 py-2 rounded-md text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Disconnect Wallet
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}
