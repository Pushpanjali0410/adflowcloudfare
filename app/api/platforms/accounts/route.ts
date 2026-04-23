import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, PlatformAccount } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    // Mock platform accounts - in production, fetch from database
    const mockAccounts: PlatformAccount[] = [
      {
        id: 'acc_1',
        userId: 'user_123',
        platform: 'meta',
        accountName: 'Main Meta Account',
        externalAccountId: 'fb_123456',
        accessToken: 'token_meta_123',
        isConnected: true,
        lastSyncedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'acc_2',
        userId: 'user_123',
        platform: 'google_ads',
        accountName: 'Google Ads Account',
        externalAccountId: 'google_123456',
        accessToken: 'token_google_123',
        isConnected: true,
        lastSyncedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    return NextResponse.json(
      {
        success: true,
        data: mockAccounts,
      } as ApiResponse<PlatformAccount[]>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch platform accounts',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Mock OAuth redirect
    const platform = body.platform;
    const oauthUrl = `https://oauth.${platform}.com/authorize?client_id=YOUR_CLIENT_ID&redirect_uri=http://localhost:3000/api/platforms/callback`;

    return NextResponse.json(
      {
        success: true,
        data: { authUrl: oauthUrl },
      } as ApiResponse<{ authUrl: string }>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to initiate OAuth',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
