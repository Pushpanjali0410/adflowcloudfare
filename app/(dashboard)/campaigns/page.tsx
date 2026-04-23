'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Search, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import CampaignsList from '@/components/campaigns/campaigns-list';
import type { Campaign } from '@/lib/types';

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCampaigns(currentPage);
  }, [currentPage]);

  const fetchCampaigns = async (page: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/campaigns?page=${page}&pageSize=10`);
      const data = await response.json();

      if (data.success) {
        setCampaigns(data.data.data);
        setTotalPages(Math.ceil(data.data.total / 10));
      }
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-muted-foreground mt-1">Manage all your ad campaigns in one place</p>
        </div>
        <Link href="/campaigns/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search campaigns..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Campaigns List */}
      {isLoading ? (
        <Card className="p-8 text-center text-muted-foreground">
          Loading campaigns...
        </Card>
      ) : filteredCampaigns.length > 0 ? (
        <>
          <CampaignsList campaigns={filteredCampaigns} />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="outline"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-muted-foreground mb-4">No campaigns found</p>
          <Link href="/campaigns/new">
            <Button>Create Your First Campaign</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
