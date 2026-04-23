import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const auth = await getSession()
    if (!auth) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { campaignId } = await req.json()

    const supabase = getSupabaseAdmin()
    // Fetch original campaign
    const { data: original, error: fetchError } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .eq('user_id', auth.id)
      .single()

    if (fetchError || !original) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 })
    }

    // Create duplicate
    const newCampaign = {
      ...original,
      id: undefined,
      name: `${original.name} (Copy)`,
      status: 'draft',
      created_at: undefined,
      updated_at: undefined,
    }

    const { data: duplicated, error: createError } = await supabase
      .from('campaigns')
      .insert([newCampaign])
      .select()
      .single()

    if (createError) {
      return Response.json({ error: createError.message }, { status: 400 })
    }

    return Response.json(duplicated)
  } catch (error) {
    console.error('[v0] Error duplicating campaign:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
