import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

export interface CampaignEvent {
  id: string;
  campaignId: string;
  type: 'created' | 'paused' | 'resumed' | 'published' | 'updated' | 'deleted';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

// In-memory store for events (replace with database in production)
let events: CampaignEvent[] = [];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const campaignId = searchParams.get('campaignId');
    const limit = parseInt(searchParams.get('limit') || '50');

    let filteredEvents = [...events];
    
    if (campaignId) {
      filteredEvents = filteredEvents.filter(e => e.campaignId === campaignId);
    }

    const sortedEvents = filteredEvents.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, limit);

    return NextResponse.json(
      {
        success: true,
        data: sortedEvents,
      } as ApiResponse<CampaignEvent[]>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch events',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { campaignId, type, title, description, icon } = body;

    if (!campaignId || !type || !title) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: campaignId, type, title',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const newEvent: CampaignEvent = {
      id: `evt_${Date.now()}`,
      campaignId,
      type,
      title,
      description: description || '',
      timestamp: new Date().toISOString(),
      icon: icon || '📢',
    };

    events.unshift(newEvent);

    // Keep only last 1000 events in memory
    if (events.length > 1000) {
      events = events.slice(0, 1000);
    }

    return NextResponse.json(
      {
        success: true,
        data: newEvent,
      } as ApiResponse<CampaignEvent>,
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create event',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
