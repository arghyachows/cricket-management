"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { TeamCard } from "@/components/team-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

interface Team {
  id: number
  name: string
  created_at: string
  player_count: number
}

export default function MyTeamsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === "loading") return
    if (!session) {
      router.push("/login")
      return
    }
    fetchTeams()
  }, [session, status, router])

  const fetchTeams = async () => {
    try {
      const response = await fetch("/api/my-teams")
      const data = await response.json()
      setTeams(data)
    } catch (error) {
      console.error("Error fetching teams:", error)
    } finally {
      setLoading(false)
    }
  }

  if (status === "loading" || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return null
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Teams</h1>
          <p className="text-gray-600 mt-2">Manage your cricket teams</p>
        </div>
        <Button asChild>
          <Link href="/team-builder">
            <Plus className="h-4 w-4 mr-2" />
            Create New Team
          </Link>
        </Button>
      </div>

      {teams.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">You haven't created any teams yet.</div>
          <Button asChild>
            <Link href="/team-builder">Create Your First Team</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <TeamCard key={team.id} team={team} onDelete={fetchTeams} />
          ))}
        </div>
      )}
    </div>
  )
}
