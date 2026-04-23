import { NextResponse } from 'next/server';
import { z } from 'zod';

export class APIError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export function handleError(error: unknown) {
  console.error('[v0] Error:', error);

  if (error instanceof z.ZodError) {
    return NextResponse.json(
      {
        error: 'Validation error',
        details: error.errors,
      },
      { status: 400 }
    );
  }

  if (error instanceof APIError) {
    return NextResponse.json(
      {
        error: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof Error) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: 'Internal server error',
    },
    { status: 500 }
  );
}

export const errorMessages = {
  NOT_AUTHENTICATED: 'User not authenticated',
  INVALID_REQUEST: 'Invalid request data',
  CAMPAIGN_NOT_FOUND: 'Campaign not found',
  PLATFORM_NOT_CONNECTED: 'Platform credentials not found',
  INVALID_PLATFORM: 'Invalid platform specified',
  INSUFFICIENT_BUDGET: 'Budget is insufficient for this campaign',
  CAMPAIGN_IN_PROGRESS: 'Cannot modify an active campaign',
};
