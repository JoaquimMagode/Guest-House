export type UserRole = "admin" | "manager"

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
}

export interface Guesthouse {
  id: string
  name: string
  description: string | null
  address: string | null
  city: string | null
  country: string | null
  manager_id: string | null
  created_at: string
  updated_at: string
}

export interface Room {
  id: string
  guesthouse_id: string
  name: string
  description: string | null
  capacity: number
  price_per_night: number | null
  created_at: string
}

export interface RoomAvailability {
  id: string
  room_id: string
  date: string
  is_available: boolean
  notes: string | null
  created_at: string
}

export interface Photo {
  id: string
  guesthouse_id: string
  url: string
  caption: string | null
  display_order: number
  created_at: string
}
