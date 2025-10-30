"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Room } from "@/lib/types"
import { useState } from "react"
import { updateRoomAvailability } from "@/lib/actions/availability"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format, addDays, eachDayOfInterval } from "date-fns"

interface AvailabilityManagerProps {
  rooms: Array<
    Room & {
      guesthouse?: { id: string; name: string; city: string | null }
    }
  >
}

export function AvailabilityManager({ rooms }: AvailabilityManagerProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || "")
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 7))
  const [isAvailable, setIsAvailable] = useState(true)
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!startDate || !endDate || !selectedRoomId) {
      setMessage({ type: "error", text: "Please select a room and date range" })
      return
    }

    if (endDate < startDate) {
      setMessage({ type: "error", text: "End date must be after start date" })
      return
    }

    setIsLoading(true)
    setMessage(null)

    try {
      // Generate all dates in the range
      const dates = eachDayOfInterval({ start: startDate, end: endDate })

      await updateRoomAvailability({
        room_id: selectedRoomId,
        dates: dates.map((d) => format(d, "yyyy-MM-dd")),
        is_available: isAvailable,
        notes: notes || null,
      })

      setMessage({
        type: "success",
        text: `Successfully updated availability for ${dates.length} day(s)`,
      })
      setNotes("")
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to update availability",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Update Availability</CardTitle>
          <CardDescription>Select a room and date range to update availability</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="room">Room</Label>
              <Select value={selectedRoomId} onValueChange={setSelectedRoomId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a room" />
                </SelectTrigger>
                <SelectContent>
                  {rooms.map((room) => (
                    <SelectItem key={room.id} value={room.id}>
                      {room.name}
                      {room.guesthouse && ` • ${room.guesthouse.name}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <div className="relative">
                  <Input
                    id="start-date"
                    type="date"
                    value={startDate ? format(startDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <div className="relative">
                  <Input
                    id="end-date"
                    type="date"
                    value={endDate ? format(endDate, "yyyy-MM-dd") : ""}
                    onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
                  />
                  <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <Label htmlFor="available">Available</Label>
                <p className="text-sm text-muted-foreground">
                  Mark these dates as {isAvailable ? "available" : "unavailable"}
                </p>
              </div>
              <Switch id="available" checked={isAvailable} onCheckedChange={setIsAvailable} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any notes about this availability period..."
                rows={3}
              />
            </div>

            {message && (
              <div
                className={`rounded-lg p-3 text-sm ${
                  message.type === "success"
                    ? "bg-green-50 text-green-900 dark:bg-green-900/20 dark:text-green-100"
                    : "bg-red-50 text-red-900 dark:bg-red-900/20 dark:text-red-100"
                }`}
              >
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Availability
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Selected Room</CardTitle>
          <CardDescription>
            {selectedRoom
              ? `${selectedRoom.name} at ${selectedRoom.guesthouse?.name || "Unknown"}`
              : "No room selected"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedRoom ? (
            <div className="space-y-4">
              {selectedRoom.description && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Capacity</h4>
                  <p className="text-sm text-muted-foreground">{selectedRoom.capacity} guests</p>
                </div>
                {selectedRoom.price_per_night && (
                  <div>
                    <h4 className="text-sm font-medium mb-1">Price</h4>
                    <p className="text-sm text-muted-foreground">${selectedRoom.price_per_night}/night</p>
                  </div>
                )}
              </div>
              <div className="rounded-lg border p-4 bg-muted/50">
                <h4 className="text-sm font-medium mb-2">Quick Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Select a date range to update multiple days at once</li>
                  <li>Toggle availability on/off for the selected period</li>
                  <li>Add notes to remember why dates are blocked</li>
                </ul>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a room to view details</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
