'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Pause, Trash2, Plus, Edit2 } from 'lucide-react';

interface Activity {
  id: string;
  campaignId: string;
  type: 'created' | 'paused' | 'resumed' | 'published' | 'updated' | 'deleted';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

export default function ActivityFeed() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchActivities();
    const interval = setInterval(fetchActivities, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = async () => {
    try {
      const response = await fetch('/api/events?limit=10');
      const data = await response.json();

      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    const iconMap: Record<string, any> = {
      created: Plus,
      paused: Pause,
      resumed: CheckCircle,
      published: CheckCircle,
      updated: Edit2,
      deleted: Trash2,
    };
    return iconMap[type];
  };

  const getActivityColor = (type: string) => {
    const colorMap: Record<string, string> = {
      created: 'bg-blue-100 text-blue-700',
      paused: 'bg-yellow-100 text-yellow-700',
      resumed: 'bg-green-100 text-green-700',
      published: 'bg-green-100 text-green-700',
      updated: 'bg-purple-100 text-purple-700',
      deleted: 'bg-red-100 text-red-700',
    };
    return colorMap[type] || 'bg-gray-100 text-gray-700';
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">Loading activity...</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>

      {activities.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No activity yet</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => {
            const IconComponent = getActivityIcon(activity.type);
            const colorClass = getActivityColor(activity.type);

            return (
              <div key={activity.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                <div className={`flex-shrink-0 p-2 rounded-lg ${colorClass}`}>
                  {IconComponent ? <IconComponent className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm">{activity.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
