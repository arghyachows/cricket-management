import { Suspense } from "react"
import { PlayersList } from "@/components/players-list"
import { PlayersFilter } from "@/components/players-filter"

export default function PlayersPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Cricket Players</h1>
        <p className="text-gray-600 mt-2">Browse and discover cricket players from around the world</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64">
          <PlayersFilter />
        </aside>

        <main className="flex-1">
          <Suspense fallback={<div>Loading players...</div>}>
            <PlayersList />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
