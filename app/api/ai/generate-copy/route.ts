import { NextRequest, NextResponse } from 'next/server';
import type { ApiResponse, GeneratedAdCopy, PlatformType } from '@/lib/types';

const copyTemplates: Record<PlatformType, {
  headlines: string[];
  descriptions: string[];
  ctas: string[];
}> = {
  meta: {
    headlines: [
      'Transform Your Business Today',
      'Get Started in Minutes',
      'Join Thousands of Happy Customers',
      'Limited Time Offer - Act Now',
      'Discover What\'s Possible',
    ],
    descriptions: [
      'Boost your productivity and save time with our powerful platform',
      'Everything you need in one easy-to-use solution',
      'Simple, secure, and built for modern teams',
      'Start your free trial today - no credit card required',
      'The #1 choice for growing businesses',
    ],
    ctas: ['Shop Now', 'Learn More', 'Start Free Trial', 'Get Access', 'Claim Offer'],
  },
  google_ads: {
    headlines: [
      'Ads by AdFlow',
      'Professional Ad Management',
      'Multi-Platform Campaigns',
      'Maximize Your ROI',
      'Smart Ad Optimization',
    ],
    descriptions: [
      'Reach your audience across all platforms',
      'Intelligent campaign management tools',
      'Track performance in real-time',
      'Optimize ads automatically',
      'Increase conversions and sales',
    ],
    ctas: ['Click Here', 'Explore Now', 'View Details', 'Contact Us', 'Get Quote'],
  },
  tiktok: {
    headlines: [
      'Trending Now 🔥',
      'Go Viral With Us',
      'Your Next Big Hit',
      'Watch This 👇',
      'Don\'t Miss Out',
    ],
    descriptions: [
      'Join millions of creators and brands',
      'Create content that connects',
      'Authentic storytelling at scale',
      'Make an impact with TikTok',
      'Your audience is waiting',
    ],
    ctas: ['Tap Now', 'Discover', 'Check It Out', 'See More', 'Follow'],
  },
  linkedin: {
    headlines: [
      'Professional Growth Starts Here',
      'Accelerate Your Career',
      'Business Solutions That Work',
      'Industry Leadership',
      'B2B Excellence',
    ],
    descriptions: [
      'Connect with decision-makers in your industry',
      'Build meaningful business relationships',
      'Thought leadership at scale',
      'Enterprise-grade solutions',
      'Drive quality leads and conversions',
    ],
    ctas: ['Connect', 'Learn More', 'Schedule Demo', 'Download Guide', 'Engage'],
  },
  pinterest: {
    headlines: [
      'Discover Your Style',
      'Save It. Share It. Make It.',
      'Inspiration Awaits',
      'Find What You Love',
      'Create Your Collections',
    ],
    descriptions: [
      'Millions of ideas to explore',
      'Find products and inspiration',
      'Shop trending styles',
      'Create mood boards and collections',
      'Build your visual journey',
    ],
    ctas: ['Explore Now', 'Save Pin', 'Shop Collection', 'Discover', 'View Ideas'],
  },
  snapchat: {
    headlines: [
      'Snap It Forward 👻',
      'Share Your World',
      'In the Moment',
      'Live for Now',
      'Snap This',
    ],
    descriptions: [
      'Connect authentically with Gen Z',
      'Real moments, real engagement',
      'Stories that matter',
      'Express yourself freely',
      'Where authenticity thrives',
    ],
    ctas: ['Add Me', 'View Story', 'Download App', 'Join Us', 'Send Snap'],
  },
  twitter: {
    headlines: [
      'Join the Conversation',
      'What\'s Happening?!',
      'Trending Topic',
      'Hot Take Alert 🔥',
      'Real Talk',
    ],
    descriptions: [
      'Share your thoughts with the world',
      'Be part of global conversations',
      'Real-time engagement',
      'Viral moments start here',
      'Your voice matters',
    ],
    ctas: ['Follow', 'Retweet', 'Reply', 'Like', 'Join'],
  },
  reddit: {
    headlines: [
      'Communities You\'ll Love',
      'Genuine Discussions',
      'Reddit Knows',
      'The Front Page',
      'Find Your People',
    ],
    descriptions: [
      'Engage with authentic communities',
      'Real conversations from real people',
      'Discover subreddits you\'ll love',
      'Upvote the content you care about',
      'Join the discussion',
    ],
    ctas: ['Subscribe', 'Post', 'Join Subreddit', 'Upvote', 'Comment'],
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, productName, targetAudience, tone = 'professional' } = body;

    if (!platform || !productName) {
      return NextResponse.json(
        {
          success: false,
          error: 'platform and productName are required',
        } as ApiResponse<null>,
        { status: 400 }
      );
    }

    const templates = copyTemplates[platform as PlatformType] || copyTemplates.meta;

    // Generate variations by mixing templates
    const headline = templates.headlines[Math.floor(Math.random() * templates.headlines.length)];
    const description = templates.descriptions[Math.floor(Math.random() * templates.descriptions.length)];
    const cta = templates.ctas[Math.floor(Math.random() * templates.ctas.length)];

    const variations = [
      `${headline} - ${productName}`,
      `${productName}: ${headline}`,
      `Limited: ${headline} with ${productName}`,
      `${productName} - ${headline.toLowerCase()}`,
      `${headline} - ${targetAudience || 'Your Success'} Awaits`,
    ];

    const response: GeneratedAdCopy = {
      headline,
      description,
      callToAction: cta,
      platform: platform as PlatformType,
      variations,
    };

    return NextResponse.json(
      {
        success: true,
        data: response,
      } as ApiResponse<GeneratedAdCopy>,
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate ad copy',
      } as ApiResponse<null>,
      { status: 500 }
    );
  }
}
