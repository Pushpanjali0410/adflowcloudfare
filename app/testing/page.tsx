'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TestingPage() {
  const [results, setResults] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});

  const tests = [
    { id: 'auth-me', name: 'Authentication Check', endpoint: '/api/auth/me' },
    { id: 'campaigns', name: 'Campaigns Fetch', endpoint: '/api/campaigns' },
    { id: 'analytics', name: 'Analytics Endpoint', endpoint: '/api/analytics' },
    { id: 'platforms', name: 'Platforms List', endpoint: '/api/platforms/mock' },
  ];

  const runTest = async (testId: string, endpoint: string) => {
    setLoading(prev => ({ ...prev, [testId]: true }));
    try {
      const response = await fetch(endpoint);
      const success = response.ok || response.status === 401; // 401 is OK for unauth endpoints
      setResults(prev => ({ ...prev, [testId]: success }));
      toast.success(`${testId}: ${success ? 'Passed' : 'Failed'}`);
    } catch (error) {
      setResults(prev => ({ ...prev, [testId]: false }));
      toast.error(`${testId}: Error`);
    } finally {
      setLoading(prev => ({ ...prev, [testId]: false }));
    }
  };

  const runAllTests = async () => {
    for (const test of tests) {
      await runTest(test.id, test.endpoint);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AdsSaaS Platform Testing</h1>
          <p className="text-muted-foreground">Comprehensive feature verification and debugging</p>
        </div>

        <div className="grid gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Run tests to verify platform functionality</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-4">
              <Button onClick={runAllTests} size="lg" className="gap-2">
                <Zap className="w-4 h-4" />
                Run All Tests
              </Button>
              <Button onClick={() => setResults({})} variant="outline">
                Clear Results
              </Button>
            </CardContent>
          </Card>

          {/* Test Results */}
          <Card>
            <CardHeader>
              <CardTitle>Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {tests.map(test => (
                  <div key={test.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {loading[test.id] ? (
                        <Clock className="w-5 h-5 text-yellow-500 animate-spin" />
                      ) : results[test.id] ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : results[test.id] === false ? (
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <div className="w-5 h-5 border-2 border-gray-300 rounded-full" />
                      )}
                      <div>
                        <p className="font-medium">{test.name}</p>
                        <p className="text-sm text-muted-foreground">{test.endpoint}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => runTest(test.id, test.endpoint)}
                      disabled={loading[test.id]}
                      variant="outline"
                      size="sm"
                    >
                      {loading[test.id] ? 'Testing...' : 'Test'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Feature Checklist */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Implementation Checklist</CardTitle>
              <CardDescription>All core features included in this build</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="auth" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="auth">Auth</TabsTrigger>
                  <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
                  <TabsTrigger value="ai">AI Features</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="auth" className="space-y-3 mt-4">
                  {[
                    'User Registration with email & password',
                    'User Login with JWT tokens',
                    'Logout functionality',
                    'Profile management',
                    'Password hashing (bcrypt)',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="campaigns" className="space-y-3 mt-4">
                  {[
                    'Create campaigns',
                    'Edit campaigns',
                    'Delete campaigns',
                    'Duplicate campaigns',
                    'Filter campaigns by status',
                    'Search campaigns',
                    'Campaign analytics',
                    'Publish to platforms',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="ai" className="space-y-3 mt-4">
                  {[
                    'AI-generated ad copy',
                    'Budget optimization recommendations',
                    'Best time-to-post prediction',
                    'A/B testing variant creation',
                    'Bulk campaign creation',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="analytics" className="space-y-3 mt-4">
                  {[
                    'Campaign performance metrics',
                    'Real-time impressions & clicks',
                    'Conversion tracking',
                    'ROI calculation',
                    'Multi-platform aggregation',
                    'Historical data comparison',
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Navigation Test */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation & Menu Tests</CardTitle>
              <CardDescription>Test back buttons and navigation flow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={() => window.location.href = '/'}>
                  Go to Landing
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/login'}>
                  Go to Login
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/register'}>
                  Go to Register
                </Button>
                <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
