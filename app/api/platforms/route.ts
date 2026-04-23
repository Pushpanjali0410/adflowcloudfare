import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

const AVAILABLE_PLATFORMS = [
  { id: 'meta', name: 'Meta (Facebook/Instagram)', icon: '📘', connected: false },
  { id: 'google', name: 'Google Ads', icon: '🔍', connected: false },
  { id: 'tiktok', name: 'TikTok Ads', icon: '🎵', connected: false },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', connected: false },
  { id: 'twitter', name: 'X (Twitter)', icon: '𝕏', connected: false },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', connected: false },
  { id: 'snapchat', name: 'Snapchat', icon: '👻', connected: false },
  { id: 'reddit', name: 'Reddit', icon: '🔴', connected: false },
  { id: 'youtube', name: 'YouTube', icon: '📺', connected: false },
  { id: 'quora', name: 'Quora', icon: '❓', connected: false },
]

export async function GET(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // For demo: return all platforms
    return NextResponse.json({
      platforms: AVAILABLE_PLATFORMS,
      message: 'Available platforms for integration',
    })
  } catch (error) {
    console.error('[API] Error fetching platforms:', error)
    return NextResponse.json(
      { error: 'Failed to fetch platforms' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { platformId, credentials } = body

    // Demo: Simulate storing platform credentials
    console.log(`[API] Connecting platform ${platformId} for user ${user.id}`)

    return NextResponse.json({
      success: true,
      message: `Successfully connected to ${platformId}`,
      platform: platformId,
    })
  } catch (error) {
    console.error('[API] Error connecting platform:', error)
    return NextResponse.json(
      { error: 'Failed to connect platform' },
      { status: 500 }
    )
  }
}
