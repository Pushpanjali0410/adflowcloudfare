'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/sidebar';
import { TopNav } from '@/components/top-nav';
import { CampaignCard } from '@/components/campaign-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ChevronLeft, PlusCircle, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import toast from 'react-hot-toast';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  spent?: number;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  created_at: string;
  target_platforms?: string;
}

export default function CampaignsPage() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    fetchCampaigns();
  }, [router]);

  useEffect(() => {
    let filtered = campaigns;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredCampaigns(filtered);
  }, [statusFilter, campaigns, searchQuery]);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/campaigns');
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data.campaigns || []);
      } else if (response.status === 401) {
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      toast.error('Failed to load campaigns');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this campaign?')) return;

    try {
      const response = await fetch(`/api/campaigns/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCampaigns(campaigns.filter(c => c.id !== id));
        toast.success('Campaign deleted');
      } else {
        toast.error('Failed to delete campaign');
      }
    } catch (error) {
      toast.error('Error deleting campaign');
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const response = await fetch('/api/campaigns/duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId: id }),
      });

      if (response.ok) {
        const newCampaign = await response.json();
        setCampaigns([...campaigns, newCampaign]);
        toast.success('Campaign duplicated successfully');
      } else {
        toast.error('Failed to duplicate campaign');
      }
    } catch (error) {
      toast.error('Error duplicating campaign');
    }
  };

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
                  title="Go back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <div>
                  <h1 className="text-3xl font-bold">All Campaigns</h1>
                  <p className="text-muted-foreground mt-1">Manage all your advertising campaigns</p>
                </div>
              </div>
              <Link href="/dashboard/create-campaign">
                <Button className="gap-2">
                  <PlusCircle className="w-4 h-4" />
                  New Campaign
                </Button>
              </Link>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search campaigns..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Campaigns</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Campaigns Grid */}
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading campaigns...</p>
              </div>
            ) : filteredCampaigns.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    {campaigns.length === 0 ? 'No campaigns yet' : 'No campaigns match your filters'}
                  </p>
                  <Link href="/dashboard/create-campaign">
                    <Button>Create Your First Campaign</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCampaigns.map(campaign => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={{
                      ...campaign,
                      platforms: campaign.target_platforms?.split(',').map(p => p.trim()) || [],
                    }}
                    onDelete={handleDelete}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
