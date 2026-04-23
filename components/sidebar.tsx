'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Zap,
  BarChart3,
  Settings,
  PlusCircle,
  Plug,
  Brain,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/dashboard/campaigns', icon: Zap, label: 'Campaigns' },
  { href: '/dashboard/create-campaign', icon: PlusCircle, label: 'New Campaign' },
  { href: '/dashboard/platforms', icon: Plug, label: 'Platforms' },
  { href: '/dashboard/ai-features', icon: Brain, label: 'AI Features' },
  { href: '/dashboard/ab-testing', icon: BarChart3, label: 'A/B Testing' },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/dashboard/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`border-r bg-background transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b">
        {isOpen && <span className="font-semibold text-primary">Menu</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto"
        >
          <ChevronLeft className={`w-4 h-4 transition-transform ${!isOpen ? 'rotate-180' : ''}`} />
        </Button>
      </div>

      <nav className="p-4 space-y-2">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-accent text-foreground'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {isOpen && (
        <div className="absolute bottom-4 left-4 right-4 bg-accent/50 rounded-lg p-4">
          <p className="text-xs font-medium text-foreground/70">
            🚀 <strong>Pro Tip:</strong> Use keyboard shortcuts for faster navigation!
          </p>
        </div>
      )}
    </div>
  );
}
