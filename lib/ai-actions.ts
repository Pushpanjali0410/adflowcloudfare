'use server'

import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { verifyAuth } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

export async function generateAdCopy(prompt: string) {
  try {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are an expert advertising copywriter. Create compelling, concise ad copy that drives clicks and conversions. 
               Follow these guidelines:
               - Keep it short (2-3 sentences max)
               - Use power words and action verbs
               - Create urgency or curiosity
               - Include a clear call-to-action`,
      prompt,
      temperature: 0.8,
      maxTokens: 150,
    })

    return {
      success: true,
      copy: result.text,
    }
  } catch (error) {
    console.error('[v0] Error generating ad copy:', error)
    return {
      success: false,
      error: 'Failed to generate ad copy',
    }
  }
}

export async function optimizeBudget(campaignData: {
  platforms: string[]
  totalBudget: number
  performance: Record<string, number>
  objectives: string[]
}) {
  try {
    const prompt = `Based on the following campaign data, provide budget allocation recommendations:
    
Platforms: ${campaignData.platforms.join(', ')}
Total Budget: $${campaignData.totalBudget}
Campaign Objectives: ${campaignData.objectives.join(', ')}
Historical Performance: ${JSON.stringify(campaignData.performance)}

Provide specific budget percentages for each platform to maximize ROI. Format as JSON.`

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are a digital marketing strategist specializing in budget optimization. 
               Analyze campaign performance and recommend optimal budget allocation.
               Always respond with valid JSON.`,
      prompt,
      temperature: 0.7,
      maxTokens: 300,
    })

    const budgetAllocation = JSON.parse(result.text)
    return {
      success: true,
      allocation: budgetAllocation,
    }
  } catch (error) {
    console.error('[v0] Error optimizing budget:', error)
    return {
      success: false,
      error: 'Failed to optimize budget',
    }
  }
}

export async function getBestTimeToPost(campaignData: {
  platforms: string[]
  targetAudience: string
  timezone: string
  objective: string
}) {
  try {
    const prompt = `For a campaign with these parameters:
    
Platforms: ${campaignData.platforms.join(', ')}
Target Audience: ${campaignData.targetAudience}
Timezone: ${campaignData.timezone}
Objective: ${campaignData.objective}

Recommend the best times to post on each platform (considering global reach and engagement patterns).
Format as JSON with platform names as keys and recommended times as values.`

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      system: `You are a social media expert with deep knowledge of platform algorithms and audience behavior.
               Provide data-driven recommendations for optimal posting times.
               Always respond with valid JSON.`,
      prompt,
      temperature: 0.6,
      maxTokens: 250,
    })

    const times = JSON.parse(result.text)
    return {
      success: true,
      recommendations: times,
    }
  } catch (error) {
    console.error('[v0] Error analyzing best time to post:', error)
    return {
      success: false,
      error: 'Failed to analyze best posting times',
    }
  }
}
