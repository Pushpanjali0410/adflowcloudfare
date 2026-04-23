'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { LinkIcon, CheckCircle, AlertCircle, Zap, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { PLATFORMS } from '@/lib/constants';
import type { PlatformAccount, PlatformType } from '@/lib/types';

export default function SettingsPage() {
  const [platformAccounts, setPlatformAccounts] = useState<PlatformAccount[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectingPlatform, setConnectingPlatform] = useState<string | null>(null);
  const [userSettings, setUserSettings] = useState({
    email: 'demo@example.com',
    name: 'Demo User',
    apiKey: '***',
  });

  useEffect(() => {
    fetchPlatformAccounts();
  }, []);

  const fetchPlatformAccounts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/platforms/accounts');
      const data = await response.json();

      if (data.success) {
        setPlatformAccounts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch platform accounts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConnectPlatform = async (platform: string) => {
    setConnectingPlatform(platform);

    try {
      const response = await fetch('/api/platforms/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform }),
      });

      const data = await response.json();

      if (data.success) {
        // In a real app, this would redirect to the OAuth URL
        toast.success(`${PLATFORMS[platform as PlatformType].name} connection initiated!`);
        
        // Add mock account
        const newAccount: PlatformAccount = {
          id: 'acc_' + Date.now(),
          userId: 'user_123',
          platform: platform as PlatformType,
          accountName: `${PLATFORMS[platform as PlatformType].name} Account`,
          externalAccountId: 'ext_' + Math.random().toString(36).substr(2, 9),
          accessToken: 'token_' + Math.random().toString(36).substr(2, 9),
          isConnected: true,
          lastSyncedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        setPlatformAccounts([...platformAccounts, newAccount]);
      }
    } catch (error) {
      toast.error('Failed to connect platform');
    } finally {
      setConnectingPlatform(null);
    }
  };

  const handleDisconnect = (accountId: string) => {
    setPlatformAccounts(
      platformAccounts.filter((acc) => acc.id !== accountId)
    );
    toast.success('Platform disconnected');
  };

  const connectedPlatforms = new Set(platformAccounts.map((acc) => acc.platform));
  const availablePlatforms = (Object.keys(PLATFORMS) as PlatformType[]).filter(
    (p) => !connectedPlatforms.has(p)
  );

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
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and platform connections</p>
      </div>

      {/* Account Settings */}
      <Card className="p-8">
        <h2 className="text-xl font-bold mb-6">Account Settings</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input value={userSettings.name} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <Input value={userSettings.email} disabled />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">API Key</label>
            <div className="flex gap-2">
              <Input value={userSettings.apiKey} disabled />
              <Button variant="outline">Copy</Button>
            </div>
          </div>

          <Button>Update Settings</Button>
        </div>
      </Card>

      {/* Connected Platforms */}
      <Card className="p-8">
        <h2 className="text-xl font-bold mb-6">Connected Platforms</h2>

        {platformAccounts.length > 0 ? (
          <div className="space-y-4">
            {platformAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">
                    {PLATFORMS[account.platform].icon}
                  </div>
                  <div>
                    <p className="font-semibold">{PLATFORMS[account.platform].name}</p>
                    <p className="text-sm text-muted-foreground">{account.accountName}</p>
                    <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                      <CheckCircle className="w-3 h-3" />
                      Connected
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-200"
                  onClick={() => handleDisconnect(account.id)}
                >
                  Disconnect
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No platforms connected yet
          </p>
        )}
      </Card>

      {/* Available Platforms */}
      {availablePlatforms.length > 0 && (
        <Card className="p-8">
          <h2 className="text-xl font-bold mb-6">Connect New Platforms</h2>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {availablePlatforms.map((platform) => (
              <div key={platform} className="relative">
                <button
                  onClick={() => handleConnectPlatform(platform)}
                  disabled={connectingPlatform === platform}
                  className="w-full p-6 border-2 border-dashed rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors disabled:opacity-50"
                >
                  <div className="text-3xl mb-2">{PLATFORMS[platform].icon}</div>
                  <p className="text-sm font-medium text-center line-clamp-2">
                    {PLATFORMS[platform].name}
                  </p>
                  {connectingPlatform === platform && (
                    <p className="text-xs text-blue-600 mt-2">Connecting...</p>
                  )}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-700">
              <p className="font-semibold mb-1">OAuth Integration Required</p>
              <p>
                To connect your ad platforms, you&apos;ll need to authenticate with each platform&apos;s OAuth provider. Your tokens are securely stored and never shared.
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Danger Zone */}
      <Card className="p-8 border-red-200">
        <h2 className="text-xl font-bold mb-6 text-red-600">Danger Zone</h2>

        <div className="space-y-4">
          <div className="p-4 border border-red-200 rounded-lg">
            <p className="font-semibold mb-2">Delete Account</p>
            <p className="text-sm text-muted-foreground mb-4">
              This action cannot be undone. All your campaigns, analytics, and data will be permanently deleted.
            </p>
            <Button variant="outline" className="text-red-600 border-red-200">
              Delete Account
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
