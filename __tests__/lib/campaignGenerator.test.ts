import { generateCampaignRecommendation } from '@/lib/campaignGenerator'
import { DataSource, Channel } from '@/types'

describe('generateCampaignRecommendation', () => {
  const mockDataSources: DataSource[] = [
    { id: '1', name: 'Google Ads', type: 'google-ads', connected: true },
    { id: '2', name: 'Facebook Pixel', type: 'facebook-pixel', connected: true },
    { id: '3', name: 'Shopify Store', type: 'shopify', connected: true },
  ]

  const mockChannels: Channel[] = [
    { id: '1', name: 'Email Marketing', type: 'email', enabled: true },
    { id: '2', name: 'SMS Campaigns', type: 'sms', enabled: true },
    { id: '3', name: 'WhatsApp Business', type: 'whatsapp', enabled: true },
    { id: '4', name: 'Advertising Platforms', type: 'ads', enabled: true },
  ]

  it('should generate a campaign recommendation with all required fields', () => {
    const recommendation = generateCampaignRecommendation(
      'Create a cart abandonment campaign',
      mockDataSources,
      mockChannels
    )

    expect(recommendation).toHaveProperty('audience')
    expect(recommendation).toHaveProperty('timing')
    expect(recommendation).toHaveProperty('channel')
    expect(recommendation).toHaveProperty('message')
    expect(recommendation).toHaveProperty('campaign_config')

    // Check audience structure
    expect(recommendation.audience).toHaveProperty('segment')
    expect(recommendation.audience).toHaveProperty('criteria')
    expect(recommendation.audience).toHaveProperty('size')
    expect(typeof recommendation.audience.size).toBe('number')

    // Check timing structure
    expect(recommendation.timing).toHaveProperty('optimal_time')
    expect(recommendation.timing).toHaveProperty('timezone')
    expect(recommendation.timing).toHaveProperty('frequency')

    // Check channel structure
    expect(recommendation.channel).toHaveProperty('primary')
    expect(recommendation.channel).toHaveProperty('reason')

    // Check message structure
    expect(recommendation.message).toHaveProperty('content')
    expect(recommendation.message).toHaveProperty('call_to_action')
    expect(recommendation.message).toHaveProperty('personalization')

    // Check campaign config structure
    expect(recommendation.campaign_config).toHaveProperty('duration')
    expect(recommendation.campaign_config).toHaveProperty('targeting_parameters')
    expect(recommendation.campaign_config).toHaveProperty('expected_metrics')
  })

  it('should detect cart abandonment campaigns correctly', () => {
    const recommendation = generateCampaignRecommendation(
      'Create a cart abandonment campaign',
      mockDataSources,
      mockChannels
    )

    expect(recommendation.audience.segment).toBe('Cart abandoners')
    expect(recommendation.audience.criteria.behavior).toBe('abandoned_cart')
  })

  it('should detect new customer acquisition campaigns', () => {
    const recommendation = generateCampaignRecommendation(
      'new customer acquisition strategy',
      mockDataSources,
      mockChannels
    )

    expect(recommendation.audience.segment).toBe('New visitors')
  })

  it('should detect retention campaigns', () => {
    const recommendation = generateCampaignRecommendation(
      'customer retention campaign',
      mockDataSources,
      mockChannels
    )

    expect(recommendation.audience.segment).toBe('Returning customers')
  })

  it('should detect high value customer campaigns', () => {
    const recommendation = generateCampaignRecommendation(
      'vip high value customer campaign',
      mockDataSources,
      mockChannels
    )

    expect(recommendation.audience.segment).toBe('High-value customers')
  })

  it('should adjust audience size based on connected data sources', () => {
    const shopifyOnly: DataSource[] = [
      { id: '3', name: 'Shopify Store', type: 'shopify', connected: true },
    ]

    const facebookOnly: DataSource[] = [
      { id: '2', name: 'Facebook Pixel', type: 'facebook-pixel', connected: true },
    ]

    const googleOnly: DataSource[] = [
      { id: '1', name: 'Google Ads', type: 'google-ads', connected: true },
    ]

    const shopifyRec = generateCampaignRecommendation('test', shopifyOnly, mockChannels)
    const facebookRec = generateCampaignRecommendation('test', facebookOnly, mockChannels)
    const googleRec = generateCampaignRecommendation('test', googleOnly, mockChannels)

    // Shopify should have the largest base audience
    expect(shopifyRec.audience.size).toBeGreaterThan(facebookRec.audience.size)
    expect(facebookRec.audience.size).toBeGreaterThan(googleRec.audience.size)
  })

  it('should select primary channel from enabled channels', () => {
    const emailOnly: Channel[] = [
      { id: '1', name: 'Email Marketing', type: 'email', enabled: true },
    ]

    const recommendation = generateCampaignRecommendation(
      'test campaign',
      mockDataSources,
      emailOnly
    )

    expect(recommendation.channel.primary).toBe('Email Marketing')
  })

  it('should include budget when ads channel is enabled', () => {
    const channelsWithAds = mockChannels.filter(ch => ch.type === 'ads' || ch.type === 'email')

    const recommendation = generateCampaignRecommendation(
      'test campaign',
      mockDataSources,
      channelsWithAds
    )

    if (recommendation.channel.primary === 'Advertising Platforms') {
      expect(recommendation.campaign_config.budget).toBeDefined()
      expect(typeof recommendation.campaign_config.budget).toBe('number')
      expect(recommendation.campaign_config.budget).toBeGreaterThan(0)
    }
  })

  it('should include email subject when email is primary channel', () => {
    const emailOnly: Channel[] = [
      { id: '1', name: 'Email Marketing', type: 'email', enabled: true },
    ]

    const recommendation = generateCampaignRecommendation(
      'test campaign',
      mockDataSources,
      emailOnly
    )

    expect(recommendation.message.subject).toBeDefined()
    expect(typeof recommendation.message.subject).toBe('string')
    expect(recommendation.message.subject!.length).toBeGreaterThan(0)
  })

  it('should have valid expected metrics', () => {
    const recommendation = generateCampaignRecommendation(
      'test campaign',
      mockDataSources,
      mockChannels
    )

    const metrics = recommendation.campaign_config.expected_metrics

    expect(metrics.reach).toBeGreaterThan(0)
    expect(metrics.engagement_rate).toBeGreaterThan(0)
    expect(metrics.engagement_rate).toBeLessThan(1)
    expect(metrics.conversion_rate).toBeGreaterThan(0)
    expect(metrics.conversion_rate).toBeLessThan(1)

    // Reach should be less than or equal to audience size
    expect(metrics.reach).toBeLessThanOrEqual(recommendation.audience.size)
  })

  it('should use data source names in criteria', () => {
    const recommendation = generateCampaignRecommendation(
      'test campaign',
      mockDataSources,
      mockChannels
    )

    expect(recommendation.audience.criteria.data_sources_used).toEqual([
      'Google Ads',
      'Facebook Pixel',
      'Shopify Store'
    ])
  })

  it('should generate different recommendations for different queries', () => {
    const rec1 = generateCampaignRecommendation('cart abandonment', mockDataSources, mockChannels)
    const rec2 = generateCampaignRecommendation('new customer acquisition', mockDataSources, mockChannels)

    expect(rec1.audience.segment).not.toBe(rec2.audience.segment)
  })

  it('should handle empty data sources and channels gracefully', () => {
    const recommendation = generateCampaignRecommendation('test', [], [])

    expect(recommendation).toHaveProperty('audience')
    expect(recommendation).toHaveProperty('timing')
    expect(recommendation).toHaveProperty('channel')
    expect(recommendation).toHaveProperty('message')
    expect(recommendation).toHaveProperty('campaign_config')

    // Should still have a base audience size
    expect(recommendation.audience.size).toBeGreaterThan(0)
  })
})