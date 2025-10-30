import { redirect } from "next/navigation"
import { AvailabilityManager } from "@/components/availability-manager"
import { getCurrentUser } from "@/lib/auth"
import db from "@/lib/db"

export default async function AvailabilityPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all rooms with guesthouse info
  const [rows] = await db.execute(
    `SELECT r.*, g.id as guesthouse_id, g.name as guesthouse_name, g.city as guesthouse_city
     FROM rooms r
     JOIN guesthouses g ON r.guesthouse_id = g.id
     ORDER BY r.name`
  )
  
  const rooms = (rows as any[]).map(row => ({
    ...row,
    guesthouse: {
      id: row.guesthouse_id,
      name: row.guesthouse_name,
      city: row.guesthouse_city
    }
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Room Availability</h1>
        <p className="text-muted-foreground">Manage room availability across your guesthouses</p>
      </div>

      {!rooms || rooms.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No rooms available. Please add rooms to your guesthouses first.</p>
        </div>
      ) : (
        <AvailabilityManager rooms={rooms} />
      )}
    </div>
  )
}
