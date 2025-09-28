import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let message, dataSources, channels;

  try {
    const requestBody = await request.json();
    ({ message, dataSources, channels } = requestBody);
    const { apiKey } = requestBody;

    // If no API key is provided, return dummy response
    if (!apiKey) {
      return getDummyResponse(message, dataSources, channels);
    }

    // Initialize Claude with the provided API key
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const connectedSources = dataSources.filter((ds: { connected: boolean }) => ds.connected);
    const enabledChannels = channels.filter((ch: { enabled: boolean }) => ch.enabled);

    const systemPrompt = `You are an AI marketing assistant specializing in data-driven campaign optimization. Analyze the user's query using their connected data sources and enabled marketing channels to provide personalized recommendations.

## Available Data Sources:
${connectedSources.map((ds: { name: string, type: string }) => `- **${ds.name}** (${ds.type}): Use for audience insights, conversion tracking, and performance optimization`).join('\n')}

## Enabled Marketing Channels:
${enabledChannels.map((ch: { name: string, type: string }) => `- **${ch.name}** (${ch.type}): Leverage for targeted outreach and engagement`).join('\n')}

## Response Format:
Provide a comprehensive marketing strategy following this exact format:

Based on your connected data sources ([list data sources]) and enabled channels ([list channels]), here's my recommendation for "[user query]":

🎯 **Campaign Strategy:**
[Strategic analysis explaining how you're leveraging each data source and channel]

📊 **Key Insights:**
- **Target Audience:** [audience details]
- **Optimal Timing:** [timing recommendations]
- **Channel Strategy:** [primary and secondary channels with reasoning]
- **Expected ROI:** [ROI estimate]

🚀 **Execution Ready:**
[Implementation steps and next actions]

Then provide the detailed JSON configuration in \`\`\`json code blocks following this structure:
{
  "campaign_id": "unique_id",
  "audience": {
    "segment": "target audience description",
    "size": estimated_number,
    "demographics": { "age_range": "18-35", "interests": ["..."], "location": "..." }
  },
  "timing": {
    "optimal_time": "specific time recommendation",
    "frequency": "how often to send",
    "timezone": "target timezone",
    "duration": "campaign length"
  },
  "channel": {
    "primary": "main channel to use",
    "secondary": ["backup channels"],
    "reason": "why this channel mix"
  },
  "message": {
    "subject": "email subject or ad headline",
    "content": "main message content",
    "call_to_action": "specific CTA text",
    "personalization": { "merge_fields": ["first_name", "product_interest"] }
  },
  "campaign_config": {
    "budget": estimated_budget_if_applicable,
    "duration": "2 weeks",
    "expected_metrics": {
      "reach": estimated_reach,
      "engagement_rate": 0.05,
      "conversion_rate": 0.02,
      "roi_estimate": "3.2x"
    }
  },
  "execution_ready": {
    "email_template": "HTML email template if applicable",
    "ad_creative": "Ad copy and targeting if applicable",
    "automation_trigger": "When to send/activate"
  }
}`;

    const response = await anthropic.messages.create({
      model: "claude-3-haiku-20240307",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: message
        }
      ]
    });

    // Extract the response content
    const content = response.content[0];
    let responseText = '';

    if (content.type === 'text') {
      responseText = content.text;
    }

    // Try to extract JSON from the response
    let campaignJson = null;
    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      try {
        campaignJson = JSON.parse(jsonMatch[1]);
        // Remove the JSON block from the message text to avoid duplicate display
        responseText = responseText.replace(/```json\s*([\s\S]*?)\s*```/, '').trim();
      } catch (e) {
        console.error('Failed to parse JSON from Claude response:', e);
      }
    }

    return NextResponse.json({
      message: responseText,
      campaign: campaignJson,
      isRealAI: true
    });

  } catch (error) {
    console.error('Claude API Error:', error);

    // Fallback to dummy response on error
    return getDummyResponse(message, dataSources, channels, 'API Error - using fallback response');
  }
}

