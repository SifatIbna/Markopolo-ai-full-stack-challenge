export interface DataSource {
  id: string;
  name: string;
  type: 'google-ads' | 'facebook-pixel' | 'shopify';
  connected: boolean;
  config?: Record<string, unknown>;
}

export interface Channel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp' | 'ads';
  enabled: boolean;
  config?: Record<string, unknown>;
}

export interface Message {
  id: string;
  content: string;
  timestamp: Date;
  isUser: boolean;
  isStreaming?: boolean;
  recommendation?: CampaignRecommendation;
  isRealAI?: boolean;
}

export interface CampaignRecommendation {
  audience: {
    segment: string;
    criteria: Record<string, unknown>;
    size: number;
  };
  timing: {
    optimal_time: string;
    timezone: string;
    frequency: string;
  };
  channel: {
    primary: string;
    secondary?: string[];
    reason: string;
  };
  message: {
    subject?: string;
    content: string;
    call_to_action: string;
    personalization: Record<string, unknown>;
  };
  campaign_config: {
    budget?: number;
    duration: string;
    targeting_parameters: Record<string, unknown>;
    expected_metrics: {
      reach: number;
      engagement_rate: number;
      conversion_rate: number;
    };
  };
}