import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AvailabilityManager } from "@/components/availability-manager"

export default async function AvailabilityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Get all rooms with guesthouse info
  const { data: rooms } = await supabase
    .from("rooms")
    .select(
      `
      *,
      guesthouse:guesthouses(id, name, city)
    `,
    )
    .order("name")

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
