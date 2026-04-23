import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse } from '@/lib/types';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: LoginRequest = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email and password are required',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    // Mock authentication - in production, validate against real database
    const mockUser = {
      id: 'user_' + Date.now(),
      email: body.email,
      name: body.email.split('@')[0],
    };

    const mockToken = Buffer.from(JSON.stringify(mockUser)).toString('base64');

    return NextResponse.json(
      {
        success: true,
        data: {
          user: mockUser,
          token: mockToken,
        },
      } as ApiResponse<LoginResponse>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Authentication failed',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
