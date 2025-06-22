"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { TeamBuilder } from "@/components/team-builder"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function TeamBuilderPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
    }
  }, [session, status, router])

  if (status === "loading") {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/my-teams">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to My Teams
          </Link>
        </Button>
        <h1 className="text-3xl font-bold text-gray-900">Team Builder</h1>
        <p className="text-gray-600 mt-2">Create your dream cricket team</p>
      </div>

      <TeamBuilder />
    </div>
  )
}
