import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { PhotoGalleryManager } from "@/components/photo-gallery-manager"

export default async function PhotosPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  // Get all guesthouses
  const { data: guesthouses } = await supabase.from("guesthouses").select("id, name, city").order("name")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Photo Gallery</h1>
        <p className="text-muted-foreground">Manage photos for your guesthouses</p>
      </div>

      {!guesthouses || guesthouses.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-muted-foreground">No guesthouses available. Please add a guesthouse first.</p>
        </div>
      ) : (
        <PhotoGalleryManager guesthouses={guesthouses} />
      )}
    </div>
  )
}
