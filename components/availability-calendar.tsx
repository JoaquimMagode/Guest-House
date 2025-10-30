"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { Room, RoomAvailability } from "@/lib/types"
import { useState, useEffect } from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from "date-fns"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getRoomAvailability } from "@/lib/actions/availability"

interface AvailabilityCalendarProps {
  rooms: Array<Room & { guesthouse?: { id: string; name: string } }>
}

export function AvailabilityCalendar({ rooms }: AvailabilityCalendarProps) {
  const [selectedRoomId, setSelectedRoomId] = useState<string>(rooms[0]?.id || "")
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [availability, setAvailability] = useState<RoomAvailability[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const selectedRoom = rooms.find((r) => r.id === selectedRoomId)

  useEffect(() => {
    if (selectedRoomId) {
      loadAvailability()
    }
  }, [selectedRoomId, currentMonth])

  const loadAvailability = async () => {
    setIsLoading(true)
    try {
      const start = format(startOfMonth(currentMonth), "yyyy-MM-dd")
      const end = format(endOfMonth(currentMonth), "yyyy-MM-dd")
      const data = await getRoomAvailability(selectedRoomId, start, end)
      setAvailability(data)
    } catch (error) {
      console.error("Failed to load availability:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getAvailabilityForDate = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd")
    return availability.find((a) => a.date === dateStr)
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Room Selection</CardTitle>
              <CardDescription>Choose a room to view its availability</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            {selectedRoom ? `Viewing availability for ${selectedRoom.name}` : "Select a room"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Loading availability...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              <div className="grid grid-cols-7 gap-2">
                {daysInMonth.map((day) => {
                  const avail = getAvailabilityForDate(day)
                  const isAvailable = avail?.is_available ?? true
                  const hasNotes = avail?.notes

                  return (
                    <div
                      key={day.toISOString()}
                      className={`
                        relative aspect-square rounded-lg border p-2 text-center text-sm
                        ${!isSameMonth(day, currentMonth) ? "text-muted-foreground" : ""}
                        ${isToday(day) ? "border-primary font-semibold" : ""}
                        ${isAvailable ? "bg-green-50 dark:bg-green-900/20" : "bg-red-50 dark:bg-red-900/20"}
                      `}
                      title={hasNotes ? avail.notes || undefined : undefined}
                    >
                      <div>{format(day, "d")}</div>
                      {hasNotes && (
                        <div className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />
                      )}
                    </div>
                  )
                })}
              </div>
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-green-50 dark:bg-green-900/20 border" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-red-50 dark:bg-red-900/20 border" />
                  <span>Unavailable</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-1 w-1 rounded-full bg-primary" />
                  <span>Has notes</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
