'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LogOut, Menu } from 'lucide-react';
import type { User } from '@/lib/types';

interface HeaderProps {
  user: User;
}

export default function Header({ user }: HeaderProps) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header className="bg-background border-b border-border px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Menu className="w-5 h-5 md:hidden text-muted-foreground" />
        <div>
          <h2 className="text-lg font-semibold">Welcome back, {user.name}</h2>
          <p className="text-sm text-muted-foreground">Manage your ad campaigns across all platforms</p>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleLogout}
        className="flex items-center gap-2"
      >
        <LogOut className="w-4 h-4" />
        Logout
      </Button>
    </header>
  );
}
