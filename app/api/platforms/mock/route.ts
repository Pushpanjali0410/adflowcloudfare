import { NextResponse } from 'next/server';

// Mock platform data - simulating real platform integrations
const MOCK_PLATFORMS = [
  {
    id: 'meta',
    name: 'Meta (Facebook & Instagram)',
    icon: '📱',
    description: 'Reach billions on Facebook and Instagram',
    connected: false,
    metrics: ['impressions', 'clicks', 'conversions', 'spent'],
  },
  {
    id: 'google',
    name: 'Google Ads',
    icon: '🔍',
    description: 'Advertise on Google Search and Display Network',
    connected: false,
    metrics: ['impressions', 'clicks', 'conversions', 'spent'],
  },
  {
    id: 'tiktok',
    name: 'TikTok Ads',
    icon: '🎵',
    description: 'Reach TikTok&apos;s massive audience',
    connected: false,
    metrics: ['impressions', 'clicks', 'conversions', 'spent'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn Ads',
    icon: '💼',
    description: 'B2B advertising and professional networking',
    connected: false,
    metrics: ['impressions', 'clicks', 'conversions', 'spent'],
  },
  {
    id: 'twitter',
    name: 'X (Twitter) Ads',
    icon: '𝕏',
    description: 'Real-time conversations and trends',
    connected: false,
    metrics: ['impressions', 'clicks', 'conversions', 'spent'],
  },
  {
    id: 'pinterest',
    name: 'Pinterest Ads',
    icon: '📌',
    description: 'Visual discovery and shopping platform',
    connected: false,
    metrics: ['impressions', 'clicks', 'conversions', 'spent'],
  },
  {
    id: 'snapchat',
    name: 'Snapchat Ads',
    icon: '👻',
    description: 'Reach younger demographics on Snapchat',
    connected: false,
    metrics: ['impressions', 'clicks', 'conversions', 'spent'],
  },
  {
    id: 'reddit',
    name: 'Reddit Ads',
    icon: '🤖',
    description: 'Engage with Reddit communities',
    connected: false,
    metrics: ['impressions', 'clicks', 'conversions', 'spent'],
  },
];

export async function GET() {
  return NextResponse.json({
    platforms: MOCK_PLATFORMS,
    total: MOCK_PLATFORMS.length,
    message: 'These are demo platforms. Connect real API credentials in settings.',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { platformId, credentials } = body;

    // Mock platform connection
    return NextResponse.json({
      success: true,
      message: `Connected to ${platformId}`,
      platform: {
        id: platformId,
        connected: true,
        connectedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to connect platform' },
      { status: 400 }
    );
  }
}
