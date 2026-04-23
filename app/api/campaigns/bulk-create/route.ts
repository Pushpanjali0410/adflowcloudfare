import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { campaigns, template } = body

    // Demo: Bulk campaign creation
    const created = campaigns.map((campaign: any, index: number) => ({
      id: `campaign-${Date.now()}-${index}`,
      name: campaign.name,
      status: 'created',
      platforms: campaign.platforms,
      createdAt: new Date().toISOString(),
    }))

    return NextResponse.json({
      success: true,
      created: created.length,
      campaigns: created,
      message: `Successfully created ${created.length} campaigns`,
    })
  } catch (error) {
    console.error('[API] Error creating bulk campaigns:', error)
    return NextResponse.json(
      { error: 'Failed to create campaigns' },
      { status: 500 }
    )
  }
}
