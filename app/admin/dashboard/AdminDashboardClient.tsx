"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Languages,
  Settings,
  Info,
  ArrowLeft,
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
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/admin/dashboard/settings",
    color: "text-gray-500"
  }
]

interface AdminDashboardClientProps {
  onClose?: () => void;
}

export default function AdminDashboardClient({ onClose }: AdminDashboardClientProps) {
  const pathname = usePathname()
  const { signOut } = useClerk()

  const handleNavigation = (href: string) => {
    if (onClose) {
      onClose()
    }
  }

  return (
    <div className="flex flex-col h-full bg-background border-r">
      <div className="flex items-center h-16 flex-shrink-0 px-4 border-b">
        <Link href="/admin/dashboard" className="font-bold text-xl">
          Admin
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={() => handleNavigation(route.href)}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md",
              pathname === route.href
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <div className="flex items-center flex-1">
              <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
              {route.label}
            </div>
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  )
} 