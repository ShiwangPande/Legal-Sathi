"use client"

import { UserButton } from "@clerk/nextjs"
import type { User } from "@clerk/nextjs/server"
import { ModeToggle } from "@/components/mode-toggle"
import Link from "next/link"
import { Home } from "lucide-react"

interface AdminHeaderProps {
  user: {
    firstName?: string
    emailAddresses: { emailAddress: string }[]
  }
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Legal Saathi Admin</h1>
            <div className="ml-4 text-gray-600 dark:text-gray-300">
              <span className="text-sm">Welcome, {user.firstName || user.emailAddresses[0].emailAddress}</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/"
              className="flex items-center text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <Home className="h-5 w-5" />
              <span className="ml-1 hidden sm:inline">Home</span>
            </Link>
            <ModeToggle />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </div>
  )
}
