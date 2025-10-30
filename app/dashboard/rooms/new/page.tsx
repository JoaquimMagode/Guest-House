import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { RoomForm } from "@/components/room-form"

export default async function NewRoomPage() {
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

  // Get guesthouses the user can manage
  const { data: guesthouses } = await supabase.from("guesthouses").select("id, name, city, country").order("name")

  if (!guesthouses || guesthouses.length === 0) {
    redirect("/dashboard/guesthouses")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add New Room</h1>
        <p className="text-muted-foreground">Create a new room for one of your guesthouses</p>
      </div>
      <RoomForm guesthouses={guesthouses} />
    </div>
  )
}
