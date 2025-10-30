"use server"

import db from "./db"
import { getCurrentUser } from "./auth"

export async function getGuesthouses() {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  let query = `
    SELECT g.*, u.full_name as manager_name, u.email as manager_email 
    FROM guesthouses g 
    LEFT JOIN users u ON g.manager_id = u.id
  `
  let params: any[] = []

  if (user.role === "manager") {
    query += " WHERE g.manager_id = ?"
    params = [user.id]
  }

  query += " ORDER BY g.created_at DESC"

  const [rows] = await db.execute(query, params)
  return rows
}

export async function getGuesthouse(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const [rows] = await db.execute(
    "SELECT * FROM guesthouses WHERE id = ?",
    [id]
  )
  
  const guesthouses = rows as any[]
  return guesthouses[0] || null
}

export async function getRooms(guesthouseId?: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  let query = `
    SELECT r.*, g.name as guesthouse_name 
    FROM rooms r 
    JOIN guesthouses g ON r.guesthouse_id = g.id
  `
  let params: any[] = []

  if (guesthouseId) {
    query += " WHERE r.guesthouse_id = ?"
    params = [guesthouseId]
  } else if (user.role === "manager") {
    query += " WHERE g.manager_id = ?"
    params = [user.id]
  }

  query += " ORDER BY r.created_at DESC"

  const [rows] = await db.execute(query, params)
  return rows
}

export async function getRoom(id: string) {
  const user = await getCurrentUser()
  if (!user) throw new Error("Unauthorized")

  const [rows] = await db.execute(
    "SELECT * FROM rooms WHERE id = ?",
    [id]
  )
  
  const rooms = rows as any[]
  return rooms[0] || null
}

export async function getManagers() {
  const user = await getCurrentUser()
  if (!user || user.role !== "admin") throw new Error("Unauthorized")

  const [rows] = await db.execute(
    "SELECT id, email, full_name FROM users WHERE role = 'manager' ORDER BY full_name"
  )
  
  return rows
}