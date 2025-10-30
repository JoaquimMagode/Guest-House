import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, User, Edit, ImageIcon, Bed } from "lucide-react"
import Link from "next/link"
import { DeleteGuesthouseButton } from "@/components/delete-guesthouse-button"
import Image from "next/image"

export default async function GuesthouseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

  const { data: guesthouse } = await supabase
    .from("guesthouses")
    .select(
      `
      *,
      manager:profiles!guesthouses_manager_id_fkey(id, full_name, email)
    `,
    )
    .eq("id", id)
    .single()

  if (!guesthouse) {
    notFound()
  }

  const { data: rooms } = await supabase.from("rooms").select("*").eq("guesthouse_id", id).order("name")

  const { data: photos } = await supabase
    .from("photos")
    .select("*")
    .eq("guesthouse_id", id)
    .order("display_order")
    .order("created_at", { ascending: false })
    .limit(6)

  const isAdmin = profile.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{guesthouse.name}</h1>
          <p className="text-muted-foreground">Guesthouse details</p>
        </div>
        {isAdmin && (
          <div className="flex gap-2">
            <Button asChild variant="outline">
              <Link href={`/dashboard/guesthouses/${id}/edit`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <DeleteGuesthouseButton id={id} name={guesthouse.name} />
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Property Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {guesthouse.description && (
            <div>
              <h3 className="text-sm font-medium mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">{guesthouse.description}</p>
            </div>
          )}

          {guesthouse.address && (
            <div>
              <h3 className="text-sm font-medium mb-1">Address</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {guesthouse.address}
              </p>
            </div>
          )}

          {(guesthouse.city || guesthouse.country) && (
            <div>
              <h3 className="text-sm font-medium mb-1">Location</h3>
              <p className="text-sm text-muted-foreground">
                {[guesthouse.city, guesthouse.country].filter(Boolean).join(", ")}
              </p>
            </div>
          )}

          {guesthouse.manager && (
            <div>
              <h3 className="text-sm font-medium mb-1">Manager</h3>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <User className="h-3 w-3" />
                {guesthouse.manager.full_name || guesthouse.manager.email}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bed className="h-5 w-5" />
                Rooms
              </CardTitle>
              <CardDescription>{rooms?.length || 0} rooms available</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/rooms">Manage Rooms</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!rooms || rooms.length === 0 ? (
            <p className="text-sm text-muted-foreground">No rooms added yet.</p>
          ) : (
            <div className="space-y-2">
              {rooms.map((room) => (
                <div key={room.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{room.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Capacity: {room.capacity} guests
                      {room.price_per_night && ` • $${room.price_per_night}/night`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Photo Gallery
              </CardTitle>
              <CardDescription>{photos?.length || 0} photos uploaded</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/photos">Manage Photos</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!photos || photos.length === 0 ? (
            <p className="text-sm text-muted-foreground">No photos added yet.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {photos.map((photo) => (
                <div key={photo.id} className="relative aspect-video overflow-hidden rounded-lg border">
                  <Image
                    src={photo.url || "/placeholder.svg"}
                    alt={photo.caption || "Guesthouse photo"}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
