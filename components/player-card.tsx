"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

interface Player {
  id: number
  name: string
  country: string
  role: string
  batting_avg: number | null
  bowling_avg: number | null
  image_url: string | null
}

interface PlayerCardProps {
  player: Player
  onSelect?: (player: Player) => void
  isSelected?: boolean
}

export function PlayerCard({ player, onSelect, isSelected }: PlayerCardProps) {
  const getRoleColor = (role: string) => {
    switch (role) {
      case "Batsman":
        return "bg-blue-100 text-blue-800"
      case "Bowler":
        return "bg-red-100 text-red-800"
      case "All-rounder":
        return "bg-green-100 text-green-800"
      case "Wicketkeeper":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-lg ${isSelected ? "ring-2 ring-green-500" : ""}`}
      onClick={() => onSelect?.(player)}
    >
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
            {player.image_url ? (
              <Image src={player.image_url || "/placeholder.svg"} alt={player.name} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                {player.name.charAt(0)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg truncate">{player.name}</h3>
            <p className="text-sm text-gray-600">{player.country}</p>
            <Badge className={`text-xs ${getRoleColor(player.role)}`}>{player.role}</Badge>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          {player.batting_avg && (
            <div>
              <span className="text-gray-500">Batting Avg:</span>
              <span className="ml-1 font-medium">{player.batting_avg}</span>
            </div>
          )}
          {player.bowling_avg && (
            <div>
              <span className="text-gray-500">Bowling Avg:</span>
              <span className="ml-1 font-medium">{player.bowling_avg}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
