"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Languages,
  Info,
  LogOut
} from "lucide-react"
import { useClerk } from "@clerk/nextjs"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
    color: "text-sky-500"
  },
  {
    label: "Rights",
    icon: Users,
    href: "/admin/dashboard/rights",
    color: "text-violet-500"
  },
  {
    label: "Volunteers",
    icon: Users,
    href: "/admin/dashboard/volunteers",
    color: "text-pink-700"
  },
  {
    label: "Languages",
    icon: Languages,
    href: "/admin/dashboard/languages",
    color: "text-orange-700"
  },
  {
    label: "About",
    icon: Info,
    href: "/admin/dashboard/about",
    color: "text-emerald-500"
  }
]

interface AdminDashboardClientProps {
  onClose?: () => void
}

export default function AdminDashboardClient({ onClose }: AdminDashboardClientProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleNavigation = (href: string) => {
    if (onClose) onClose()
  }

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200 bg-gray-50">
        <Link href="/admin/dashboard" className="text-xl font-semibold text-gray-800">
          Admin Panel
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {routes.map((route) => {
          const isActive = pathname === route.href

          return (
            <Link
              key={route.href}
              href={route.href}
              onClick={() => handleNavigation(route.href)}
              className={cn(
                "flex items-center px-4 py-2 rounded-md transition-colors duration-150",
                isActive
                  ? "bg-gray-900 text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              <span className="font-medium">{route.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Sign Out */}
      <div className="border-t border-gray-200 p-4 bg-gray-50">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:text-black"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
