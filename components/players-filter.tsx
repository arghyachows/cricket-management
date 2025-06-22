"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const countries = [
  "India",
  "Australia",
  "England",
  "Pakistan",
  "South Africa",
  "New Zealand",
  "West Indies",
  "Sri Lanka",
  "Bangladesh",
  "Afghanistan",
]

const roles = ["Batsman", "Bowler", "All-rounder", "Wicketkeeper"]

export function PlayersFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedCountry = searchParams.get("country")
  const selectedRole = searchParams.get("role")

  const updateFilter = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.push(`/players?${params.toString()}`)
  }

  const clearFilters = () => {
    router.push("/players")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-3">Country</h3>
          <div className="space-y-2">
            {countries.map((country) => (
              <Button
                key={country}
                variant={selectedCountry === country ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => updateFilter("country", selectedCountry === country ? null : country)}
              >
                {country}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-3">Role</h3>
          <div className="space-y-2">
            {roles.map((role) => (
              <Button
                key={role}
                variant={selectedRole === role ? "default" : "ghost"}
                size="sm"
                className="w-full justify-start"
                onClick={() => updateFilter("role", selectedRole === role ? null : role)}
              >
                {role}
              </Button>
            ))}
          </div>
        </div>

        {(selectedCountry || selectedRole) && (
          <div>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedCountry && (
                <Badge variant="secondary">
                  {selectedCountry}
                  <button onClick={() => updateFilter("country", null)} className="ml-2 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              )}
              {selectedRole && (
                <Badge variant="secondary">
                  {selectedRole}
                  <button onClick={() => updateFilter("role", null)} className="ml-2 hover:text-red-500">
                    ×
                  </button>
                </Badge>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
