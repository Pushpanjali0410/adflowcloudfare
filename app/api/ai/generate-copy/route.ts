import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const user = await getSession()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { productName, description, tone, platform } = body

    // Demo: Generate sample ad copies
    const adCopies = [
      `🎯 Transform Your Business with ${productName}! Discover how thousands of customers are achieving their goals. Limited time offer - Join today!`,
      `Tired of outdated solutions? Meet ${productName} - ${description}. Perfect for ${platform} audiences. Try it free now!`,
      `${productName}: Where Innovation Meets Results. ${description}. Don't miss out - exclusive deal inside!`,
      `Your Success Story Starts Here 📈 ${productName} delivers real results. See why industry leaders trust us. Learn more →`,
      `Stop Struggling, Start Succeeding with ${productName}. ${description}. Click to unlock your potential!`,
    ]

    return NextResponse.json({
      success: true,
      copies: adCopies,
      message: 'AI-generated ad copies',
    })
  } catch (error) {
    console.error('[API] Error generating copy:', error)
    return NextResponse.json(
      { error: 'Failed to generate ad copy' },
      { status: 500 }
    )
  }
}
