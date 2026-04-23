import { z } from 'zod';

export const createCampaignSchema = z.object({
  name: z.string().min(3, 'Campaign name must be at least 3 characters'),
  description: z.string().optional(),
  budget: z.number().min(10, 'Budget must be at least $10'),
  target_platforms: z.string().min(1, 'Select at least one platform'),
  status: z.enum(['draft', 'active', 'paused', 'completed']).default('draft'),
});

export const updateCampaignSchema = createCampaignSchema.partial();

export const creativeSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  cta_text: z.string().min(2, 'CTA text required'),
  image_url: z.string().url().optional(),
});

export const platformCredentialSchema = z.object({
  platform: z.enum(['meta', 'google', 'tiktok', 'linkedin', 'twitter', 'pinterest']),
  access_token: z.string().min(1, 'Access token required'),
  refresh_token: z.string().optional(),
  expires_at: z.string().optional(),
});

export const abTestSchema = z.object({
  campaign_id: z.string().uuid(),
  variant_a_id: z.string().uuid(),
  variant_b_id: z.string().uuid(),
});

export type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
export type UpdateCampaignInput = z.infer<typeof updateCampaignSchema>;
export type CreativeInput = z.infer<typeof creativeSchema>;
export type PlatformCredentialInput = z.infer<typeof platformCredentialSchema>;
export type ABTestInput = z.infer<typeof abTestSchema>;
