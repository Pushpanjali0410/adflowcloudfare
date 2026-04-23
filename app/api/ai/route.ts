import { generateAdCopy, optimizeBudget, getBestTimeToPost } from '@/lib/ai-actions'
import { getSession } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const auth = await getSession()
    if (!auth) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { action, data } = await req.json()

    if (action === 'generate-copy') {
      const result = await generateAdCopy(data.prompt)
      return Response.json(result)
    }

    if (action === 'optimize-budget') {
      const result = await optimizeBudget(data)
      return Response.json(result)
    }

    if (action === 'best-time') {
      const result = await getBestTimeToPost(data)
      return Response.json(result)
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('[v0] AI endpoint error:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}
