import { getRooms, getGuesthouses } from "@/lib/queries"
import { getCurrentUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Bed, Users, DollarSign } from "lucide-react"
import Link from "next/link"

export default async function RoomsPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get all rooms with guesthouse info
  const rooms = await getRooms()

  // Get guesthouses for the "Add Room" dropdown
  const guesthouses = await getGuesthouses()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rooms</h1>
          <p className="text-muted-foreground">Manage rooms across your guesthouses</p>
        </div>
        {guesthouses && guesthouses.length > 0 && (
          <Button asChild>
            <Link href="/dashboard/rooms/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Room
            </Link>
          </Button>
        )}
      </div>

      {!rooms || rooms.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No rooms yet</CardTitle>
            <CardDescription>
              {guesthouses && guesthouses.length > 0
                ? "Get started by adding your first room."
                : "You need to create a guesthouse first before adding rooms."}
            </CardDescription>
          </CardHeader>
          {guesthouses && guesthouses.length > 0 && (
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/rooms/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Room
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {rooms.map((room) => (
            <Card key={room.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="h-5 w-5" />
                  {room.name}
                </CardTitle>
                <CardDescription>
                  {(room as any).guesthouse_name}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {room.description && <p className="text-sm text-muted-foreground line-clamp-2">{room.description}</p>}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{room.capacity} guests</span>
                  </div>
                  {room.price_per_night && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      <span>${room.price_per_night}/night</span>
                    </div>
                  )}
                </div>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href={`/dashboard/rooms/${room.id}/edit`}>Edit Room</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
