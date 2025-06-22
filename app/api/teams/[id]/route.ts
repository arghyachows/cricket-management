import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    const teamId = params.id

    // Get team details
    const teams = await sql`
      SELECT * FROM teams WHERE id = ${teamId}
    `

    if (teams.length === 0) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 })
    }

    const team = teams[0]

    // Check if user owns the team (for private access)
    if (session?.user?.id && team.user_id !== Number.parseInt(session.user.id)) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 403 })
    }

    // Get team players
    const players = await sql`
      SELECT p.* FROM players p
      JOIN team_players tp ON p.id = tp.player_id
      WHERE tp.team_id = ${teamId}
      ORDER BY p.name
    `

    return NextResponse.json({
      ...team,
      players,
    })
  } catch (error) {
    console.error("Error fetching team:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const teamId = params.id

    // Check if user owns the team
    const teams = await sql`
      SELECT * FROM teams WHERE id = ${teamId} AND user_id = ${session.user.id}
    `

    if (teams.length === 0) {
      return NextResponse.json({ message: "Team not found or unauthorized" }, { status: 404 })
    }

    // Delete team players first (foreign key constraint)
    await sql`
      DELETE FROM team_players WHERE team_id = ${teamId}
    `

    // Delete team
    await sql`
      DELETE FROM teams WHERE id = ${teamId}
    `

    return NextResponse.json({ message: "Team deleted successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error deleting team:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
