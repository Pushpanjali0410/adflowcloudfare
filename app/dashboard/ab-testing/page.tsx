'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { ChevronLeft, Plus, Trash2, TrendingUp } from 'lucide-react'

interface Variant {
  name: string
  description: string
  version: string
}

interface TestResult {
  id: string
  name: string
  version: string
  description: string
  status: string
  performance: {
    impressions: number
    clicks: number
    conversions: number
    ctr: string
    cpc: string
  }
}

export default function ABTestingPage() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [variants, setVariants] = useState<Variant[]>([
    { name: 'Variant A', description: '', version: 'v1' },
  ])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(false)

  function addVariant() {
    setVariants([
      ...variants,
      {
        name: `Variant ${String.fromCharCode(65 + variants.length)}`,
        description: '',
        version: `v${variants.length + 1}`,
      },
    ])
  }

  function removeVariant(index: number) {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    } else {
      toast.error('You need at least one variant')
    }
  }

  function updateVariant(index: number, field: string, value: string) {
    const updated = [...variants]
    ;(updated[index] as any)[field] = value
    setVariants(updated)
  }

  async function createTest() {
    if (variants.some((v) => !v.description)) {
      toast.error('Please fill in all variant descriptions')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ab-testing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId: 'current-campaign',
          variants,
        }),
      })
      if (!response.ok) throw new Error('Failed to create test')
      const data = await response.json()
      setTestResults(data.variants)
      toast.success('A/B test created successfully!')
    } catch (error) {
      console.error('[v0] Error creating test:', error)
      toast.error('Failed to create A/B test')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Back Button */}
      <div className="border-b border-border bg-card p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="rounded-full"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                <TrendingUp className="h-8 w-8 text-primary" />
                A/B Testing
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Test different ad variations to maximize performance
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {testResults.length === 0 ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Create New A/B Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Variants Setup */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Test Variants</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={addVariant}
                      className="gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Variant
                    </Button>
                  </div>

                  {variants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="p-4 border border-input rounded-lg space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Variant Name
                          </label>
                          <Input
                            placeholder="e.g., Conservative Copy"
                            value={variant.name}
                            onChange={(e) =>
                              updateVariant(idx, 'name', e.target.value)
                            }
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-1 block">
                            Version
                          </label>
                          <Input
                            placeholder="e.g., v1"
                            value={variant.version}
                            onChange={(e) =>
                              updateVariant(idx, 'version', e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">
                          Ad Copy / Description
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                          placeholder="Enter your ad copy here"
                          rows={3}
                          value={variant.description}
                          onChange={(e) =>
                            updateVariant(idx, 'description', e.target.value)
                          }
                        />
                      </div>
                      {variants.length > 1 && (
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeVariant(idx)}
                          className="gap-2 w-full"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove Variant
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Create Button */}
                <Button
                  onClick={createTest}
                  disabled={loading}
                  size="lg"
                  className="w-full"
                >
                  {loading ? 'Creating Test...' : 'Create A/B Test'}
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Test Results</h2>
              <Button variant="outline" onClick={() => setTestResults([])}>
                Create New Test
              </Button>
            </div>

            <div className="grid gap-4">
              {testResults.map((result) => (
                <Card key={result.id} className="border-blue-500/30">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{result.name}</CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {result.description}
                        </p>
                      </div>
                      <span className="px-3 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs font-semibold">
                        {result.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      <div>
                        <p className="text-2xl font-bold">
                          {result.performance.impressions.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Impressions
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {result.performance.clicks.toLocaleString()}
                        </p>
                        <p className="text-xs text-muted-foreground">Clicks</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {result.performance.conversions}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Conversions
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {result.performance.ctr}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Click Rate
                        </p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">
                          {result.performance.cpc}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Cost/Click
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
