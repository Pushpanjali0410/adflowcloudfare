import { Card } from '@/components/ui/card';
import { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
}

export default function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
        </div>
        <div className="text-muted-foreground">{icon}</div>
      </div>
      {trend && <p className="text-xs text-muted-foreground">{trend}</p>}
    </Card>
  );
}
