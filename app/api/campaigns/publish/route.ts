import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { campaignId, selectedPlatforms } = body

    // Demo: Simulate publishing to platforms
    console.log(
      `[API] Publishing campaign ${campaignId} to platforms:`,
      selectedPlatforms
    )

    const results = selectedPlatforms.map((platform: string) => ({
      platform,
      status: 'published',
      url: `https://${platform}.example.com/campaigns/${campaignId}`,
      timestamp: new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      message: 'Campaign published successfully',
      results,
    })
  } catch (error) {
    console.error('[API] Error publishing campaign:', error)
    return NextResponse.json(
      { error: 'Failed to publish campaign' },
      { status: 500 }
    )
  }
}
