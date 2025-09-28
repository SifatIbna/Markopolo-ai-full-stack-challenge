import { DataSource, Channel, CampaignRecommendation } from '@/types';

const audienceSegments = [
  'High-value customers',
  'Cart abandoners',
  'New visitors',
  'Returning customers',
  'Mobile users',
  'Desktop users',
  'Social media followers',
  'Email subscribers',
  'Recent purchasers',
  'Inactive customers'
];

const messagingTemplates = {
  email: [
    'Exclusive offer just for you! Get {discount}% off your next purchase.',
    'We miss you! Come back and save {discount}% on your favorite items.',
    'New arrivals that match your style preferences are here!',
    'Your cart is waiting! Complete your purchase with free shipping.',
  ],
  sms: [
    '🔥 Flash sale! {discount}% off ends today. Shop now: {link}',
    'Your exclusive offer: {discount}% off + free shipping. Use code {code}',
    'Hi {name}! Your cart expires in 1 hour. Complete purchase now.',
  ],
  whatsapp: [
    'Hi {name}! 👋 We have a special {discount}% discount just for you!',
    'Your personalized product recommendations are ready! Check them out.',
    'Quick reminder: items in your cart are selling fast! 🏃‍♂️',
  ],
  ads: [
    'Discover products tailored to your interests with {discount}% off!',
    'Shop smarter with AI-powered recommendations and save {discount}%',
    'Join thousands of satisfied customers. Get {discount}% off your first order!',
  ]
};

const timeSlots = [
  '9:00 AM - 11:00 AM',
  '12:00 PM - 2:00 PM',
  '6:00 PM - 8:00 PM',
  '7:00 PM - 9:00 PM'
];

const frequencies = [
  'Once per week',
  'Twice per week',
  'Daily for 3 days',
  'Every 3 days',
  'Monthly'
];

export function generateCampaignRecommendation(
  userQuery: string,
  connectedSources: DataSource[],
  enabledChannels: Channel[]
): CampaignRecommendation {
  const hasGoogleAds = connectedSources.some(ds => ds.type === 'google-ads');
  const hasFacebookPixel = connectedSources.some(ds => ds.type === 'facebook-pixel');
  const hasShopify = connectedSources.some(ds => ds.type === 'shopify');

  const query = userQuery.toLowerCase();
  let audienceMultiplier = 1;
  const segmentHash = userQuery.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
  let selectedSegment = audienceSegments[Math.abs(segmentHash) % audienceSegments.length];

  if (query.includes('cart') || query.includes('abandon')) {
    selectedSegment = 'Cart abandoners';
    audienceMultiplier = 0.7;
  } else if (query.includes('new') || query.includes('acquisition')) {
    selectedSegment = 'New visitors';
    audienceMultiplier = 1.5;
  } else if (query.includes('retention') || query.includes('return')) {
    selectedSegment = 'Returning customers';
    audienceMultiplier = 0.8;
  } else if (query.includes('high value') || query.includes('vip')) {
    selectedSegment = 'High-value customers';
    audienceMultiplier = 0.3;
  }

  const baseAudienceSize = hasShopify ? 50000 : hasFacebookPixel ? 30000 : hasGoogleAds ? 25000 : 10000;
  const audienceSize = Math.floor(baseAudienceSize * audienceMultiplier);

  const primaryChannel = enabledChannels.length > 0
    ? enabledChannels[Math.floor(Math.random() * enabledChannels.length)].type
    : 'email';

  const secondaryChannels = enabledChannels
    .filter(ch => ch.type !== primaryChannel)
    .slice(0, 2)
    .map(ch => ch.name);

  // Use deterministic values based on input to avoid hydration issues
  const queryHash = query.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a; }, 0);
  const discount = Math.abs(queryHash % 20) + 10;
  const messageTemplate = messagingTemplates[primaryChannel as keyof typeof messagingTemplates]?.[0] || messagingTemplates.email[0];

  const budget = enabledChannels.some(ch => ch.type === 'ads') ? Math.abs(queryHash % 5000) + 1000 : undefined;

  return {
    campaign_id: `campaign_${selectedSegment.toLowerCase().replace(/\s+/g, '_')}_${primaryChannel}`,
    audience: {
      segment: selectedSegment,
      criteria: {
        behavior: query.includes('cart') ? 'abandoned_cart' : 'browsing_history',
        demographics: {
          age_range: '25-45',
          location: 'US, CA, UK',
        },
        engagement_level: selectedSegment.includes('High-value') ? 'high' : 'medium',
        data_sources_used: connectedSources.map(ds => ds.name),
      },
      size: audienceSize,
    },
    timing: {
      optimal_time: timeSlots[Math.abs(queryHash) % timeSlots.length],
      timezone: 'UTC-5 (EST)',
      frequency: frequencies[Math.abs(queryHash) % frequencies.length],
    },
    channel: {
      primary: enabledChannels.find(ch => ch.type === primaryChannel)?.name || 'Email Marketing',
      secondary: secondaryChannels.length > 0 ? secondaryChannels : undefined,
      reason: getChannelReason(primaryChannel, selectedSegment),
    },
    message: {
      subject: primaryChannel === 'email' ? `Exclusive ${discount}% off for our valued customers` : undefined,
      content: messageTemplate
        .replace('{discount}', discount.toString())
        .replace('{name}', '{customer_name}')
        .replace('{code}', 'SAVE' + discount)
        .replace('{link}', '{tracking_url}'),
      call_to_action: getCallToAction(primaryChannel),
      personalization: {
        customer_name: '{dynamic}',
        product_recommendations: '{ai_generated}',
        discount_amount: discount,
        urgency_level: query.includes('urgent') || query.includes('limited') ? 'high' : 'medium',
      },
    },
    campaign_config: {
      budget: budget,
      duration: query.includes('quick') || query.includes('flash') ? '3 days' : '2 weeks',
      targeting_parameters: {
        lookalike_audience: hasGoogleAds || hasFacebookPixel,
        retargeting: true,
        interest_targeting: enabledChannels.some(ch => ch.type === 'ads'),
        geographic_targeting: 'US, CA, UK',
      },
      expected_metrics: {
        reach: Math.floor(audienceSize * 0.8),
        engagement_rate: (Math.abs(queryHash % 50) / 1000) + 0.02, // 0.02-0.07
        conversion_rate: (Math.abs(queryHash % 30) / 1000) + 0.01, // 0.01-0.04
      },
    },
  };
}

function getChannelReason(channel: string, segment: string): string {
  const reasons = {
    email: `Email has the highest ROI for ${segment.toLowerCase()} and allows for detailed personalization`,
    sms: `SMS has 98% open rates and creates urgency, perfect for ${segment.toLowerCase()}`,
    whatsapp: `WhatsApp enables personal, conversational engagement ideal for ${segment.toLowerCase()}`,
    ads: `Paid advertising can quickly scale reach and is effective for ${segment.toLowerCase()} acquisition`,
  };

  return reasons[channel as keyof typeof reasons] || reasons.email;
}

function getCallToAction(channel: string): string {
  const ctas = {
    email: 'Shop Now & Save',
    sms: 'TAP TO SHOP',
    whatsapp: 'View Products 👆',
    ads: 'Learn More',
  };

  return ctas[channel as keyof typeof ctas] || 'Shop Now';
}