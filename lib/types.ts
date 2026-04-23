export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  budget: number;
  spent?: number;
  target_platforms: string;
  creative_id?: string;
  impressions?: number;
  clicks?: number;
  conversions?: number;
  created_at: string;
  updated_at: string;
}

export interface PlatformCredential {
  id: string;
  user_id: string;
  platform: string;
  access_token: string;
  refresh_token?: string;
  expires_at?: string;
  created_at: string;
}

export interface Creative {
  id: string;
  campaign_id: string;
  title: string;
  description: string;
  image_url?: string;
  cta_text: string;
  created_at: string;
}

export interface ABTest {
  id: string;
  campaign_id: string;
  variant_a_id: string;
  variant_b_id: string;
  winning_variant?: string;
  status: 'active' | 'completed';
  metrics: {
    variant_a: { ctr: number; conversions: number; roi: number };
    variant_b: { ctr: number; conversions: number; roi: number };
  };
  created_at: string;
}

export interface PlatformAdapter {
  name: string;
  authenticate(credentials: any): Promise<void>;
  publishCampaign(campaign: Campaign, creative: Creative): Promise<string>;
  getAnalytics(campaignId: string): Promise<any>;
  pauseCampaign(campaignId: string): Promise<void>;
  resumeCampaign(campaignId: string): Promise<void>;
}
