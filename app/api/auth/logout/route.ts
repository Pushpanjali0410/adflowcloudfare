import { NextResponse } from 'next/server';
import { destroySession, getSession } from '@/lib/auth';

export async function POST() {
  const session = await getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  await destroySession();
  
  return NextResponse.json({ message: 'Logged out successfully' });
}
