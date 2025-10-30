import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { GuesthouseForm } from "@/components/guesthouse-form"

export default async function NewGuesthousePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile || profile.role !== "admin") {
    redirect("/dashboard")
  }

  // Get all managers for assignment
  const { data: managers } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "manager")
    .order("full_name")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Guesthouse</h1>
        <p className="text-muted-foreground">Add a new property to your management system</p>
      </div>
      <GuesthouseForm managers={managers || []} />
    </div>
  )
}
