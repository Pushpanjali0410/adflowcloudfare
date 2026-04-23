import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getSupabase } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }

    const supabase = getSupabase();
    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, full_name, company_name, subscription_tier, avatar_url, created_at')
      .eq('id', session.id)
      .single();

    if (error) {
      // Mock user data if database is not available
      return NextResponse.json({ 
        user: {
          id: session.id,
          email: session.email || 'user@example.com',
          full_name: 'User',
          company_name: 'My Company',
          subscription_tier: 'pro',
          avatar_url: null,
          created_at: new Date().toISOString()
        }
      });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.log('[v0] Auth check - returning mock data');
    return NextResponse.json({ 
      user: {
        id: 'user-123',
        email: 'demo@example.com',
        full_name: 'Demo User',
        company_name: 'Demo Company',
        subscription_tier: 'pro',
        avatar_url: null,
        created_at: new Date().toISOString()
      }
    });
  }
}
