'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit2, Trash2, Play, Pause, AlertCircle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PLATFORMS, CAMPAIGN_STATUS } from '@/lib/constants';
import type { Campaign } from '@/lib/types';

interface CampaignsListProps {
  campaigns: Campaign[];
  onCampaignChange?: () => void;
}

export default function CampaignsList({ campaigns, onCampaignChange }: CampaignsListProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [localCampaigns, setLocalCampaigns] = useState(campaigns);

  const getStatusColor = (status: string) => {
    const statusConfig = CAMPAIGN_STATUS.find((s) => s.value === status);
    return statusConfig?.color || 'bg-gray-100';
  };

  const logEvent = async (campaignId: string, type: string, title: string, description: string) => {
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          campaignId,
          type,
          title,
          description,
          icon: type === 'paused' ? '⏸️' : type === 'resumed' ? '▶️' : '🗑️',
        }),
      });
    } catch (error) {
      console.error('Failed to log event:', error);
    }
  };

  const handlePause = async (campaign: Campaign) => {
    setLoading(campaign.id);
    try {
      const response = await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: campaign.id,
          status: 'paused',
          name: campaign.name,
          objective: campaign.objective,
          description: campaign.description,
          budget: campaign.budget,
          startDate: campaign.startDate,
          platforms: campaign.platforms,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLocalCampaigns(
          localCampaigns.map((c) => (c.id === campaign.id ? { ...c, status: 'paused' } : c))
        );
        await logEvent(campaign.id, 'paused', 'Campaign Paused', `"${campaign.name}" has been paused`);
        toast.success('Campaign paused successfully');
        onCampaignChange?.();
      } else {
        toast.error('Failed to pause campaign');
      }
    } catch (error) {
      toast.error('Error pausing campaign');
    } finally {
      setLoading(null);
    }
  };

  const handleResume = async (campaign: Campaign) => {
    setLoading(campaign.id);
    try {
      const response = await fetch('/api/campaigns', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: campaign.id,
          status: 'active',
          name: campaign.name,
          objective: campaign.objective,
          description: campaign.description,
          budget: campaign.budget,
          startDate: campaign.startDate,
          platforms: campaign.platforms,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setLocalCampaigns(
          localCampaigns.map((c) => (c.id === campaign.id ? { ...c, status: 'active' } : c))
        );
        await logEvent(campaign.id, 'resumed', 'Campaign Resumed', `"${campaign.name}" is now active`);
        toast.success('Campaign resumed successfully');
        onCampaignChange?.();
      } else {
        toast.error('Failed to resume campaign');
      }
    } catch (error) {
      toast.error('Error resuming campaign');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (campaign: Campaign) => {
    if (!confirm(`Are you sure you want to delete "${campaign.name}"?`)) return;

    setLoading(campaign.id);
    try {
      const response = await fetch(`/api/campaigns?id=${campaign.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setLocalCampaigns(localCampaigns.filter((c) => c.id !== campaign.id));
        await logEvent(campaign.id, 'deleted', 'Campaign Deleted', `"${campaign.name}" has been deleted`);
        toast.success('Campaign deleted successfully');
        onCampaignChange?.();
      } else {
        toast.error('Failed to delete campaign');
      }
    } catch (error) {
      toast.error('Error deleting campaign');
    } finally {
      setLoading(null);
    }
  };

  if (localCampaigns.length === 0) {
    return (
      <Card className="p-12 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-lg font-semibold mb-2">No campaigns yet</p>
        <p className="text-muted-foreground mb-6">Create your first campaign to get started</p>
        <Link href="/campaigns/new">
          <Button>Create Campaign</Button>
        </Link>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {localCampaigns.map((campaign) => (
        <Card key={campaign.id} className="p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-lg font-semibold">{campaign.name}</h3>
                <Badge className={`${getStatusColor(campaign.status)} text-gray-800`}>
                  {campaign.status === 'active' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {campaign.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-4">{campaign.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {campaign.platforms.map((platform) => {
                  const platformInfo = PLATFORMS[platform];
                  return (
                    <Badge key={platform} variant="secondary">
                      {platformInfo.icon} {platformInfo.name}
                    </Badge>
                  );
                })}
              </div>

              <div className="flex gap-6 text-sm">
                <div>
                  <span className="text-muted-foreground">Budget: </span>
                  <span className="font-semibold">${campaign.budget}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Platforms: </span>
                  <span className="font-semibold">{campaign.platforms.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Created: </span>
                  <span className="font-semibold">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              {campaign.status === 'draft' && (
                <>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Button size="sm" variant="outline" disabled={loading !== null}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                  </Link>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => handleResume(campaign)}
                    disabled={loading !== null}
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </>
              )}
              {campaign.status === 'active' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-yellow-600 border-yellow-200 hover:bg-yellow-50"
                  onClick={() => handlePause(campaign)}
                  disabled={loading !== null}
                >
                  <Pause className="w-4 h-4" />
                </Button>
              )}
              {campaign.status === 'paused' && (
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-600 border-green-200 hover:bg-green-50"
                  onClick={() => handleResume(campaign)}
                  disabled={loading !== null}
                >
                  <Play className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleDelete(campaign)}
                disabled={loading !== null}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
