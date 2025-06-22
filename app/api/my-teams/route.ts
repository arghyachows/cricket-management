import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const teams = await sql`
      SELECT 
        t.*,
        COUNT(tp.player_id) as player_count
      FROM teams t
      LEFT JOIN team_players tp ON t.id = tp.team_id
      WHERE t.user_id = ${session.user.id}
      GROUP BY t.id
      ORDER BY t.created_at DESC
    `

    return NextResponse.json(teams)
  } catch (error) {
    console.error("Error fetching user teams:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
