// User & Auth
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// Platform Support
export type PlatformType = 
  | 'meta' 
  | 'google_ads' 
  | 'tiktok' 
  | 'linkedin' 
  | 'pinterest' 
  | 'snapchat' 
  | 'twitter' 
  | 'reddit';

export interface PlatformAccount {
  id: string;
  userId: string;
  platform: PlatformType;
  accountName: string;
  externalAccountId: string;
  accessToken: string;
  refreshToken?: string;
  tokenExpiry?: string;
  isConnected: boolean;
  lastSyncedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Campaign
export type CampaignStatus = 'draft' | 'active' | 'paused' | 'archived' | 'completed';
export type CampaignObjective = 'awareness' | 'consideration' | 'conversion' | 'engagement';

export interface Campaign {
  id: string;
  userId: string;
  name: string;
  objective: CampaignObjective;
  description?: string;
  budget: number;
  startDate: string;
  endDate?: string;
  status: CampaignStatus;
  platforms: PlatformType[];
  templateId?: string;
  createdAt: string;
  updatedAt: string;
}

// Ad Variant
export interface AdVariant {
  id: string;
  campaignId: string;
  platform: PlatformType;
  headline: string;
  description: string;
  callToAction: string;
  mediaUrl?: string;
  landingUrl: string;
  variantName: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Analytics
export interface PlatformAnalytics {
  campaignId: string;
  platform: PlatformType;
  impressions: number;
  clicks: number;
  conversions: number;
  spend: number;
  revenue: number;
  ctr: number;
  cpc: number;
  cpm: number;
  conversionRate: number;
  roas: number;
  updatedAt: string;
}

export interface CampaignAnalytics {
  campaignId: string;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  totalSpend: number;
  totalRevenue: number;
  avgCtr: number;
  avgCpc: number;
  avgCpm: number;
  avgConversionRate: number;
  avgRoas: number;
  platformMetrics: Record<PlatformType, PlatformAnalytics>;
  updatedAt: string;
}

// Templates
export interface CampaignTemplate {
  id: string;
  userId: string;
  name: string;
  description?: string;
  objective: CampaignObjective;
  platforms: PlatformType[];
  budget: number;
  adVariantTemplates: AdVariantTemplate[];
  createdAt: string;
  updatedAt: string;
}

export interface AdVariantTemplate {
  id: string;
  templateId: string;
  platform: PlatformType;
  headline: string;
  description: string;
  callToAction: string;
}

// AI-Generated Content
export interface GeneratedAdCopy {
  headline: string;
  description: string;
  callToAction: string;
  platform: PlatformType;
  variations: string[];
}

// Retry & Fallback Configuration
export interface RetryConfig {
  maxRetries: number;
  initialDelayMs: number;
  maxDelayMs: number;
  backoffMultiplier: number;
}

export interface FallbackPlatform {
  primary: PlatformType;
  fallbacks: PlatformType[];
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
