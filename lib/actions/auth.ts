"use server"

import db from "@/lib/db"
import { hashPassword, verifyPassword, generateToken, setAuthCookie, clearAuthCookie } from "@/lib/auth"
import { redirect } from "next/navigation"
import { v4 as uuidv4 } from "uuid"

export async function signUp(data: {
  email: string
  password: string
  fullName: string
  role: 'admin' | 'manager'
}) {
  // Check if user already exists
  const [existingUsers] = await db.execute(
    "SELECT id FROM users WHERE email = ?",
    [data.email]
  )
  
  const existingUserList = existingUsers as any[]
  if (existingUserList.length > 0) {
    throw new Error("User already exists")
  }

  // Hash password and create user
  const passwordHash = await hashPassword(data.password)
  const userId = uuidv4()
  
  await db.execute(
    `INSERT INTO users (id, email, password_hash, full_name, role) 
     VALUES (?, ?, ?, ?, ?)`,
    [userId, data.email, passwordHash, data.fullName, data.role]
  )

  // Generate token and set cookie
  const token = generateToken(userId)
  await setAuthCookie(token)

  redirect("/dashboard")
}

export async function signIn(data: {
  email: string
  password: string
}) {
  // Find user by email
  const [rows] = await db.execute(
    "SELECT id, password_hash FROM users WHERE email = ?",
    [data.email]
  )
  
  const users = rows as any[]
  const user = users[0]
  
  if (!user) {
    throw new Error("Invalid credentials")
  }

  // Verify password
  const isValid = await verifyPassword(data.password, user.password_hash)
  if (!isValid) {
    throw new Error("Invalid credentials")
  }

  // Generate token and set cookie
  const token = generateToken(user.id)
  await setAuthCookie(token)

  redirect("/dashboard")
}

export async function signOut() {
  await clearAuthCookie()
  redirect("/")
}