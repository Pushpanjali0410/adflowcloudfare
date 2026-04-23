import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { totalBudget, platforms, campaignGoal } = body

    // Demo: AI-powered budget allocation
    const allocation: Record<string, number> = {}
    const baseAllocation = totalBudget / platforms.length

    // Simulate intelligent allocation based on platform
    platforms.forEach((platform: string) => {
      let percentage = 1
      if (platform === 'meta') percentage = 1.3 // 30% increase for Meta
      if (platform === 'google') percentage = 1.25 // 25% for Google
      if (platform === 'tiktok') percentage = 1.15 // 15% for TikTok
      if (platform === 'linkedin') percentage = 0.9 // 10% less for B2B
      
      allocation[platform] = Math.round(baseAllocation * percentage)
    })

    // Normalize to match total budget
    const total = Object.values(allocation).reduce((a, b) => a + b, 0)
    Object.keys(allocation).forEach((key) => {
      allocation[key] = Math.round((allocation[key] / total) * totalBudget)
    })

    return NextResponse.json({
      success: true,
      allocation,
      recommendations: [
        'Allocate 30% more to Meta for broad reach',
        'Google Ads performs best for conversion goals',
        'TikTok offers best engagement rates for younger demographics',
      ],
    })
  } catch (error) {
    console.error('[API] Error optimizing budget:', error)
    return NextResponse.json(
      { error: 'Failed to optimize budget' },
      { status: 500 }
    )
  }
}
