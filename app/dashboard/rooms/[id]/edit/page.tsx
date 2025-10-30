import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { RoomForm } from "@/components/room-form"

export default async function EditRoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: room } = await supabase
    .from("rooms")
    .select(
      `
      *,
      guesthouse:guesthouses(id, name)
    `,
    )
    .eq("id", id)
    .single()

  if (!room) {
    notFound()
  }

  // Get all guesthouses for the dropdown
  const { data: guesthouses } = await supabase.from("guesthouses").select("id, name, city, country").order("name")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Room</h1>
        <p className="text-muted-foreground">Update the details for {room.name}</p>
      </div>
      <RoomForm room={room} guesthouses={guesthouses || []} />
    </div>
  )
}
