import { Button } from "@/components/ui/button"
import { Building2, Calendar, ImageIcon, Shield } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-6xl">Guesthouse Management Platform</h1>
          <p className="text-pretty text-lg text-muted-foreground sm:text-xl">
            Streamline your guesthouse operations with our comprehensive management solution. Manage properties, track
            availability, and organize your photo galleries all in one place.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/auth/login">Login</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-balance text-center text-3xl font-bold tracking-tight sm:text-4xl mb-12">
            Everything you need to manage your guesthouses
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Building2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Multi-Property Management</h3>
              <p className="text-sm text-muted-foreground">Manage multiple guesthouses from a single dashboard</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Room Availability</h3>
              <p className="text-sm text-muted-foreground">
                Track and update room availability with an intuitive calendar
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-primary/10 p-3">
                <ImageIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Photo Galleries</h3>
              <p className="text-sm text-muted-foreground">
                Upload and organize beautiful photo galleries for each property
              </p>
            </div>
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold">Role-Based Access</h3>
              <p className="text-sm text-muted-foreground">Secure access control for admins and property managers</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
