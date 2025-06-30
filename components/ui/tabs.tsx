"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface Tab {
  title: string
  value: string
  icon?: React.ReactNode
  content: React.ReactNode
}

interface TabsProps {
  defaultValue: string
  tabs: Tab[]
  className?: string
}

export function Tabs({ defaultValue, tabs, className }: TabsProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue)

  return (
    <div className={cn("space-y-4", className)}>
      <div className="relative flex w-full overflow-auto">
        <div className="flex border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "relative h-10 px-4 text-sm font-medium transition-colors flex items-center",
                activeTab === tab.value ? "text-foreground" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.icon}
              {tab.title}
              {activeTab === tab.value && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-2">
        {tabs.map((tab) => (
          <div key={tab.value} className={cn(activeTab === tab.value ? "block" : "hidden")}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

// These are additional tab components that can be used for more customization
const TabsList = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md p-1 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => (
    <button
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      ref={ref}
      {...props}
    />
  ),
)
TabsContent.displayName = "TabsContent"

export { TabsList, TabsTrigger, TabsContent }
