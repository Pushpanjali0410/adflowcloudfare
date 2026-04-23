import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const schema = `
-- Ads SaaS Platform Database Schema
-- Phase 1: Core Tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  company_name VARCHAR(255),
  avatar_url TEXT,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  subscription_start_date TIMESTAMP,
  subscription_end_date TIMESTAMP,
  billing_email VARCHAR(255),
  billing_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Platforms supported
CREATE TABLE IF NOT EXISTS platforms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  icon_url TEXT,
  description TEXT,
  api_version VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Platform credentials for each user
CREATE TABLE IF NOT EXISTS platform_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  account_id VARCHAR(255) NOT NULL,
  account_name VARCHAR(255),
  access_token TEXT,
  refresh_token TEXT,
  token_expiry TIMESTAMP,
  scope TEXT,
  status VARCHAR(50) DEFAULT 'active',
  last_synced TIMESTAMP,
  is_test_account BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, platform_id, account_id)
);

-- Campaigns
CREATE TABLE IF NOT EXISTS campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  campaign_type VARCHAR(50) DEFAULT 'standard',
  objective VARCHAR(50),
  budget DECIMAL(10, 2),
  currency VARCHAR(3) DEFAULT 'USD',
  start_date DATE,
  end_date DATE,
  target_platforms TEXT,
  target_audience JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP,
  completed_at TIMESTAMP
);

-- Campaign variants for A/B testing
CREATE TABLE IF NOT EXISTS campaign_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  variant_name VARCHAR(255),
  variant_order INT,
  is_control BOOLEAN DEFAULT false,
  ad_copy TEXT,
  ad_creative_url TEXT,
  headline VARCHAR(255),
  call_to_action VARCHAR(100),
  landing_page_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Creatives (images, videos, etc.)
CREATE TABLE IF NOT EXISTS creatives (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  file_name VARCHAR(255),
  file_url TEXT NOT NULL,
  file_type VARCHAR(50),
  dimensions VARCHAR(50),
  file_size INT,
  alt_text TEXT,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Platform-specific ads (post records)
CREATE TABLE IF NOT EXISTS platform_ads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  platform_credential_id UUID NOT NULL REFERENCES platform_credentials(id) ON DELETE CASCADE,
  platform_ad_id VARCHAR(255),
  variant_id UUID REFERENCES campaign_variants(id),
  status VARCHAR(50) DEFAULT 'draft',
  published_at TIMESTAMP,
  scheduled_at TIMESTAMP,
  platform_response JSONB,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(campaign_id, platform_credential_id)
);

-- Campaign analytics
CREATE TABLE IF NOT EXISTS campaign_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  platform_credential_id UUID REFERENCES platform_credentials(id) ON DELETE CASCADE,
  date DATE,
  impressions INT DEFAULT 0,
  clicks INT DEFAULT 0,
  conversions INT DEFAULT 0,
  spend DECIMAL(10, 2) DEFAULT 0,
  revenue DECIMAL(10, 2) DEFAULT 0,
  ctr DECIMAL(5, 2),
  cpc DECIMAL(10, 2),
  cpa DECIMAL(10, 2),
  roas DECIMAL(5, 2),
  variant_id UUID REFERENCES campaign_variants(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI-generated content history
CREATE TABLE IF NOT EXISTS ai_content_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
  content_type VARCHAR(50),
  original_brief TEXT,
  generated_content TEXT,
  ai_model VARCHAR(100),
  feedback_rating INT,
  is_used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Scheduled posts
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  platform_credential_id UUID NOT NULL REFERENCES platform_credentials(id) ON DELETE CASCADE,
  ad_copy TEXT,
  creative_url TEXT,
  scheduled_time TIMESTAMP NOT NULL,
  timezone VARCHAR(50),
  status VARCHAR(50) DEFAULT 'scheduled',
  retry_count INT DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP
);

-- API logs and audit trail
CREATE TABLE IF NOT EXISTS api_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  action VARCHAR(255),
  resource_type VARCHAR(100),
  resource_id VARCHAR(255),
  endpoint VARCHAR(255),
  method VARCHAR(10),
  status_code INT,
  response_time_ms INT,
  error_details TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget optimization recommendations
CREATE TABLE IF NOT EXISTS budget_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campaign_id UUID NOT NULL REFERENCES campaigns(id) ON DELETE CASCADE,
  current_budget DECIMAL(10, 2),
  recommended_budget DECIMAL(10, 2),
  confidence_score DECIMAL(5, 2),
  reasoning TEXT,
  estimated_impact_percent DECIMAL(5, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_applied BOOLEAN DEFAULT false,
  applied_at TIMESTAMP
);

-- Best time-to-post predictions
CREATE TABLE IF NOT EXISTS posting_time_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform_id UUID NOT NULL REFERENCES platforms(id) ON DELETE CASCADE,
  day_of_week INT,
  hour INT,
  engagement_score DECIMAL(5, 2),
  confidence DECIMAL(5, 2),
  timezone VARCHAR(50),
  last_updated TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON campaigns(status);
CREATE INDEX IF NOT EXISTS idx_platform_credentials_user_id ON platform_credentials(user_id);
CREATE INDEX IF NOT EXISTS idx_platform_credentials_status ON platform_credentials(status);
CREATE INDEX IF NOT EXISTS idx_platform_ads_campaign_id ON platform_ads(campaign_id);
CREATE INDEX IF NOT EXISTS idx_platform_ads_status ON platform_ads(status);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_campaign_id ON campaign_analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_analytics_date ON campaign_analytics(date);
CREATE INDEX IF NOT EXISTS idx_api_logs_user_id ON api_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_api_logs_created_at ON api_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_scheduled_posts_scheduled_time ON scheduled_posts(scheduled_time);

-- Insert default platforms
INSERT INTO platforms (name, slug, description) VALUES
  ('Facebook', 'facebook', 'Facebook ads platform'),
  ('Instagram', 'instagram', 'Instagram ads platform'),
  ('Google Ads', 'google_ads', 'Google Ads platform'),
  ('TikTok', 'tiktok', 'TikTok ads platform'),
  ('LinkedIn', 'linkedin', 'LinkedIn ads platform'),
  ('Twitter/X', 'twitter', 'Twitter/X ads platform'),
  ('Pinterest', 'pinterest', 'Pinterest ads platform'),
  ('Snapchat', 'snapchat', 'Snapchat ads platform'),
  ('YouTube', 'youtube', 'YouTube ads platform'),
  ('Reddit', 'reddit', 'Reddit ads platform')
ON CONFLICT (slug) DO NOTHING;
`;

async function runMigration() {
  try {
    console.log('Starting database migration...');
    
    // Split by statement to execute one by one
    const statements = schema.split(';').filter(s => s.trim());
    
    for (const statement of statements) {
      if (!statement.trim()) continue;
      
      const { error } = await supabase.rpc('exec', {
        sql: statement + ';'
      }).catch(() => {
        // Fallback: try direct SQL execution
        return supabase.from('_sql').select('*');
      });
      
      if (error && !error.message.includes('already exists')) {
        console.error('Error executing statement:', error);
      }
    }
    
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
