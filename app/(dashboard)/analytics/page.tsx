'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { PLATFORMS } from '@/lib/constants';
import type { CampaignAnalytics } from '@/lib/types';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#f97316'];

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<CampaignAnalytics | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState('camp_1');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics(selectedCampaign);
  }, [selectedCampaign]);

  const fetchAnalytics = async (campaignId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/analytics?campaignId=${campaignId}`);
      const data = await response.json();

      if (data.success) {
        setAnalytics(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Prepare chart data
  const platformData = analytics
    ? Object.entries(analytics.platformMetrics).map(([platform, metrics]) => ({
        name: PLATFORMS[platform as any]?.name || platform,
        impressions: metrics.impressions,
        clicks: metrics.clicks,
        conversions: metrics.conversions,
        spend: metrics.spend,
        revenue: metrics.revenue,
        ctr: metrics.ctr.toFixed(2),
        roas: metrics.roas.toFixed(2),
      }))
    : [];

  const conversionData = [
    { name: 'Impressions', value: analytics?.totalImpressions || 0 },
    { name: 'Clicks', value: analytics?.totalClicks || 0 },
    { name: 'Conversions', value: analytics?.totalConversions || 0 },
  ];

  const performanceData = [
    { metric: 'CTR', value: analytics?.avgCtr?.toFixed(2) || 0, unit: '%' },
    { metric: 'CPC', value: analytics?.avgCpc?.toFixed(2) || 0, unit: '$' },
    { metric: 'CPM', value: analytics?.avgCpm?.toFixed(2) || 0, unit: '$' },
    { metric: 'Conv. Rate', value: analytics?.avgConversionRate?.toFixed(2) || 0, unit: '%' },
    { metric: 'ROAS', value: analytics?.avgRoas?.toFixed(2) || 0, unit: 'x' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Back Button */}
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="mb-2 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="text-muted-foreground mt-1">Track campaign performance across all platforms</p>
      </div>

      {/* Campaign Selector */}
      <Card className="p-6">
        <label className="block text-sm font-medium mb-2">Select Campaign</label>
        <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
          <option value="camp_1">Summer Sale Campaign</option>
          <option value="camp_2">Brand Awareness Q2</option>
        </Select>
      </Card>

      {isLoading ? (
        <Card className="p-8 text-center text-muted-foreground">
          Loading analytics...
        </Card>
      ) : analytics ? (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {performanceData.map((metric) => (
              <Card key={metric.metric} className="p-4">
                <p className="text-xs text-muted-foreground font-semibold mb-1">
                  {metric.metric}
                </p>
                <p className="text-2xl font-bold">
                  {metric.value}
                  <span className="text-sm text-muted-foreground ml-1">{metric.unit}</span>
                </p>
              </Card>
            ))}
          </div>

          {/* Overall Spend & Revenue */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Total Spend</h3>
              <p className="text-3xl font-bold">${analytics.totalSpend.toLocaleString()}</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Total Revenue</h3>
              <p className="text-3xl font-bold text-green-600">
                ${analytics.totalRevenue.toLocaleString()}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-sm font-semibold text-muted-foreground mb-2">Net Profit</h3>
              <p className="text-3xl font-bold text-blue-600">
                ${(analytics.totalRevenue - analytics.totalSpend).toLocaleString()}
              </p>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Conversion Funnel */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Conversion Funnel</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={conversionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value.toLocaleString()}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {conversionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            {/* Platform Comparison - CTR */}
            <Card className="p-6">
              <h3 className="text-lg font-bold mb-4">Click-Through Rate by Platform</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={platformData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ctr" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Platform Performance Table */}
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4">Platform Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr>
                    <th className="text-left py-2 px-4 font-semibold">Platform</th>
                    <th className="text-right py-2 px-4 font-semibold">Impressions</th>
                    <th className="text-right py-2 px-4 font-semibold">Clicks</th>
                    <th className="text-right py-2 px-4 font-semibold">Conversions</th>
                    <th className="text-right py-2 px-4 font-semibold">Spend</th>
                    <th className="text-right py-2 px-4 font-semibold">Revenue</th>
                    <th className="text-right py-2 px-4 font-semibold">ROAS</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {platformData.map((row) => (
                    <tr key={row.name} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-medium">{row.name}</td>
                      <td className="text-right py-3 px-4">{row.impressions.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{row.clicks.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">{row.conversions.toLocaleString()}</td>
                      <td className="text-right py-3 px-4">${row.spend.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 text-green-600">${row.revenue.toLocaleString()}</td>
                      <td className="text-right py-3 px-4 font-semibold">{row.roas}x</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}
    </div>
  );
}
