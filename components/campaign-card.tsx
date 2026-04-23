'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Copy } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import toast from 'react-hot-toast';

interface CampaignCardProps {
  campaign: {
    id: string;
    name: string;
    status: string;
    platforms: string[];
    budget: number;
    spent?: number;
    impressions?: number;
    clicks?: number;
    conversions?: number;
    created_at: string;
  };
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

export function CampaignCard({ campaign, onDelete, onDuplicate }: CampaignCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete(campaign.id);
        toast.success('Campaign deleted');
      }
    } catch (error) {
      toast.error('Failed to delete campaign');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      if (onDuplicate) {
        await onDuplicate(campaign.id);
        toast.success('Campaign duplicated');
      }
    } catch (error) {
      toast.error('Failed to duplicate campaign');
    } finally {
      setIsDuplicating(false);
    }
  };

  const ctr =
    campaign.clicks && campaign.impressions
      ? ((campaign.clicks / campaign.impressions) * 100).toFixed(2)
      : '0';
  const spent = campaign.spent || 0;
  const roi =
    spent > 0 && campaign.conversions
      ? (((campaign.conversions - spent) / spent) * 100).toFixed(0)
      : '0';

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <Link href={`/dashboard/campaigns/${campaign.id}`} className="flex-1">
          <h3 className="font-semibold text-lg hover:text-primary transition-colors truncate">
            {campaign.name}
          </h3>
        </Link>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge className={getStatusColor(campaign.status)}>
          {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
        </Badge>
        {campaign.platforms.map(platform => (
          <Badge key={platform} variant="outline" className="text-xs">
            {platform}
          </Badge>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground">Budget</p>
          <p className="font-semibold">${campaign.budget.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Spent</p>
          <p className="font-semibold">${spent.toLocaleString()}</p>
        </div>
        {campaign.impressions && (
          <div>
            <p className="text-xs text-muted-foreground">Impressions</p>
            <p className="font-semibold">{campaign.impressions.toLocaleString()}</p>
          </div>
        )}
        {campaign.clicks && (
          <div>
            <p className="text-xs text-muted-foreground">CTR</p>
            <p className="font-semibold">{ctr}%</p>
          </div>
        )}
      </div>

      {campaign.conversions !== undefined && (
        <div className="pt-4 border-t mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Conversions</p>
              <p className="font-semibold">{campaign.conversions}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">ROI</p>
              <p className="font-semibold text-green-600">{roi}%</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 pt-4 border-t">
        <Link href={`/dashboard/campaigns/${campaign.id}`} className="flex-1">
          <Button variant="outline" size="sm" className="w-full">
            <Eye className="w-4 h-4 mr-2" />
            View
          </Button>
        </Link>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Copy className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Duplicate Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              This will create a copy of this campaign. You can edit it after creation.
            </AlertDialogDescription>
            <div className="flex gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDuplicate} disabled={isDuplicating}>
                {isDuplicating ? 'Duplicating...' : 'Duplicate'}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this campaign? This action cannot be undone.
            </AlertDialogDescription>
            <div className="flex gap-3">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </div>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Card>
  );
}
