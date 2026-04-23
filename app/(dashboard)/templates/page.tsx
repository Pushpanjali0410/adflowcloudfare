'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Trash2, ArrowLeft, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { PLATFORMS, CAMPAIGN_OBJECTIVES } from '@/lib/constants';
import type { CampaignTemplate } from '@/lib/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/templates?page=1&pageSize=10');
      const data = await response.json();

      if (data.success) {
        setTemplates(data.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
      toast.error('Failed to load templates');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDuplicate = async (template: CampaignTemplate) => {
    setActionLoading(template.id);
    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${template.name} (Copy)`,
          description: template.description,
          objective: template.objective,
          platforms: template.platforms,
          budget: template.budget,
          adVariantTemplates: template.adVariantTemplates,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setTemplates([...templates, data.data]);
        toast.success('Template duplicated successfully!');
      } else {
        toast.error('Failed to duplicate template');
      }
    } catch (error) {
      toast.error('Error duplicating template');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (template: CampaignTemplate) => {
    if (!confirm(`Are you sure you want to delete "${template.name}"?`)) return;

    setActionLoading(template.id);
    try {
      const response = await fetch(`/api/templates?id=${template.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        setTemplates(templates.filter((t) => t.id !== template.id));
        toast.success('Template deleted successfully');
      } else {
        toast.error('Failed to delete template');
      }
    } catch (error) {
      toast.error('Error deleting template');
    } finally {
      setActionLoading(null);
    }
  };

  const handleCreateFromTemplate = async (template: CampaignTemplate) => {
    try {
      // Redirect to campaign creation with template data
      const templateData = encodeURIComponent(JSON.stringify(template));
      window.location.href = `/campaigns/new?template=${templateData}`;
    } catch (error) {
      toast.error('Error creating campaign from template');
    }
  };

  const getObjectiveLabel = (value: string) => {
    return CAMPAIGN_OBJECTIVES.find((o) => o.value === value)?.label || value;
  };

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
          <h1 className="text-3xl font-bold">Campaign Templates</h1>
          <p className="text-muted-foreground mt-1">Save time by creating campaigns from templates</p>
        </div>
        <Link href="/campaigns/new">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Campaign
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <Card className="p-8 text-center text-muted-foreground">
          Loading templates...
        </Card>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <h3 className="text-lg font-bold">{template.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                </div>

                {/* Objective */}
                <div>
                  <Badge className="bg-blue-100 text-blue-700">
                    {getObjectiveLabel(template.objective)}
                  </Badge>
                </div>

                {/* Platforms */}
                <div>
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    PLATFORMS
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {template.platforms.map((platform) => (
                      <Badge key={platform} variant="secondary">
                        {PLATFORMS[platform].icon}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div className="pt-4 border-t">
                  <p className="text-sm">
                    <span className="text-muted-foreground">Budget: </span>
                    <span className="font-semibold">${template.budget}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                    onClick={() => handleCreateFromTemplate(template)}
                    disabled={actionLoading === template.id}
                  >
                    <Copy className="w-4 h-4" />
                    Use Template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => handleDelete(template)}
                    disabled={actionLoading === template.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-lg font-semibold mb-2">No templates yet</p>
          <p className="text-muted-foreground mb-6">Create campaigns and save them as templates for reuse</p>
          <Link href="/campaigns/new">
            <Button>Create Your First Campaign</Button>
          </Link>
        </Card>
      )}
    </div>
  );
}
