import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Trophy, Users, Star, Shield } from "lucide-react"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Trophy className="h-16 w-16 text-green-600" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">Cricket Team Manager</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Build your dream cricket team with real players from around the world. Create, manage, and analyze your
            teams with advanced statistics and insights.
          </p>

          {session ? (
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/team-builder">Build Team</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/my-teams">My Teams</Link>
              </Button>
            </div>
          ) : (
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/login">Get Started</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/players">Browse Players</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>200+ Real Players</CardTitle>
                <CardDescription>
                  Browse and select from a comprehensive database of international cricket players
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Filter by country and role</li>
                  <li>• Real player statistics</li>
                  <li>• Search functionality</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Smart Team Builder</CardTitle>
                <CardDescription>Create balanced teams with intelligent validation and constraints</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Maximum 4 overseas players</li>
                  <li>• Role-based validation</li>
                  <li>• Drag & drop interface</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Star className="h-8 w-8 text-yellow-600 mb-2" />
                <CardTitle>Team Management</CardTitle>
                <CardDescription>Save, manage, and analyze multiple teams with detailed insights</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Multiple team creation</li>
                  <li>• Team statistics</li>
                  <li>• Share teams publicly</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Platform Statistics</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl font-bold text-green-600">200+</div>
              <div className="text-gray-600">Cricket Players</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">15+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-600">4</div>
              <div className="text-gray-600">Player Roles</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">∞</div>
              <div className="text-gray-600">Team Combinations</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
