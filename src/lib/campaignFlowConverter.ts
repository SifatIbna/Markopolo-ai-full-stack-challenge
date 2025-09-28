import { CampaignRecommendation } from '@/types';
import { Node, Edge } from 'reactflow';

export interface FlowNode extends Node {
  data: {
    label: string;
    description: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    duration?: number;
    category: 'data' | 'audience' | 'channel' | 'content' | 'execution' | 'analytics';
    details?: Record<string, unknown>;
  };
}


export function convertCampaignToFlow(campaign: CampaignRecommendation): {
  nodes: FlowNode[];
  edges: Edge[];
} {
  const nodes: FlowNode[] = [];
  const edges: Edge[] = [];

  // Start node
  nodes.push({
    id: 'start',
    type: 'input',
    position: { x: 100, y: 50 },
    data: {
      label: 'Campaign Start',
      description: `Executing ${campaign.campaign_id}`,
      status: 'pending',
      category: 'execution'
    }
  });

  // Data Sources Analysis
  nodes.push({
    id: 'data-analysis',
    position: { x: 100, y: 200 },
    data: {
      label: 'Data Analysis',
      description: 'Analyzing connected data sources',
      status: 'pending',
      duration: 3000,
      category: 'data',
      details: {
        sources: ['Connected data sources will be analyzed']
      }
    }
  });

  // Audience Segmentation
  nodes.push({
    id: 'audience-segment',
    position: { x: 100, y: 400 },
    data: {
      label: 'Audience Segmentation',
      description: `Target: ${campaign.audience.segment}`,
      status: 'pending',
      duration: 2500,
      category: 'audience',
      details: {
        segment: campaign.audience.segment,
        size: campaign.audience.size,
        demographics: campaign.audience.demographics
      }
    }
  });

  // Channel Selection
  nodes.push({
    id: 'channel-selection',
    position: { x: 450, y: 200 },
    data: {
      label: 'Channel Selection',
      description: `Primary: ${campaign.channel.primary}`,
      status: 'pending',
      duration: 1500,
      category: 'channel',
      details: {
        primary: campaign.channel.primary,
        secondary: campaign.channel.secondary,
        reason: campaign.channel.reason
      }
    }
  });

  // Content Generation
  nodes.push({
    id: 'content-generation',
    position: { x: 450, y: 400 },
    data: {
      label: 'Content Generation',
      description: 'Creating campaign messages',
      status: 'pending',
      duration: 4000,
      category: 'content',
      details: {
        subject: campaign.message.subject,
        content: campaign.message.content,
        cta: campaign.message.call_to_action
      }
    }
  });

  // Primary Channel Execution
  nodes.push({
    id: 'primary-execution',
    position: { x: 800, y: 200 },
    data: {
      label: `Execute ${campaign.channel.primary}`,
      description: `Sending via ${campaign.channel.primary}`,
      status: 'pending',
      duration: 3500,
      category: 'execution',
      details: {
        channel: campaign.channel.primary,
        targetSize: campaign.audience.size,
        timing: campaign.timing.optimal_time
      }
    }
  });

  // Secondary Channel Execution (if exists)
  if (campaign.channel.secondary && campaign.channel.secondary.length > 0) {
    campaign.channel.secondary.forEach((channel, index) => {
      nodes.push({
        id: `secondary-execution-${index}`,
        position: { x: 800, y: 400 + (index * 120) },
        data: {
          label: `Execute ${channel}`,
          description: `Backup channel: ${channel}`,
          status: 'pending',
          duration: 2000,
          category: 'execution',
          details: {
            channel: channel,
            targetSize: Math.floor(campaign.audience.size * 0.3), // 30% for backup
            timing: campaign.timing.optimal_time
          }
        }
      });
    });
  }

  // Analytics & Monitoring
  nodes.push({
    id: 'analytics',
    position: { x: 1150, y: 150 },
    data: {
      label: 'Analytics & Monitoring',
      description: 'Tracking campaign performance',
      status: 'pending',
      duration: 2000,
      category: 'analytics',
      details: {
        expectedReach: campaign.campaign_config.expected_metrics.reach,
        expectedEngagement: campaign.campaign_config.expected_metrics.engagement_rate,
        expectedConversion: campaign.campaign_config.expected_metrics.conversion_rate
      }
    }
  });

  // Optimization
  nodes.push({
    id: 'optimization',
    position: { x: 1150, y: 350 },
    data: {
      label: 'Real-time Optimization',
      description: 'Adjusting campaign parameters',
      status: 'pending',
      duration: 1500,
      category: 'analytics'
    }
  });

  // End node
  nodes.push({
    id: 'end',
    type: 'output',
    position: { x: 1150, y: 550 },
    data: {
      label: 'Campaign Complete',
      description: 'Campaign execution finished',
      status: 'pending',
      category: 'execution'
    }
  });

  // Create edges (connections)
  const connections = [
    ['start', 'data-analysis'],
    ['data-analysis', 'audience-segment'],
    ['data-analysis', 'channel-selection'],
    ['audience-segment', 'content-generation'],
    ['channel-selection', 'content-generation'],
    ['content-generation', 'primary-execution'],
    ['primary-execution', 'analytics'],
    ['analytics', 'optimization'],
    ['optimization', 'end']
  ];

  // Add secondary channel connections
  if (campaign.channel.secondary && campaign.channel.secondary.length > 0) {
    campaign.channel.secondary.forEach((_, index) => {
      const secondaryId = `secondary-execution-${index}`;
      connections.push(['content-generation', secondaryId]);
      connections.push([secondaryId, 'analytics']);
    });
  }

  connections.forEach(([source, target]) => {
    edges.push({
      id: `${source}-${target}`,
      source,
      target,
      type: 'smoothstep',
      animated: false,
      style: {
        stroke: '#94a3b8',
        strokeWidth: 2,
        strokeDasharray: '5,5'
      }
    });
  });

  return { nodes, edges };
}

export function getNodeColor(category: string, status: string): string {
  const baseColors = {
    data: { bg: 'bg-blue-500', border: 'border-blue-600' },
    audience: { bg: 'bg-purple-500', border: 'border-purple-600' },
    channel: { bg: 'bg-green-500', border: 'border-green-600' },
    content: { bg: 'bg-orange-500', border: 'border-orange-600' },
    execution: { bg: 'bg-red-500', border: 'border-red-600' },
    analytics: { bg: 'bg-indigo-500', border: 'border-indigo-600' }
  };

  const statusModifiers = {
    pending: 'opacity-50',
    running: 'animate-pulse ring-2 ring-offset-2 ring-current',
    completed: 'opacity-100',
    failed: 'bg-red-600 border-red-700'
  };

  const base = baseColors[category as keyof typeof baseColors] || baseColors.execution;
  const modifier = statusModifiers[status as keyof typeof statusModifiers] || '';

  return `${status === 'failed' ? 'bg-red-600 border-red-700' : base.bg + ' ' + base.border} ${modifier}`;
}