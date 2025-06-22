"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { PlayerCard } from "@/components/player-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Player {
  id: number
  name: string
  country: string
  role: string
  batting_avg: number | null
  bowling_avg: number | null
  image_url: string | null
}

export function PlayersList() {
  const [players, setPlayers] = useState<Player[]>([])
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()

  useEffect(() => {
    fetchPlayers()
  }, [searchParams])

  useEffect(() => {
    filterPlayers()
  }, [players, searchTerm])

  const fetchPlayers = async () => {
    try {
      const params = new URLSearchParams()
      const country = searchParams.get("country")
      const role = searchParams.get("role")

      if (country) params.append("country", country)
      if (role) params.append("role", role)

      const response = await fetch(`/api/players?${params.toString()}`)
      const data = await response.json()
      setPlayers(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching players:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPlayers = () => {
    if (!searchTerm) {
      setFilteredPlayers(players)
      return
    }

    const filtered = players.filter((player) => player.name.toLowerCase().includes(searchTerm.toLowerCase()))
    setFilteredPlayers(filtered)
  }

  if (loading) {
    return <div className="text-center py-8">Loading players...</div>
  }

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search players..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPlayers.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </div>

      {filteredPlayers.length === 0 && (
        <div className="text-center py-8 text-gray-500">No players found matching your criteria.</div>
      )}
    </div>
  )
}
