"use server"

import db from "@/lib/db"
import { getCurrentUser } from "@/lib/auth"
import { put, del } from "@vercel/blob"
import { revalidatePath } from "next/cache"
import { v4 as uuidv4 } from "uuid"

export async function uploadPhoto(data: { guesthouse_id: string; file: File }) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Verify user has access to this guesthouse
  const [rows] = await db.execute(
    "SELECT id FROM guesthouses WHERE id = ?",
    [data.guesthouse_id]
  )
  
  const guesthouses = rows as any[]
  if (!guesthouses[0]) {
    throw new Error("Guesthouse not found")
  }

  // Upload to Vercel Blob
  const blob = await put(`guesthouse-${data.guesthouse_id}/${Date.now()}-${data.file.name}`, data.file, {
    access: "public",
  })

  try {
    // Save photo record to database
    await db.execute(
      `INSERT INTO photos (id, guesthouse_id, url, caption, display_order) 
       VALUES (?, ?, ?, ?, ?)`,
      [uuidv4(), data.guesthouse_id, blob.url, null, 0]
    )
  } catch (error) {
    // Clean up blob if database insert fails
    await del(blob.url)
    throw error
  }

  revalidatePath("/dashboard/photos")
}

export async function getGuesthousePhotos(guesthouseId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const [rows] = await db.execute(
    `SELECT * FROM photos 
     WHERE guesthouse_id = ?
     ORDER BY display_order, created_at DESC`,
    [guesthouseId]
  )

  return rows
}

export async function deletePhoto(photoId: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  // Get photo to delete from blob
  const [rows] = await db.execute(
    "SELECT url FROM photos WHERE id = ?",
    [photoId]
  )
  
  const photos = rows as any[]
  const photo = photos[0]
  
  if (!photo) {
    throw new Error("Photo not found")
  }

  // Delete from database
  await db.execute("DELETE FROM photos WHERE id = ?", [photoId])

  // Delete from blob storage
  try {
    await del(photo.url)
  } catch (error) {
    console.error("Failed to delete blob:", error)
    // Continue even if blob deletion fails
  }

  revalidatePath("/dashboard/photos")
}

export async function updatePhotoCaption(photoId: string, caption: string) {
  const user = await getCurrentUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  await db.execute(
    "UPDATE photos SET caption = ? WHERE id = ?",
    [caption || null, photoId]
  )

  revalidatePath("/dashboard/photos")
}
