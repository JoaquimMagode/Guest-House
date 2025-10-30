"use client"

import { Button } from "@/components/ui/button"
import type { Profile } from "@/lib/types"
import { Building2, Calendar, ImageIcon, LayoutDashboard, LogOut, Users, Bed } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface DashboardNavProps {
  profile: Profile
}

export function DashboardNav({ profile }: DashboardNavProps) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const isAdmin = profile.role === "admin"

  const navItems = [
    {
      href: "/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      show: true,
    },
    {
      href: "/dashboard/guesthouses",
      label: "Guesthouses",
      icon: Building2,
      show: true,
    },
    {
      href: "/dashboard/rooms",
      label: "Rooms",
      icon: Bed,
      show: true,
    },
    {
      href: "/dashboard/users",
      label: "Users",
      icon: Users,
      show: isAdmin,
    },
    {
      href: "/dashboard/availability",
      label: "Availability",
      icon: Calendar,
      show: true,
    },
    {
      href: "/dashboard/photos",
      label: "Photos",
      icon: ImageIcon,
      show: true,
    },
  ]

  return (
    <aside className="w-64 border-r bg-muted/40">
      <div className="flex h-full flex-col">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold">Guesthouse Manager</h2>
          <p className="text-sm text-muted-foreground">{profile.email}</p>
          <p className="text-xs text-muted-foreground capitalize mt-1">{profile.role}</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {navItems
            .filter((item) => item.show)
            .map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link key={item.href} href={item.href}>
                  <Button variant={isActive ? "secondary" : "ghost"} className="w-full justify-start">
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              )
            })}
        </nav>
        <div className="border-t p-4">
          <Button variant="ghost" className="w-full justify-start" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}