function getDummyResponse(message: string, dataSources: { name: string; connected: boolean }[], channels: { name: string; enabled: boolean }[], errorNote?: string) {
  const connectedSources = dataSources.filter(ds => ds.connected);
  const enabledChannels = channels.filter(ch => ch.enabled);

  const dummyCampaign = {
    campaign_id: `campaign_${Date.now()}`,
    audience: {
      segment: "Tech-Savvy Millennials",
      size: 25000,
      demographics: {
        age_range: "25-40",
        interests: ["technology", "productivity", "digital tools"],
        location: "Urban areas, US & Canada"
      }
    },
    timing: {
      optimal_time: "Tuesday-Thursday, 2-4 PM EST",
      frequency: "2x per week",
      timezone: "EST",
      duration: "3 weeks"
    },
    channel: {
      primary: enabledChannels[0]?.name || "Email Marketing",
      secondary: enabledChannels.slice(1).map(ch => ch.name),
      reason: `${enabledChannels[0]?.name || "Email"} shows highest engagement for this demographic, with ${enabledChannels.slice(1).map(ch => ch.name).join(', ')} as backup channels`
    },
    message: {
      subject: "Unlock Your Productivity Potential - Limited Time Offer",
      content: "Discover how successful professionals are boosting their productivity by 40% with our innovative solution. Based on your recent activity, this could be perfect for your workflow.",
      call_to_action: "Start Your Free Trial",
      personalization: {
        merge_fields: ["first_name", "company", "last_activity"]
      }
    },
    campaign_config: {
      budget: 5000,
      duration: "3 weeks",
      expected_metrics: {
        reach: 15000,
        engagement_rate: 0.06,
        conversion_rate: 0.025,
        roi_estimate: "4.2x"
      }
    },
    execution_ready: {
      email_template: "<!DOCTYPE html><html><body><h1>Hello {{first_name}}</h1><p>Based on data from " + connectedSources.map(ds => ds.name).join(', ') + ", we've crafted this personalized campaign for you.</p><a href='#' style='background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>Start Your Free Trial</a></body></html>",
      ad_creative: "Headline: Boost Productivity by 40% | Description: Join thousands of professionals using our proven system | CTA: Start Free Trial",
      automation_trigger: "Send when user visits pricing page or downloads whitepaper"
    }
  };

  const responseMessage = `${errorNote ? `⚠️ ${errorNote}\n\n` : ''}Based on your connected data sources (${connectedSources.map(ds => ds.name).join(', ')}) and enabled channels (${enabledChannels.map(ch => ch.name).join(', ')}), here's my recommendation for "${message}":

**🎯 Campaign Strategy:**

I've analyzed your available data sources and channels to create a targeted campaign for tech-savvy millennials. This demographic shows high engagement with productivity-focused content, especially when delivered through ${enabledChannels[0]?.name || 'email marketing'}.

**📊 Key Insights:**
- **Target Audience:** 25,000 tech-savvy millennials aged 25-40
- **Optimal Timing:** Tuesday-Thursday afternoons (2-4 PM EST)
- **Channel Strategy:** Primary focus on ${enabledChannels[0]?.name || 'email'} with backup through ${enabledChannels.slice(1).map(ch => ch.name).join(', ') || 'secondary channels'}
- **Expected ROI:** 4.2x return on $5,000 investment

**🚀 Execution Ready:**
The campaign includes personalized email templates, automation triggers, and detailed targeting parameters. You can launch this immediately with your connected ${connectedSources.map(ds => ds.name).join(' & ')} data.

${errorNote ? '\n**Note:** This is a demonstration response. Connect your Claude API key for real AI-powered recommendations.' : '**Demo Mode:** This is a sample response. Add your Claude API key for personalized AI recommendations based on your actual data.'}`;

  return NextResponse.json({
    message: responseMessage,
    campaign: dummyCampaign,
    isRealAI: false
  });
}