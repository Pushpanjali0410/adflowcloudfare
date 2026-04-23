import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { campaignId, variants } = body

    // Demo: A/B testing setup
    const tests = variants.map((variant: any, index: number) => ({
      id: `test-${Date.now()}-${index}`,
      name: variant.name || `Variant ${String.fromCharCode(65 + index)}`,
      version: variant.version,
      description: variant.description,
      status: 'active',
      performance: {
        impressions: Math.floor(Math.random() * 10000),
        clicks: Math.floor(Math.random() * 500),
        conversions: Math.floor(Math.random() * 50),
        ctr: (Math.random() * 5).toFixed(2) + '%',
        cpc: '$' + (Math.random() * 2 + 0.5).toFixed(2),
      },
    }))

    return NextResponse.json({
      success: true,
      testId: `ab-test-${Date.now()}`,
      variants: tests,
      message: 'A/B test created successfully',
    })
  } catch (error) {
    console.error('[API] Error creating A/B test:', error)
    return NextResponse.json(
      { error: 'Failed to create A/B test' },
      { status: 500 }
    )
  }
}
