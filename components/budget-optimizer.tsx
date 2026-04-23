'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface BudgetOptimizerProps {
  campaignId?: string;
  onOptimized?: (allocation: any) => void;
}

export function BudgetOptimizer({ campaignId, onOptimized }: BudgetOptimizerProps) {
  const [totalBudget, setTotalBudget] = useState('');
  const [platformData, setPlatformData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleOptimize = async () => {
    if (!totalBudget || parseFloat(totalBudget) <= 0) {
      toast.error('Please enter a valid budget');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/optimize-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ totalBudget: parseFloat(totalBudget), campaignId }),
      });

      if (response.ok) {
        const data = await response.json();
        setPlatformData(data.allocation);
        onOptimized?.(data.allocation);
        toast.success('Budget optimized');
      } else {
        toast.error('Failed to optimize budget');
      }
    } catch (error) {
      toast.error('Error optimizing budget');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Optimizer</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Total Budget ($)</label>
          <Input
            type="number"
            placeholder="5000"
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            disabled={isLoading}
            className="mt-2"
          />
        </div>

        <Button onClick={handleOptimize} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? 'Optimizing...' : 'Optimize Budget'}
        </Button>

        {platformData && (
          <div className="space-y-3 p-4 bg-muted rounded-md">
            <h4 className="font-semibold">Recommended Allocation:</h4>
            {Object.entries(platformData).map(([platform, budget]: [string, any]) => (
              <div key={platform} className="flex justify-between items-center">
                <span className="capitalize">{platform}</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${(budget.amount / parseFloat(totalBudget)) * 100}%` }}
                    />
                  </div>
                  <span className="font-semibold text-sm w-20 text-right">${budget.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
