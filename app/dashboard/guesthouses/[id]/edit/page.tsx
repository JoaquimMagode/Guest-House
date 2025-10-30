import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { GuesthouseForm } from "@/components/guesthouse-form"

export default async function EditGuesthousePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
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

  const { data: guesthouse } = await supabase.from("guesthouses").select("*").eq("id", id).single()

  if (!guesthouse) {
    notFound()
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
        <h1 className="text-3xl font-bold tracking-tight">Edit Guesthouse</h1>
        <p className="text-muted-foreground">Update the details for {guesthouse.name}</p>
      </div>
      <GuesthouseForm guesthouse={guesthouse} managers={managers || []} />
    </div>
  )
}
