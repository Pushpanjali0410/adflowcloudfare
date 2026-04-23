'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChevronLeft, BarChart3, TrendingUp } from 'lucide-react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const platformData = [
  { name: 'Meta', value: 4200, color: '#1877F2' },
  { name: 'Google', value: 3800, color: '#4285F4' },
  { name: 'TikTok', value: 2900, color: '#000000' },
  { name: 'LinkedIn', value: 1800, color: '#0A66C2' },
]

const performanceData = [
  { date: 'Mon', impressions: 2400, clicks: 240, conversions: 24 },
  { date: 'Tue', impressions: 2210, clicks: 221, conversions: 22 },
  { date: 'Wed', impressions: 2290, clicks: 229, conversions: 20 },
  { date: 'Thu', impressions: 2000, clicks: 200, conversions: 18 },
  { date: 'Fri', impressions: 2181, clicks: 218, conversions: 25 },
  { date: 'Sat', impressions: 2500, clicks: 250, conversions: 28 },
  { date: 'Sun', impressions: 2100, clicks: 210, conversions: 16 },
]

const platformMetrics = [
  {
    platform: 'Meta',
    impressions: 12500,
    clicks: 1250,
    conversions: 125,
    ctr: '10.0%',
    roi: '350%',
  },
  {
    platform: 'Google',
    impressions: 10200,
    clicks: 1530,
    conversions: 180,
    ctr: '15.0%',
    roi: '420%',
  },
  {
    platform: 'TikTok',
    impressions: 9800,
    clicks: 980,
    conversions: 98,
    ctr: '10.0%',
    roi: '280%',
  },
  {
    platform: 'LinkedIn',
    impressions: 5600,
    clicks: 840,
    conversions: 84,
    ctr: '15.0%',
    roi: '380%',
  },
]

export default function AnalyticsDashboard() {
  const router = useRouter()
  const [totalMetrics, setTotalMetrics] = useState({
    impressions: 38100,
    clicks: 4600,
    conversions: 487,
    ctr: '12.1%',
    roas: '350%',
  })

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
                <BarChart3 className="h-8 w-8 text-primary" />
                Analytics Dashboard
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track performance across all campaigns
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Impressions</p>
              <p className="text-3xl font-bold">
                {totalMetrics.impressions.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Clicks</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalMetrics.clicks.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">Conversions</p>
              <p className="text-3xl font-bold text-green-600">
                {totalMetrics.conversions}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">CTR</p>
              <p className="text-3xl font-bold">{totalMetrics.ctr}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-1">ROAS</p>
              <p className="text-3xl font-bold text-purple-600">
                {totalMetrics.roas}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="impressions"
                    stroke="#3b82f6"
                    name="Impressions"
                  />
                  <Line
                    type="monotone"
                    dataKey="clicks"
                    stroke="#10b981"
                    name="Clicks"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {platformData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Platform Metrics Table */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">
                      Platform
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Impressions
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">Clicks</th>
                    <th className="text-right py-3 px-4 font-semibold">
                      Conversions
                    </th>
                    <th className="text-right py-3 px-4 font-semibold">CTR</th>
                    <th className="text-right py-3 px-4 font-semibold">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {platformMetrics.map((metric) => (
                    <tr
                      key={metric.platform}
                      className="border-b border-border hover:bg-muted/50"
                    >
                      <td className="py-3 px-4 font-medium">{metric.platform}</td>
                      <td className="text-right py-3 px-4">
                        {metric.impressions.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4">
                        {metric.clicks.toLocaleString()}
                      </td>
                      <td className="text-right py-3 px-4">
                        {metric.conversions}
                      </td>
                      <td className="text-right py-3 px-4">{metric.ctr}</td>
                      <td className="text-right py-3 px-4 font-semibold text-green-600">
                        {metric.roi}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
