"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { PlayerCard } from "@/components/player-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Search, Save, Users, AlertCircle } from "lucide-react"

interface Player {
  id: number
  name: string
  country: string
  role: string
  batting_avg: number | null
  bowling_avg: number | null
  image_url: string | null
}

export function TeamBuilder() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()

  const [players, setPlayers] = useState<Player[]>([])
  const [selectedPlayers, setSelectedPlayers] = useState<Player[]>([])
  const [teamName, setTeamName] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPlayers()
  }, [])

  const fetchPlayers = async () => {
    try {
      const response = await fetch("/api/players")
      const data = await response.json()
      setPlayers(data)
    } catch (error) {
      console.error("Error fetching players:", error)
    } finally {
      setLoading(false)
    }
  }

  const handlePlayerSelect = (player: Player) => {
    if (selectedPlayers.find((p) => p.id === player.id)) {
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id))
    } else if (selectedPlayers.length < 11) {
      setSelectedPlayers([...selectedPlayers, player])
    } else {
      toast({
        title: "Team is full",
        description: "You can only select 11 players for a team.",
        variant: "destructive",
      })
    }
  }

  const validateTeam = () => {
    const errors = []

    if (selectedPlayers.length !== 11) {
      errors.push("Team must have exactly 11 players")
    }

    const overseasPlayers = selectedPlayers.filter((p) => p.country !== "India").length
    if (overseasPlayers > 4) {
      errors.push("Maximum 4 overseas players allowed")
    }

    const bowlers = selectedPlayers.filter((p) => p.role === "Bowler" || p.role === "All-rounder").length
    if (bowlers > 5) {
      errors.push("Maximum 5 bowlers allowed")
    }

    const wicketkeepers = selectedPlayers.filter((p) => p.role === "Wicketkeeper").length
    if (wicketkeepers < 1) {
      errors.push("At least 1 wicketkeeper required")
    }

    return errors
  }

  const handleSaveTeam = async () => {
    if (!teamName.trim()) {
      toast({
        title: "Team name required",
        description: "Please enter a name for your team.",
        variant: "destructive",
      })
      return
    }

    const validationErrors = validateTeam()
    if (validationErrors.length > 0) {
      toast({
        title: "Team validation failed",
        description: validationErrors.join(", "),
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const response = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName,
          playerIds: selectedPlayers.map((p) => p.id),
        }),
      })

      if (response.ok) {
        toast({
          title: "Team saved successfully",
          description: "Your team has been created.",
        })
        router.push("/my-teams")
      } else {
        throw new Error("Failed to save team")
      }
    } catch (error) {
      toast({
        title: "Error saving team",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const filteredPlayers = players.filter(
    (player) =>
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) && !selectedPlayers.find((p) => p.id === player.id),
  )

  const getTeamStats = () => {
    const roles = selectedPlayers.reduce(
      (acc, player) => {
        acc[player.role] = (acc[player.role] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const overseas = selectedPlayers.filter((p) => p.country !== "India").length

    return { roles, overseas }
  }

  const { roles, overseas } = getTeamStats()
  const validationErrors = validateTeam()

  if (loading) {
    return <div className="text-center py-8">Loading players...</div>
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Team Panel */}
      <div className="lg:col-span-1">
        <Card className="sticky top-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Your Team ({selectedPlayers.length}/11)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="teamName">Team Name</Label>
              <Input
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter team name"
              />
            </div>

            {/* Team Stats */}
            <div className="space-y-2">
              <h4 className="font-medium">Team Composition</h4>
              <div className="flex flex-wrap gap-1">
                {Object.entries(roles).map(([role, count]) => (
                  <Badge key={role} variant="secondary" className="text-xs">
                    {role}: {count}
                  </Badge>
                ))}
                <Badge variant={overseas > 4 ? "destructive" : "secondary"} className="text-xs">
                  Overseas: {overseas}/4
                </Badge>
              </div>
            </div>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Validation Issues</span>
                </div>
                <ul className="text-sm text-red-600 space-y-1">
                  {validationErrors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Selected Players */}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {selectedPlayers.map((player) => (
                <div key={player.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium text-sm">{player.name}</div>
                    <div className="text-xs text-gray-500">{player.role}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => handlePlayerSelect(player)}>
                    Remove
                  </Button>
                </div>
              ))}
            </div>

            <Button onClick={handleSaveTeam} disabled={saving || validationErrors.length > 0} className="w-full">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Team"}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Players Panel */}
      <div className="lg:col-span-2">
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search available players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPlayers.map((player) => (
              <PlayerCard
                key={player.id}
                player={player}
                onSelect={handlePlayerSelect}
                isSelected={selectedPlayers.some((p) => p.id === player.id)}
              />
            ))}
          </div>

          {filteredPlayers.length === 0 && (
            <div className="text-center py-8 text-gray-500">No available players found.</div>
          )}
        </div>
      </div>
    </div>
  )
}
