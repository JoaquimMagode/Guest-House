import { getGuesthouses } from "@/lib/queries"
import { getCurrentUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"
import Link from "next/link"
import { redirect } from "next/navigation"
import { GuesthouseCard } from "@/components/guesthouse-card"

export default async function GuesthousesPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Fetch guesthouses
  const guesthouses = await getGuesthouses()

  const isAdmin = user.role === "admin"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Guesthouses</h1>
          <p className="text-muted-foreground">Manage your guesthouse properties</p>
        </div>
        {isAdmin && (
          <Button asChild>
            <Link href="/dashboard/guesthouses/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Guesthouse
            </Link>
          </Button>
        )}
      </div>

      {!guesthouses || guesthouses.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No guesthouses yet</CardTitle>
            <CardDescription>
              {isAdmin
                ? "Get started by creating your first guesthouse."
                : "No guesthouses have been assigned to you yet."}
            </CardDescription>
          </CardHeader>
          {isAdmin && (
            <CardContent>
              <Button asChild>
                <Link href="/dashboard/guesthouses/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Guesthouse
                </Link>
              </Button>
            </CardContent>
          )}
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {guesthouses.map((guesthouse) => (
            <GuesthouseCard key={guesthouse.id} guesthouse={guesthouse} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  )
}
