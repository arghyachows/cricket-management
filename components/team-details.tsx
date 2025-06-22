"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlayerCard } from "@/components/player-card"
import { Users, Calendar, BarChart3 } from "lucide-react"

interface Player {
  id: number
  name: string
  country: string
  role: string
  batting_avg: number | null
  bowling_avg: number | null
  image_url: string | null
}

interface Team {
  id: number
  name: string
  created_at: string
  players: Player[]
}

interface TeamDetailsProps {
  team: Team
}

export function TeamDetails({ team }: TeamDetailsProps) {
  const getTeamStats = () => {
    const roles = team.players.reduce(
      (acc, player) => {
        acc[player.role] = (acc[player.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const countries = team.players.reduce(
      (acc, player) => {
        acc[player.country] = (acc[player.country] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const overseas = team.players.filter((p) => p.country !== "India").length

    const avgBattingAvg =
      team.players.filter((p) => p.batting_avg).reduce((sum, p) => sum + (p.batting_avg || 0), 0) /
      team.players.filter((p) => p.batting_avg).length

    const avgBowlingAvg =
      team.players.filter((p) => p.bowling_avg).reduce((sum, p) => sum + (p.bowling_avg || 0), 0) /
      team.players.filter((p) => p.bowling_avg).length

    return { roles, countries, overseas, avgBattingAvg, avgBowlingAvg }
  }

  const { roles, countries, overseas, avgBattingAvg, avgBowlingAvg } = getTeamStats()

  return (
    <div className="space-y-8">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Players</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{team.players.length}</div>
            <p className="text-xs text-muted-foreground">
              {team.players.length === 11 ? "Complete team" : `${11 - team.players.length} more needed`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overseas Players</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overseas}/4</div>
            <p className="text-xs text-muted-foreground">{overseas <= 4 ? "Within limit" : "Exceeds limit"}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Created</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(team.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
            </div>
            <p className="text-xs text-muted-foreground">{new Date(team.created_at).getFullYear()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Composition */}
      <Card>
        <CardHeader>
          <CardTitle>Team Composition</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">By Role</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(roles).map(([role, count]) => (
                  <Badge key={role} variant="secondary">
                    {role}: {count}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">By Country</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(countries).map(([country, count]) => (
                  <Badge key={country} variant="outline">
                    {country}: {count}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {!isNaN(avgBattingAvg) && !isNaN(avgBowlingAvg) && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{avgBattingAvg.toFixed(1)}</div>
                <div className="text-sm text-blue-600">Avg Batting Average</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{avgBowlingAvg.toFixed(1)}</div>
                <div className="text-sm text-red-600">Avg Bowling Average</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Players List */}
      <Card>
        <CardHeader>
          <CardTitle>Team Players</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {team.players.map((player) => (
              <PlayerCard key={player.id} player={player} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
