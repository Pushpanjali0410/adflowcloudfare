'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';
import { PLATFORMS, CAMPAIGN_OBJECTIVES } from '@/lib/constants';
import type { CampaignObjective, PlatformType } from '@/lib/types';

export default function NewCampaignPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<PlatformType[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    objective: 'conversion' as CampaignObjective,
    description: '',
    budget: 1000,
    startDate: new Date().toISOString().split('T')[0],
  });

  const handlePlatformToggle = (platform: PlatformType) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Campaign name is required');
      return;
    }

    if (selectedPlatforms.length === 0) {
      toast.error('Please select at least one platform');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          platforms: selectedPlatforms,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success('Campaign created successfully!');
        router.push(`/campaigns/${data.data.id}`);
      } else {
        toast.error(data.error || 'Failed to create campaign');
      }
    } catch (error) {
      toast.error('An error occurred while creating the campaign');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      {/* Header */}
      <Link href="/campaigns">
        <Button variant="ghost" size="sm" className="mb-6 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Campaigns
        </Button>
      </Link>

      <h1 className="text-3xl font-bold mb-8">Create New Campaign</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Campaign Details */}
        <Card className="p-8">
          <h2 className="text-xl font-bold mb-6">Campaign Details</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Campaign Name *</label>
              <Input
                placeholder="e.g., Summer Sale 2024"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Campaign Objective *</label>
              <div className="grid grid-cols-2 gap-4">
                {CAMPAIGN_OBJECTIVES.map((obj) => (
                  <button
                    key={obj.value}
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        objective: obj.value as CampaignObjective,
                      })
                    }
                    className={`p-4 rounded-lg border-2 transition-colors text-left ${
                      formData.objective === obj.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-border hover:border-gray-300'
                    }`}
                  >
                    <div className="text-xl mb-1">{obj.icon}</div>
                    <div className="font-medium text-sm">{obj.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                placeholder="What is this campaign about?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={isLoading}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Budget ($) *</label>
                <Input
                  type="number"
                  min="0"
                  step="100"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: parseInt(e.target.value) })
                  }
                  disabled={isLoading}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Start Date *</label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  disabled={isLoading}
                  required
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Platform Selection */}
        <Card className="p-8">
          <h2 className="text-xl font-bold mb-6">Select Platforms *</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.entries(PLATFORMS) as Array<[PlatformType, any]>).map(
              ([platform, info]) => (
                <button
                  key={platform}
                  type="button"
                  onClick={() => handlePlatformToggle(platform)}
                  className={`p-4 rounded-lg border-2 transition-colors text-center ${
                    selectedPlatforms.includes(platform)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-border hover:border-gray-300'
                  }`}
                >
                  <div className="text-3xl mb-2">{info.icon}</div>
                  <div className="text-sm font-medium">{info.name}</div>
                </button>
              )
            )}
          </div>

          {selectedPlatforms.length > 0 && (
            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground mb-2">Selected platforms:</p>
              <div className="flex flex-wrap gap-2">
                {selectedPlatforms.map((platform) => (
                  <Badge key={platform}>{PLATFORMS[platform].name}</Badge>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* Actions */}
        <div className="flex gap-4">
          <Link href="/campaigns" className="flex-1">
            <Button variant="outline" className="w-full" disabled={isLoading}>
              Cancel
            </Button>
          </Link>
          <Button className="flex-1" disabled={isLoading}>
            {isLoading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </div>
      </form>
    </div>
  );
}
