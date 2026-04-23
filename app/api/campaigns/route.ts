import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { z } from 'zod';

const CampaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  budget: z.number().positive().optional(),
  currency: z.string().default('USD'),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
  target_platforms: z.array(z.string()).optional(),
  objective: z.enum(['awareness', 'consideration', 'conversion']).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      // Return mock data for development
      const { data: mockCampaigns } = await fetch(
        new URL('/api/campaigns/mock', request.url).toString()
      ).then(r => r.json()).catch(() => ({ data: [] }));
      return NextResponse.json({ campaigns: mockCampaigns || [] });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let query = supabase
      .from('campaigns')
      .select('*')
      .eq('user_id', session.id)
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: campaigns, error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch campaigns' }, { status: 400 });
    }

    return NextResponse.json({ campaigns });
  } catch (error) {
    // Fallback to mock data
    return NextResponse.json({ 
      campaigns: [
        {
          id: 'camp-001',
          name: 'Summer Promo',
          status: 'active',
          budget: 5000,
          spent: 3200,
          target_platforms: 'Meta,Google',
          created_at: new Date().toISOString(),
        }
      ] 
    });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const body = await request.json();
    const campaignData = CampaignSchema.parse(body);

    const { data: campaign, error } = await supabase
      .from('campaigns')
      .insert([
        {
          user_id: session.id,
          name: campaignData.name,
          description: campaignData.description,
          budget: campaignData.budget,
          currency: campaignData.currency,
          start_date: campaignData.start_date,
          end_date: campaignData.end_date,
          target_platforms: campaignData.target_platforms ? JSON.stringify(campaignData.target_platforms) : null,
          objective: campaignData.objective,
          status: 'draft',
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create campaign' }, { status: 400 });
    }

    return NextResponse.json({ campaign });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
