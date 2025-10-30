import type { Guesthouse } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building2, MapPin, User } from "lucide-react"
import Link from "next/link"

interface GuesthouseCardProps {
  guesthouse: Guesthouse & {
    manager?: { id: string; full_name: string | null; email: string } | null
  }
  isAdmin: boolean
}

export function GuesthouseCard({ guesthouse, isAdmin }: GuesthouseCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {guesthouse.name}
            </CardTitle>
            {(guesthouse.city || guesthouse.country) && (
              <CardDescription className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {[guesthouse.city, guesthouse.country].filter(Boolean).join(", ")}
              </CardDescription>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {guesthouse.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{guesthouse.description}</p>
        )}
        {guesthouse.manager && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{guesthouse.manager.full_name || guesthouse.manager.email}</span>
          </div>
        )}
        <div className="flex gap-2">
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href={`/dashboard/guesthouses/${guesthouse.id}`}>View Details</Link>
          </Button>
          {isAdmin && (
            <Button asChild variant="outline">
              <Link href={`/dashboard/guesthouses/${guesthouse.id}/edit`}>Edit</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
