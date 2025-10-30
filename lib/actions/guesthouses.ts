"use server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function createGuesthouse(data: {
  name: string
  description: string
  address: string
  city: string
  country: string
  manager_id: string
}) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  if (user.role !== "admin") {
    throw new Error("Only admins can create guesthouses")
  }

  await db.execute(
    `INSERT INTO guesthouses (id, name, description, address, city, country, manager_id) 
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      uuidv4(),
      data.name,
      data.description || null,
      data.address || null,
      data.city || null,
      data.country || null,
      data.manager_id || null,
    ]
  )

  revalidatePath("/dashboard/guesthouses")
}

export async function updateGuesthouse(
  id: string,
  data: {
    name: string
    description: string
    address: string
    city: string
    country: string
    manager_id: string
  },
) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.execute(
    `UPDATE guesthouses 
     SET name = ?, description = ?, address = ?, city = ?, country = ?, manager_id = ?, updated_at = CURRENT_TIMESTAMP
     WHERE id = ?`,
    [
      data.name,
      data.description || null,
      data.address || null,
      data.city || null,
      data.country || null,
      data.manager_id || null,
      id,
    ]
  )

  revalidatePath("/dashboard/guesthouses")
  revalidatePath(`/dashboard/guesthouses/${id}`)
}

export async function deleteGuesthouse(id: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  if (user.role !== "admin") {
    throw new Error("Only admins can delete guesthouses")
  }

  await db.execute("DELETE FROM guesthouses WHERE id = ?", [id])

  revalidatePath("/dashboard/guesthouses")
}
