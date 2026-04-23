import type { PlatformType, RetryConfig } from './types';

export const PLATFORMS: Record<PlatformType, { name: string; icon: string; color: string }> = {
  meta: { name: 'Meta (Facebook/Instagram)', icon: '📘', color: '#1877F2' },
  google_ads: { name: 'Google Ads', icon: '🔍', color: '#4285F4' },
  tiktok: { name: 'TikTok Ads', icon: '🎵', color: '#000000' },
  linkedin: { name: 'LinkedIn Ads', icon: '💼', color: '#0A66C2' },
  pinterest: { name: 'Pinterest Ads', icon: '📌', color: '#E60023' },
  snapchat: { name: 'Snapchat Ads', icon: '👻', color: '#FFFC00' },
  twitter: { name: 'Twitter/X Ads', icon: '𝕏', color: '#000000' },
  reddit: { name: 'Reddit Ads', icon: '🤖', color: '#FF4500' },
};

export const RETRY_CONFIG: RetryConfig = {
  maxRetries: 5,
  initialDelayMs: 1000,
  maxDelayMs: 32000,
  backoffMultiplier: 2,
};

export const CAMPAIGN_OBJECTIVES = [
  { value: 'awareness', label: 'Brand Awareness', icon: '👁️' },
  { value: 'consideration', label: 'Consideration', icon: '🤔' },
  { value: 'conversion', label: 'Conversion', icon: '🎯' },
  { value: 'engagement', label: 'Engagement', icon: '💬' },
];

export const CAMPAIGN_STATUS = [
  { value: 'draft', label: 'Draft', color: 'bg-slate-100' },
  { value: 'active', label: 'Active', color: 'bg-green-100' },
  { value: 'paused', label: 'Paused', color: 'bg-yellow-100' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-100' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-100' },
];

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const CLOUDFLARE_API_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_API_URL || 'http://localhost:8787';

export const MOCK_RETRY_SCENARIOS = [
  { platform: 'meta', successRate: 0.95, avgDelayMs: 200 },
  { platform: 'google_ads', successRate: 0.97, avgDelayMs: 150 },
  { platform: 'tiktok', successRate: 0.92, avgDelayMs: 300 },
  { platform: 'linkedin', successRate: 0.98, avgDelayMs: 250 },
];
