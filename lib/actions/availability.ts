"use server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function updateRoomAvailability(data: {
  room_id: string
  dates: string[]
  is_available: boolean
  notes: string | null
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Verify user has access to this room
  const [rows] = await db.execute(
    "SELECT id, guesthouse_id FROM rooms WHERE id = ?",
    [data.room_id]
  )
  
  const rooms = rows as any[]
  if (!rooms[0]) {
    throw new Error("Room not found")
  }

  // Create or update availability records for each date
  for (const date of data.dates) {
    await db.execute(
      `INSERT INTO room_availability (id, room_id, date, is_available, notes) 
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
       is_available = VALUES(is_available), 
       notes = VALUES(notes)`,
      [uuidv4(), data.room_id, date, data.is_available, data.notes]
    )
  }

  revalidatePath("/dashboard/availability")
}

export async function getRoomAvailability(roomId: string, startDate: string, endDate: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const [rows] = await db.execute(
    `SELECT * FROM room_availability 
     WHERE room_id = ? AND date >= ? AND date <= ?
     ORDER BY date`,
    [roomId, startDate, endDate]
  )

  return rows
}
