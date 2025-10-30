import db from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Calendar, ImageIcon } from "lucide-react"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  const isAdmin = user.role === "admin"

  // Get statistics
  const [guesthousesResult] = await db.execute("SELECT COUNT(*) as count FROM guesthouses")
  const guesthousesCount = (guesthousesResult as any[])[0].count

  const [roomsResult] = await db.execute("SELECT COUNT(*) as count FROM rooms")
  const roomsCount = (roomsResult as any[])[0].count

  const [photosResult] = await db.execute("SELECT COUNT(*) as count FROM photos")
  const photosCount = (photosResult as any[])[0].count

  let usersCount = 0
  if (isAdmin) {
    const [usersResult] = await db.execute("SELECT COUNT(*) as count FROM users")
    usersCount = (usersResult as any[])[0].count
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user.full_name || user.email}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Guesthouses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{guesthousesCount || 0}</div>
            <p className="text-xs text-muted-foreground">Total properties managed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rooms</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roomsCount || 0}</div>
            <p className="text-xs text-muted-foreground">Total rooms available</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Photos</CardTitle>
            <ImageIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{photosCount || 0}</div>
            <p className="text-xs text-muted-foreground">Total photos uploaded</p>
          </CardContent>
        </Card>

        {isAdmin && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount}</div>
              <p className="text-xs text-muted-foreground">Total registered users</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
