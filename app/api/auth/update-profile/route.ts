import { getSession } from '@/lib/auth'
import { getSupabaseAdmin } from '@/lib/supabase'

export async function PUT(req: Request) {
  try {
    const auth = await getSession()
    if (!auth) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('users')
      .update({
        name: body.name,
        company: body.company,
        bio: body.bio,
        updated_at: new Date(),
      })
      .eq('id', auth.id)
      .select()
      .single()

    if (error) {
      return Response.json({ error: error.message }, { status: 400 })
    }

    return Response.json(data)
  } catch (error) {
    console.error('[v0] Error updating profile:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
