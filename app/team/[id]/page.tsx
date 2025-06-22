import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { TeamDetails } from "@/components/team-details"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

async function getTeam(id: string, userId?: string) {
  const response = await fetch(`${process.env.NEXTAUTH_URL}/api/teams/${id}`, {
    headers: userId ? { "x-user-id": userId } : {},
  })

  if (!response.ok) {
    return null
  }

  return response.json()
}

export default async function TeamPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  const team = await getTeam(params.id, session?.user?.id)

  if (!team) {
    notFound()
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
        <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
        <p className="text-gray-600 mt-2">Team details and player lineup</p>
      </div>

      <TeamDetails team={team} />
    </div>
  )
}
