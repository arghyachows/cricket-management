import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { name, playerIds } = await request.json()

    if (!name || !playerIds || !Array.isArray(playerIds)) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 })
    }

    // Create team
    const teams = await sql`
      INSERT INTO teams (name, user_id)
      VALUES (${name}, ${session.user.id})
      RETURNING id
    `

    const teamId = teams[0].id

    // Add players to team
    for (const playerId of playerIds) {
      await sql`
        INSERT INTO team_players (team_id, player_id)
        VALUES (${teamId}, ${playerId})
      `
    }

    return NextResponse.json({ message: "Team created successfully", teamId }, { status: 201 })
  } catch (error) {
    console.error("Error creating team:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
