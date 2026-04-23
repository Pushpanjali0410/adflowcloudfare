import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, CampaignAnalytics, PlatformAnalytics } from '@/lib/types';

function generateMockMetrics() {
  return {
    impressions: Math.floor(Math.random() * 100000) + 10000,
    clicks: Math.floor(Math.random() * 5000) + 500,
    conversions: Math.floor(Math.random() * 500) + 50,
    spend: Math.floor(Math.random() * 5000) + 500,
    revenue: Math.floor(Math.random() * 15000) + 2000,
  };
}

export async function GET(request: NextRequest) {
  try {
    const campaignId = request.nextUrl.searchParams.get('campaignId');

    if (!campaignId) {
      return NextResponse.json(
        {
          success: false,
          error: 'campaignId is required',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const metrics = generateMockMetrics();
    
    const platformMetrics: Record<string, PlatformAnalytics> = {
      meta: {
        campaignId,
        platform: 'meta',
        ...metrics,
        ctr: (metrics.clicks / metrics.impressions) * 100,
        cpc: metrics.spend / metrics.clicks,
        cpm: (metrics.spend / metrics.impressions) * 1000,
        conversionRate: (metrics.conversions / metrics.clicks) * 100,
        roas: metrics.revenue / metrics.spend,
        updatedAt: new Date().toISOString(),
      },
      google_ads: {
        campaignId,
        platform: 'google_ads',
        ...generateMockMetrics(),
        ctr: 0.045,
        cpc: 1.2,
        cpm: 8.5,
        conversionRate: 3.2,
        roas: 3.8,
        updatedAt: new Date().toISOString(),
      },
      tiktok: {
        campaignId,
        platform: 'tiktok',
        ...generateMockMetrics(),
        ctr: 0.082,
        cpc: 0.35,
        cpm: 3.2,
        conversionRate: 2.1,
        roas: 4.2,
        updatedAt: new Date().toISOString(),
      },
    };

    const analytics: CampaignAnalytics = {
      campaignId,
      totalImpressions: Object.values(platformMetrics).reduce((sum, m) => sum + m.impressions, 0),
      totalClicks: Object.values(platformMetrics).reduce((sum, m) => sum + m.clicks, 0),
      totalConversions: Object.values(platformMetrics).reduce((sum, m) => sum + m.conversions, 0),
      totalSpend: Object.values(platformMetrics).reduce((sum, m) => sum + m.spend, 0),
      totalRevenue: Object.values(platformMetrics).reduce((sum, m) => sum + m.revenue, 0),
      avgCtr: Object.values(platformMetrics).reduce((sum, m) => sum + m.ctr, 0) / Object.keys(platformMetrics).length,
      avgCpc: Object.values(platformMetrics).reduce((sum, m) => sum + m.cpc, 0) / Object.keys(platformMetrics).length,
      avgCpm: Object.values(platformMetrics).reduce((sum, m) => sum + m.cpm, 0) / Object.keys(platformMetrics).length,
      avgConversionRate: Object.values(platformMetrics).reduce((sum, m) => sum + m.conversionRate, 0) / Object.keys(platformMetrics).length,
      avgRoas: Object.values(platformMetrics).reduce((sum, m) => sum + m.roas, 0) / Object.keys(platformMetrics).length,
      platformMetrics: platformMetrics as Record<any, PlatformAnalytics>,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: analytics,
      } as ApiResponse<CampaignAnalytics>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch analytics',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
