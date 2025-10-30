"use server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function createRoom(data: {
  guesthouse_id: string
  name: string
  description: string
  capacity: number
  price_per_night: number | null
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.execute(
    `INSERT INTO rooms (id, guesthouse_id, name, description, capacity, price_per_night) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      data.guesthouse_id,
      data.name,
      data.description || null,
      data.capacity,
      data.price_per_night,
    ]
  )

  revalidatePath("/dashboard/rooms")
  revalidatePath("/dashboard/guesthouses")
}

export async function updateRoom(
  id: string,
  data: {
    guesthouse_id: string
    name: string
    description: string
    capacity: number
    price_per_night: number | null
  },
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.execute(
    `UPDATE rooms 
     SET name = ?, description = ?, capacity = ?, price_per_night = ?
     WHERE id = ?`,
    [
      data.name,
      data.description || null,
      data.capacity,
      data.price_per_night,
      id,
    ]
  )

  revalidatePath("/dashboard/rooms")
  revalidatePath(`/dashboard/rooms/${id}`)
}

export async function deleteRoom(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.execute("DELETE FROM rooms WHERE id = ?", [id])

  revalidatePath("/dashboard/rooms")
}
