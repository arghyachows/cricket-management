"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Calendar, Eye, Trash2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

interface Team {
  id: number
  name: string
  created_at: string
  player_count: number
}

interface TeamCardProps {
  team: Team
  onDelete: () => void
}

export function TeamCard({ team, onDelete }: TeamCardProps) {
  const { toast } = useToast()

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this team?")) return

    try {
      const response = await fetch(`/api/teams/${team.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Team deleted",
          description: "Your team has been successfully deleted.",
        })
        onDelete()
      } else {
        throw new Error("Failed to delete team")
      }
    } catch (error) {
      toast({
        title: "Error deleting team",
        description: "Please try again later.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="truncate">{team.name}</span>
          <Badge variant={team.player_count === 11 ? "default" : "secondary"}>{team.player_count}/11</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Created {new Date(team.created_at).toLocaleDateString()}
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Users className="h-4 w-4 mr-2" />
            {team.player_count} players selected
          </div>

          <div className="flex gap-2">
            <Button asChild size="sm" className="flex-1">
              <Link href={`/team/${team.id}`}>
                <Eye className="h-4 w-4 mr-2" />
                View
              </Link>
            </Button>
            <Button size="sm" variant="outline" onClick={handleDelete} className="text-red-600 hover:text-red-700">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
