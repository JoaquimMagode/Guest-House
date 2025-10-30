"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Room } from "@/lib/types"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { createRoom, updateRoom } from "@/lib/actions/rooms"

interface RoomFormProps {
  room?: Room & { guesthouse?: { id: string; name: string } }
  guesthouses: Array<{
    id: string
    name: string
    city: string | null
    country: string | null
  }>
}

export function RoomForm({ room, guesthouses }: RoomFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    guesthouse_id: room?.guesthouse_id || guesthouses[0]?.id || "",
    name: room?.name || "",
    description: room?.description || "",
    capacity: room?.capacity?.toString() || "1",
    price_per_night: room?.price_per_night?.toString() || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const data = {
        guesthouse_id: formData.guesthouse_id,
        name: formData.name,
        description: formData.description,
        capacity: Number.parseInt(formData.capacity),
        price_per_night: formData.price_per_night ? Number.parseFloat(formData.price_per_night) : null,
      }

      if (room) {
        await updateRoom(room.id, data)
      } else {
        await createRoom(data)
      }
      router.push("/dashboard/rooms")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Information</CardTitle>
        <CardDescription>Enter the details for the room</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="guesthouse">Guesthouse *</Label>
            <Select
              value={formData.guesthouse_id}
              onValueChange={(value) => setFormData({ ...formData, guesthouse_id: value })}
              disabled={!!room}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a guesthouse" />
              </SelectTrigger>
              <SelectContent>
                {guesthouses.map((guesthouse) => (
                  <SelectItem key={guesthouse.id} value={guesthouse.id}>
                    {guesthouse.name}
                    {guesthouse.city && ` • ${guesthouse.city}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Room Name *</Label>
            <Input
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Deluxe Ocean View"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="A spacious room with ocean views..."
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (guests) *</Label>
              <Input
                id="capacity"
                type="number"
                min="1"
                required
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price per Night ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price_per_night}
                onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                placeholder="150.00"
              />
            </div>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : room ? "Update Room" : "Create Room"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
