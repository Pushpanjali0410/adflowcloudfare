import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

interface PublishRequest {
  campaignId: string;
  platforms: string[];
}

interface RetryResult {
  platform: string;
  success: boolean;
  attempts: number;
  finalDelay: number;
  error?: string;
}

// Exponential backoff retry logic
async function retryWithBackoff(
  platform: string,
  maxRetries: number = 5,
  initialDelayMs: number = 1000
): Promise<RetryResult> {
  let attempt = 0;
  let delay = initialDelayMs;
  let lastError: string | null = null;

  while (attempt < maxRetries) {
    try {
      // Simulate platform API call with potential failures
      const shouldFail = Math.random() < 0.2; // 20% failure rate

      if (shouldFail && attempt < maxRetries - 1) {
        throw new Error(`Platform ${platform} temporarily unavailable`);
      }

      return {
        platform,
        success: true,
        attempts: attempt + 1,
        finalDelay: delay,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error';
      attempt++;

      if (attempt < maxRetries) {
        // Wait before retrying with exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
        delay = Math.min(delay * 2, 32000); // Max 32 second delay
      }
    }
  }

  return {
    platform,
    success: false,
    attempts: attempt,
    finalDelay: delay,
    error: lastError || 'Max retries exceeded',
  };
}

// Fallback logic - if primary platform fails, try fallback
const fallbackMap: Record<string, string[]> = {
  meta: ['google_ads', 'tiktok'],
  google_ads: ['meta', 'linkedin'],
  tiktok: ['meta', 'pinterest'],
  linkedin: ['google_ads', 'pinterest'],
  pinterest: ['tiktok', 'snapchat'],
  snapchat: ['tiktok', 'reddit'],
  twitter: ['reddit', 'linkedin'],
  reddit: ['twitter', 'snapchat'],
};

export async function POST(request: NextRequest) {
  try {
    const body: PublishRequest = await request.json();
    const { campaignId, platforms } = body;

    if (!campaignId || !platforms || platforms.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'campaignId and platforms are required',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const results: Record<string, RetryResult> = {};
    const fallbackResults: Record<string, RetryResult> = {};

    // Process each platform with retry mechanism
    for (const platform of platforms) {
      const result = await retryWithBackoff(platform);
      results[platform] = result;

      // If primary failed and has fallbacks, try them
      if (!result.success && fallbackMap[platform]) {
        for (const fallback of fallbackMap[platform]) {
          if (!results[fallback] && !fallbackResults[fallback]) {
            const fallbackResult = await retryWithBackoff(fallback);
            fallbackResults[fallback] = fallbackResult;

            // If fallback succeeds, mark primary as handled
            if (fallbackResult.success) {
              break;
            }
          }
        }
      }
    }

    // Determine overall success
    const totalPlatforms = platforms.length;
    const successfulPlatforms = Object.values(results).filter((r) => r.success).length;
    const fallbackSuccess = Object.values(fallbackResults).filter((r) => r.success).length;

    const overallSuccess = successfulPlatforms + fallbackSuccess >= totalPlatforms * 0.8; // 80% success threshold

    return NextResponse.json(
      {
        success: overallSuccess,
        data: {
          campaignId,
          primaryResults: results,
          fallbackResults,
          summary: {
            totalPlatforms,
            successfulPlatforms,
            failedPlatforms: totalPlatforms - successfulPlatforms,
            fallbacksUsed: Object.keys(fallbackResults).length,
          },
        },
      },
      { status: overallSuccess ? 200 : 207 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to publish campaign',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
