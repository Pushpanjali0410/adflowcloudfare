'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import toast from 'react-hot-toast'
import { ChevronLeft, Plus, Check, AlertCircle } from 'lucide-react'

interface Platform {
  id: string
  name: string
  icon: string
  connected: boolean
}

export default function PlatformsPage() {
  const router = useRouter()
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState<string | null>(null)

  useEffect(() => {
    fetchPlatforms()
  }, [])

  async function fetchPlatforms() {
    try {
      const response = await fetch('/api/platforms')
      if (!response.ok) throw new Error('Failed to fetch platforms')
      const data = await response.json()
      setPlatforms(data.platforms)
    } catch (error) {
      console.error('[v0] Error fetching platforms:', error)
      toast.error('Failed to load platforms')
    } finally {
      setLoading(false)
    }
  }

  async function connectPlatform(platformId: string) {
    setConnecting(platformId)
    try {
      const response = await fetch('/api/platforms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platformId,
          credentials: {}, // In production, would handle OAuth flow
        }),
      })

      if (!response.ok) throw new Error('Failed to connect')
      const data = await response.json()

      // Update platform status
      setPlatforms(
        platforms.map((p) =>
          p.id === platformId ? { ...p, connected: true } : p
        )
      )
      toast.success(data.message)
    } catch (error) {
      console.error('[v0] Error connecting platform:', error)
      toast.error('Failed to connect platform')
    } finally {
      setConnecting(null)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="border-b border-border bg-card p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Platform Integrations
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Connect and manage your advertising platforms
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 max-w-6xl mx-auto">
        {/* Connected Platforms Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {platforms.filter((p) => p.connected).length}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Connected Platforms
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-secondary">
                  {platforms.filter((p) => !p.connected).length}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Available to Connect
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-bold">
                  {platforms.length}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Total Platforms
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">Loading platforms...</p>
            </div>
          ) : platforms.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No platforms available</p>
            </div>
          ) : (
            platforms.map((platform) => (
              <Card
                key={platform.id}
                className={`transition-all ${
                  platform.connected
                    ? 'border-green-500/50 bg-green-50/5'
                    : 'hover:border-primary/50'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-4xl mb-2">{platform.icon}</div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                    </div>
                    {platform.connected && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => connectPlatform(platform.id)}
                    disabled={platform.connected || connecting === platform.id}
                    className="w-full"
                    variant={platform.connected ? 'outline' : 'default'}
                  >
                    {connecting === platform.id
                      ? 'Connecting...'
                      : platform.connected
                      ? 'Connected'
                      : 'Connect'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    {platform.connected
                      ? 'Ready to publish ads'
                      : 'Click to authenticate'}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
