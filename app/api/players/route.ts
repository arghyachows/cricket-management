import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const country = searchParams.get("country")
    const role = searchParams.get("role")

    if (country && role) {
      const players = await sql`
        SELECT * FROM players
        WHERE country = ${country} AND role = ${role}
        ORDER BY name
      `
      return NextResponse.json(players)
    } else if (country) {
      const players = await sql`
        SELECT * FROM players
        WHERE country = ${country}
        ORDER BY name
      `
      return NextResponse.json(players)
    } else if (role) {
      const players = await sql`
        SELECT * FROM players
        WHERE role = ${role}
        ORDER BY name
      `
      return NextResponse.json(players)
    } else {
      const players = await sql`
        SELECT * FROM players
        ORDER BY name
      `
      return NextResponse.json(players)
    }
  } catch (error) {
    console.error("Error fetching players:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
