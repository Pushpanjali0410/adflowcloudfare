'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, TrendingUp, Zap, Eye } from 'lucide-react';
import StatCard from '@/components/dashboard/stat-card';
import CampaignsList from '@/components/campaigns/campaigns-list';
import ActivityFeed from '@/components/dashboard/activity-feed';
import type { Campaign } from '@/lib/types';

export default function DashboardPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState({
    activeCampaigns: 0,
    totalSpend: 0,
    totalImpressions: 0,
    avgRoas: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/campaigns?page=1&pageSize=5');
        const data = await response.json();

        if (data.success) {
          setCampaigns(data.data.data);
          setStats({
            activeCampaigns: data.data.data.filter((c: Campaign) => c.status === 'active').length,
            totalSpend: data.data.data.reduce((sum: number, c: Campaign) => sum + c.budget, 0),
            totalImpressions: 325000,
            avgRoas: 3.8,
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="p-8 space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          icon={<Zap className="w-6 h-6 text-blue-500" />}
          trend={`${stats.activeCampaigns} active`}
        />
        <StatCard
          title="Total Spend"
          value={`$${(stats.totalSpend / 1000).toFixed(1)}K`}
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          trend="This month"
        />
        <StatCard
          title="Total Impressions"
          value={`${(stats.totalImpressions / 1000).toFixed(0)}K`}
          icon={<Eye className="w-6 h-6 text-purple-500" />}
          trend="Across platforms"
        />
        <StatCard
          title="Avg ROAS"
          value={`${stats.avgRoas.toFixed(2)}x`}
          icon={<BarChart3 className="w-6 h-6 text-orange-500" />}
          trend="Return on spend"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Campaigns - 2 cols */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Campaigns</h2>
          <Link href="/campaigns">
            <Button>View All</Button>
          </Link>
        </div>

            {isLoading ? (
              <Card className="p-8 text-center text-muted-foreground">
                Loading campaigns...
              </Card>
            ) : campaigns.length > 0 ? (
              <CampaignsList campaigns={campaigns} />
            ) : (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No campaigns yet</p>
                <Link href="/campaigns">
                  <Button>Create Your First Campaign</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>

        {/* Activity Feed - 1 col */}
        <div>
          <ActivityFeed />
        </div>
      </div>

      {/* Quick Start */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-8">
        <h3 className="text-xl font-bold mb-2">Ready to launch your first campaign?</h3>
        <p className="mb-6 text-blue-100">
          Connect your ad platforms and create campaigns across all channels in minutes.
        </p>
        <div className="flex gap-4">
          <Link href="/campaigns">
            <Button variant="secondary">Create Campaign</Button>
          </Link>
          <Link href="/settings">
            <Button variant="outline" className="text-white border-white hover:bg-white/10">
              Connect Platforms
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
