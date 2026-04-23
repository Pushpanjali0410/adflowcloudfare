'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import toast from 'react-hot-toast'
import { ChevronLeft, Sparkles, TrendingUp, BarChart3, RefreshCw } from 'lucide-react'

export default function AIFeaturesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'copy' | 'budget' | 'timing'>('copy')
  const [loading, setLoading] = useState(false)

  // Copy Generation State
  const [copyForm, setCopyForm] = useState({
    productName: '',
    description: '',
    tone: 'professional',
    platform: 'meta',
  })
  const [generatedCopies, setGeneratedCopies] = useState<string[]>([])

  // Budget Optimization State
  const [budgetForm, setBudgetForm] = useState({
    totalBudget: '1000',
    platforms: ['meta', 'google', 'tiktok'],
  })
  const [budgetAllocation, setBudgetAllocation] = useState<Record<string, number>>({})

  // Best Time State
  const [timingForm, setTimingForm] = useState({
    platform: 'meta',
    timezone: 'UTC',
  })
  const [bestTimes, setBestTimes] = useState<any[]>([])

  async function generateCopy() {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(copyForm),
      })
      if (!response.ok) throw new Error('Failed to generate copy')
      const data = await response.json()
      setGeneratedCopies(data.copies)
      toast.success('Ad copies generated!')
    } catch (error) {
      console.error('[v0] Error generating copy:', error)
      toast.error('Failed to generate ad copy')
    } finally {
      setLoading(false)
    }
  }

  async function optimizeBudget() {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(budgetForm),
      })
      if (!response.ok) throw new Error('Failed to optimize budget')
      const data = await response.json()
      setBudgetAllocation(data.allocation)
      toast.success('Budget optimized!')
    } catch (error) {
      console.error('[v0] Error optimizing budget:', error)
      toast.error('Failed to optimize budget')
    } finally {
      setLoading(false)
    }
  }

  async function findBestTime() {
    setLoading(true)
    try {
      const response = await fetch('/api/ai/best-time', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(timingForm),
      })
      if (!response.ok) throw new Error('Failed to analyze timing')
      const data = await response.json()
      setBestTimes(data.bestTimes)
      toast.success('Best posting times analyzed!')
    } catch (error) {
      console.error('[v0] Error analyzing timing:', error)
      toast.error('Failed to analyze posting times')
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
                <Sparkles className="h-8 w-8 text-primary" />
                AI Features
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Harness AI power to optimize your campaigns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'copy', label: 'Generate Copy', icon: '✍️' },
            { id: 'budget', label: 'Optimize Budget', icon: '💰' },
            { id: 'timing', label: 'Best Time to Post', icon: '⏰' },
          ].map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'outline'}
              onClick={() => setActiveTab(tab.id as any)}
              className="whitespace-nowrap"
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Button>
          ))}
        </div>

        {/* AI Copy Generation */}
        {activeTab === 'copy' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Ad Copy with AI</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Product Name
                    </label>
                    <Input
                      placeholder="e.g., CloudSync Pro"
                      value={copyForm.productName}
                      onChange={(e) =>
                        setCopyForm({ ...copyForm, productName: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Tone
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      value={copyForm.tone}
                      onChange={(e) =>
                        setCopyForm({ ...copyForm, tone: e.target.value })
                      }
                    >
                      <option>professional</option>
                      <option>casual</option>
                      <option>urgent</option>
                      <option>funny</option>
                      <option>inspiring</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium mb-2 block">
                      Description
                    </label>
                    <textarea
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                      placeholder="Describe your product or service"
                      rows={3}
                      value={copyForm.description}
                      onChange={(e) =>
                        setCopyForm({
                          ...copyForm,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <Button
                  onClick={generateCopy}
                  disabled={loading || !copyForm.productName}
                  className="w-full"
                >
                  {loading ? 'Generating...' : 'Generate Ad Copy'}
                </Button>
              </CardContent>
            </Card>

            {generatedCopies.length > 0 && (
              <Card className="border-green-500/50">
                <CardHeader>
                  <CardTitle>Generated Ad Copies</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {generatedCopies.map((copy, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-muted rounded-lg border border-border"
                    >
                      <p className="text-sm mb-3">{copy}</p>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            navigator.clipboard.writeText(copy)
                            toast.success('Copied!')
                          }}
                        >
                          Copy
                        </Button>
                        <Button size="sm" variant="outline">
                          Use This
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Budget Optimization */}
        {activeTab === 'budget' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Budget Optimization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Total Budget ($)
                  </label>
                  <Input
                    type="number"
                    placeholder="1000"
                    value={budgetForm.totalBudget}
                    onChange={(e) =>
                      setBudgetForm({
                        ...budgetForm,
                        totalBudget: e.target.value,
                      })
                    }
                  />
                </div>
                <Button
                  onClick={optimizeBudget}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Optimizing...' : 'Optimize Budget'}
                </Button>
              </CardContent>
            </Card>

            {Object.keys(budgetAllocation).length > 0 && (
              <Card className="border-blue-500/50">
                <CardHeader>
                  <CardTitle>Recommended Budget Allocation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(budgetAllocation).map(([platform, amount]) => (
                    <div key={platform}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium capitalize">
                          {platform}
                        </span>
                        <span className="text-sm font-bold">
                          ${amount.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${
                              (amount /
                                Object.values(budgetAllocation).reduce(
                                  (a, b) => a + b,
                                  0
                                )) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Best Posting Time */}
        {activeTab === 'timing' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Find Best Posting Time</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Platform
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground"
                    value={timingForm.platform}
                    onChange={(e) =>
                      setTimingForm({ ...timingForm, platform: e.target.value })
                    }
                  >
                    <option value="meta">Meta (Facebook/Instagram)</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="tiktok">TikTok</option>
                    <option value="twitter">X (Twitter)</option>
                  </select>
                </div>
                <Button
                  onClick={findBestTime}
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? 'Analyzing...' : 'Analyze Best Times'}
                </Button>
              </CardContent>
            </Card>

            {bestTimes.length > 0 && (
              <Card className="border-purple-500/50">
                <CardHeader>
                  <CardTitle>Recommended Posting Times</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {bestTimes.map((time, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-muted rounded-lg border border-border flex justify-between items-start"
                    >
                      <div>
                        <p className="font-semibold text-lg">{time.time}</p>
                        <p className="text-sm text-muted-foreground">
                          {time.reason}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-primary">
                          {time.score}%
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Engagement Score
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
