'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { TopNav } from '@/components/top-nav';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChevronLeft, Play, Pause, Copy, Trash2, Brain, Zap, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  currency: string;
  objective: string;
  target_platforms: string;
  created_at: string;
  published_at?: string;
}

const mockAnalytics = [
  { date: 'Jan 1', impressions: 1200, clicks: 120, conversions: 30 },
  { date: 'Jan 2', impressions: 1900, clicks: 221, conversions: 52 },
  { date: 'Jan 3', impressions: 1600, clicks: 229, conversions: 48 },
  { date: 'Jan 4', impressions: 2200, clicks: 200, conversions: 59 },
  { date: 'Jan 5', impressions: 2290, clicks: 210, conversions: 65 },
  { date: 'Jan 6', impressions: 2000, clicks: 229, conversions: 72 },
  { date: 'Jan 7', impressions: 2181, clicks: 200, conversions: 81 },
];

export default function CampaignDetailPage() {
  const router = useRouter();
  const params = useParams();
  const campaignId = params.id as string;
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActing, setIsActing] = useState(false);

  useEffect(() => {
    fetchCampaign();
  }, [campaignId]);

  const fetchCampaign = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`);
      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch campaign:', error);
      toast.error('Failed to load campaign');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    setIsActing(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const data = await response.json();
        setCampaign(data.campaign);
        toast.success(`Campaign ${newStatus}`);
      } else {
        toast.error('Failed to update campaign');
      }
    } catch (error) {
      toast.error('Error updating campaign');
    } finally {
      setIsActing(false);
    }
  };

  const handleDuplicate = async () => {
    if (!campaign) return;
    setIsActing(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}/duplicate`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Campaign duplicated!');
        router.push(`/dashboard/campaigns/${data.campaign.id}`);
      } else {
        toast.error('Failed to duplicate campaign');
      }
    } catch (error) {
      toast.error('Error duplicating campaign');
    } finally {
      setIsActing(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    setIsActing(true);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Campaign deleted');
        router.push('/dashboard/campaigns');
      } else {
        toast.error('Failed to delete campaign');
      }
    } catch (error) {
      toast.error('Error deleting campaign');
    } finally {
      setIsActing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Loading campaign...</p>
          </main>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="flex-1 flex items-center justify-center">
            <p className="text-muted-foreground">Campaign not found</p>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-auto">
          <div className="p-8 space-y-8">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => router.back()}
                  className="w-10 h-10"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">{campaign.name}</h1>
                  <p className="text-muted-foreground mt-1">{campaign.description}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {campaign.status === 'draft' && (
                  <Button
                    onClick={() => handleStatusChange('active')}
                    disabled={isActing}
                    className="gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Launch
                  </Button>
                )}
                {campaign.status === 'active' && (
                  <Button
                    onClick={() => handleStatusChange('paused')}
                    disabled={isActing}
                    variant="outline"
                    className="gap-2"
                  >
                    <Pause className="w-4 h-4" />
                    Pause
                  </Button>
                )}
                <Button
                  onClick={handleDuplicate}
                  disabled={isActing}
                  variant="outline"
                  className="gap-2"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={isActing}
                  variant="destructive"
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">${campaign.budget}</div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold capitalize">{campaign.status}</div>
                  <p className="text-sm text-muted-foreground">Status</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold capitalize">{campaign.objective}</div>
                  <p className="text-sm text-muted-foreground">Objective</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">{campaign.target_platforms?.split(',').length || 0}</div>
                  <p className="text-sm text-muted-foreground">Platforms</p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="analytics" className="space-y-4">
              <TabsList className="grid grid-cols-4">
                <TabsTrigger value="analytics" className="gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Analytics
                </TabsTrigger>
                <TabsTrigger value="ai-suggestions" className="gap-2">
                  <Brain className="w-4 h-4" />
                  AI Suggestions
                </TabsTrigger>
                <TabsTrigger value="variants" className="gap-2">
                  <Zap className="w-4 h-4" />
                  Variants
                </TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
              </TabsList>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={mockAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="impressions" stroke="#3b82f6" />
                        <Line type="monotone" dataKey="clicks" stroke="#10b981" />
                        <Line type="monotone" dataKey="conversions" stroke="#f59e0b" />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockAnalytics}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="impressions" fill="#3b82f6" />
                        <Bar dataKey="clicks" fill="#10b981" />
                        <Bar dataKey="conversions" fill="#f59e0b" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* AI Suggestions Tab */}
              <TabsContent value="ai-suggestions" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="w-5 h-5 text-primary" />
                      AI Suggestions
                    </CardTitle>
                    <CardDescription>Powered by advanced AI models</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 border rounded-lg bg-accent/50">
                      <h4 className="font-semibold mb-2">Budget Optimization</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Increasing your budget by 25% could improve conversions by up to 40% based on current performance trends.
                      </p>
                      <Button size="sm" onClick={() => toast.success('Budget optimized!')}>
                        Apply Recommendation
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg bg-accent/50">
                      <h4 className="font-semibold mb-2">Best Time to Post</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Your audience is most engaged on Tuesday and Thursday between 2-4 PM. Consider scheduling posts at these times.
                      </p>
                      <Button size="sm" onClick={() => toast.success('Schedule updated!')}>
                        Apply Recommendation
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg bg-accent/50">
                      <h4 className="font-semibold mb-2">Ad Copy Suggestions</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Here are AI-generated ad copies that typically perform better with your audience:
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm italic">• "Limited time offer: Transform your business in 30 days"</p>
                        <p className="text-sm italic">• "Join 1000+ successful entrepreneurs using our platform"</p>
                      </div>
                      <Button size="sm" className="mt-3" onClick={() => toast.success('Copy generated!')}>
                        Generate More Copies
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Variants Tab */}
              <TabsContent value="variants" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>A/B Test Variants</CardTitle>
                    <CardDescription>Create and test different ad variations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="gap-2">
                      <Zap className="w-4 h-4" />
                      Create New Variant
                    </Button>
                    <p className="text-sm text-muted-foreground mt-4">No variants created yet</p>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Schedule Tab */}
              <TabsContent value="schedule" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Scheduled Posts</CardTitle>
                    <CardDescription>View and manage scheduled posts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">No scheduled posts yet</p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}
