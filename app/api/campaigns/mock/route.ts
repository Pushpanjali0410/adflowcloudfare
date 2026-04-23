import { NextResponse } from 'next/server';

// Mock campaign data for demonstrations
const MOCK_CAMPAIGNS = [
  {
    id: 'camp-001',
    user_id: 'user-demo',
    name: 'Summer Promotion 2024',
    description: 'Multi-platform campaign for summer sale',
    status: 'active',
    budget: 5000,
    spent: 3200,
    impressions: 125000,
    clicks: 4500,
    conversions: 280,
    target_platforms: 'Meta,Google Ads,TikTok',
    created_at: '2024-06-01T00:00:00Z',
    updated_at: '2024-06-15T00:00:00Z',
    is_template: false,
  },
  {
    id: 'camp-002',
    user_id: 'user-demo',
    name: 'Product Launch - Beta',
    description: 'Testing new product with LinkedIn and Twitter',
    status: 'draft',
    budget: 2000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    conversions: 0,
    target_platforms: 'LinkedIn,Twitter',
    created_at: '2024-06-10T00:00:00Z',
    updated_at: '2024-06-10T00:00:00Z',
    is_template: false,
  },
  {
    id: 'camp-003',
    user_id: 'user-demo',
    name: 'Spring Clearance Sale',
    description: 'End of season clearance campaign',
    status: 'completed',
    budget: 3000,
    spent: 2950,
    impressions: 95000,
    clicks: 2800,
    conversions: 450,
    target_platforms: 'Facebook,Instagram,Pinterest',
    created_at: '2024-03-01T00:00:00Z',
    updated_at: '2024-04-30T00:00:00Z',
    is_template: false,
  },
];

export async function GET() {
  return NextResponse.json({
    campaigns: MOCK_CAMPAIGNS,
    total: MOCK_CAMPAIGNS.length,
    message: 'Mock campaign data for demonstration',
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, budget, platforms } = body;

    const newCampaign = {
      id: `camp-${Date.now()}`,
      user_id: 'user-demo',
      name,
      description,
      status: 'draft',
      budget,
      spent: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      target_platforms: platforms.join(','),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_template: false,
    };

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 400 }
    );
  }
}
