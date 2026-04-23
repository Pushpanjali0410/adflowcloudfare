import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Return mock analytics data for demo
    const mockAnalytics = {
      totalCampaigns: 5,
      totalImpressions: 125000,
      totalClicks: 3500,
      totalConversions: 280,
      totalSpent: 4500,
      totalBudget: 5000,
      averageCtr: '2.8',
      averageCpc: '1.29',
      roi: '6.2',
      campaigns: [
        { name: 'Summer Campaign', impressions: 45000, clicks: 1200, conversions: 120, spent: 1800 },
        { name: 'Spring Promo', impressions: 38000, clicks: 980, conversions: 95, spent: 1400 },
        { name: 'Brand Awareness', impressions: 25000, clicks: 750, conversions: 40, spent: 900 },
        { name: 'Product Launch', impressions: 12000, clicks: 420, conversions: 18, spent: 320 },
        { name: 'Holiday Special', impressions: 5000, clicks: 150, conversions: 7, spent: 80 },
      ],
    };
    return NextResponse.json(mockAnalytics);
  } catch (error) {
    console.error('[v0] Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
