'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, Settings, Zap, LayoutGrid, Sparkles } from 'lucide-react';
import type { User } from '@/lib/types';

interface SidebarProps {
  user: User;
}

const sidebarLinks = [
  { href: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { href: '/campaigns', icon: Zap, label: 'Campaigns' },
  { href: '/analytics', icon: BarChart3, label: 'Analytics' },
  { href: '/templates', icon: Sparkles, label: 'Templates' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-slate-900 text-white border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          AdFlow
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="text-xs text-slate-400">Logged in as</div>
        <div className="text-sm font-medium text-white mt-1">{user.email}</div>
      </div>
    </aside>
  );
}
