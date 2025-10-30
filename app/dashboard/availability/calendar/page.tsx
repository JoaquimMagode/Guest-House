import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AvailabilityCalendar } from "@/components/availability-calendar"

export default async function AvailabilityCalendarPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all rooms with guesthouse info
  const { data: rooms } = await supabase
    .from("rooms")
    .select(
      `
      *,
      guesthouse:guesthouses(id, name)
    `,
    )
    .order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Availability Calendar</h1>
        <p className="text-muted-foreground">View room availability in calendar format</p>
      </div>

      {!rooms || rooms.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No rooms available. Please add rooms to your guesthouses first.</p>
        </div>
      ) : (
        <AvailabilityCalendar rooms={rooms} />
      )}
    </div>
  )
}
