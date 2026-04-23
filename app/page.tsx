'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Sparkles, BarChart3, Zap, Globe, TrendingUp } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 2000) // 2 second timeout
      
      const response = await fetch('/api/auth/me', { signal: controller.signal })
      clearTimeout(timeoutId)
      
      if (response.ok) {
        setIsAuthenticated(true)
      }
    } catch (error) {
      // Silently fail if auth check times out or fails
      console.log('[v0] Auth check skipped')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (isAuthenticated) {
    router.push('/dashboard')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      {/* Navigation */}
      <nav className="border-b border-border/50 backdrop-blur-sm sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              AdsSaaS
            </span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Manage All Your Ads in One Place
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Launch, optimize, and scale your advertising campaigns across 16+ platforms with AI-powered insights and real-time analytics.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                <Sparkles className="h-5 w-5" />
                Start Free Trial
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Globe className="h-8 w-8 text-primary" />,
              title: '16+ Platform Support',
              description: 'Manage Meta, Google Ads, TikTok, LinkedIn, X and more from one dashboard',
            },
            {
              icon: <Sparkles className="h-8 w-8 text-primary" />,
              title: 'AI-Powered Optimization',
              description: 'Generate ad copy, optimize budgets, and find the best posting times automatically',
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-primary" />,
              title: 'Real-Time Analytics',
              description: 'Track performance metrics across all platforms with comprehensive dashboards',
            },
            {
              icon: <Zap className="h-8 w-8 text-primary" />,
              title: 'Bulk Campaign Creation',
              description: 'Create multiple campaigns at once and scale your advertising effortlessly',
            },
            {
              icon: <BarChart3 className="h-8 w-8 text-primary" />,
              title: 'A/B Testing',
              description: 'Test different variations and find the winning ad versions quickly',
            },
            {
              icon: <TrendingUp className="h-8 w-8 text-primary" />,
              title: 'Smart Budget Allocation',
              description: 'Let AI recommend the best budget distribution across your platforms',
            },
          ].map((feature, idx) => (
            <Card
              key={idx}
              className="p-6 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-8 text-center py-16 border-y border-border/50">
          <div>
            <p className="text-4xl font-bold text-primary mb-2">16+</p>
            <p className="text-muted-foreground">Platform Integrations</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-secondary mb-2">10,000+</p>
            <p className="text-muted-foreground">Active Users</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-primary mb-2">$100M+</p>
            <p className="text-muted-foreground">Ad Spend Managed</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-secondary mb-2">3.5x</p>
            <p className="text-muted-foreground">Average ROI</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Card className="p-12 text-center border-primary/30 bg-gradient-to-br from-primary/5 to-secondary/5">
          <h2 className="text-3xl font-bold mb-4">Ready to Revolutionize Your Advertising?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of marketers managing their entire ad spend on AdsSaaS
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Start Your Free Trial Today
            </Button>
          </Link>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 text-center text-muted-foreground">
        <p>&copy; 2024 AdsSaaS. All rights reserved. Made with ❤️</p>
      </footer>
    </div>
  )
}
