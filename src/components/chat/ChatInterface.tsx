'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { DataSource, Channel, Message, CampaignRecommendation } from '@/types';
import MessageBubble from './MessageBubble';
import { generateCampaignRecommendation } from '@/lib/campaignGenerator';

interface ChatInterfaceProps {
  dataSources: DataSource[];
  channels: Channel[];
  apiKey?: string;
}

export default function ChatInterface({ dataSources, channels, apiKey }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! I\'m your AI marketing assistant. Connect your data sources and channels, then ask me about campaign recommendations, audience insights, or marketing strategies.',
      timestamp: new Date(),
      isUser: false,
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const connectedSources = dataSources.filter(ds => ds.connected);
    const enabledChannels = channels.filter(ch => ch.enabled);

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      timestamp: new Date(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Validation: require at least one data source and one channel
    if (connectedSources.length === 0 || enabledChannels.length === 0) {
      setTimeout(() => {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: `⚠️ **Setup Required**\n\nTo generate campaign recommendations, you need to:\n\n${connectedSources.length === 0 ? '• **Connect at least one data source** (Google Ads, Facebook Pixel, or Shopify)\n' : ''}${enabledChannels.length === 0 ? '• **Enable at least one marketing channel** (Email, SMS, WhatsApp, or Ads)\n' : ''}\nOnce you've connected your data sources and enabled channels, I'll be able to provide personalized campaign recommendations based on your actual data and available marketing platforms.`,
          timestamp: new Date(),
          isUser: false,
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      }, 800);
      return;
    }

    // Call the API
    try {
      const streamingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        timestamp: new Date(),
        isUser: false,
        isStreaming: true,
      };

      setMessages(prev => [...prev, streamingMessage]);

      // Simulate thinking steps
      const thinkingSteps = [
        '🔍 Analyzing your connected data sources...',
        '📊 Processing customer behavior patterns...',
        '🎯 Identifying optimal audience segments...',
        '⏰ Calculating best timing windows...',
        '📱 Evaluating channel effectiveness...',
        '💡 Generating personalized recommendations...'
      ];

      for (let i = 0; i < thinkingSteps.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setMessages(prev =>
          prev.map(msg =>
            msg.id === streamingMessage.id
              ? { ...msg, content: thinkingSteps[i], isStreaming: true }
              : msg
          )
        );
      }

      // Call the AI API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          dataSources: dataSources,
          channels: channels,
          apiKey: apiKey || '',
        }),
      });

      const data = await response.json();

      // Stream the response
      await simulateStreaming(streamingMessage.id, data.message, data.campaign, data.isRealAI);
      setIsLoading(false);
    } catch (error) {
      console.error('Error calling API:', error);

      // Fallback to local generation on error
      const recommendation = generateCampaignRecommendation(
        userMessage.content,
        connectedSources,
        enabledChannels
      );

      const fallbackResponse = `⚠️ API Error - using local fallback\n\nBased on your connected data sources (${connectedSources.map(ds => ds.name).join(', ')}) and enabled channels (${enabledChannels.map(ch => ch.name).join(', ')}), here's my recommendation:\n\n**Campaign Strategy:**\n\n${formatCampaignRecommendation(recommendation)}`;

      const streamingMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: '',
        timestamp: new Date(),
        isUser: false,
        isStreaming: true,
      };

      setMessages(prev => [...prev, streamingMessage]);
      await simulateStreaming(streamingMessage.id, fallbackResponse, recommendation);
      setIsLoading(false);
    }
  };

  const simulateStreaming = async (messageId: string, fullText: string, recommendation?: CampaignRecommendation, isRealAI?: boolean) => {
    const words = fullText.split(' ');
    let currentText = '';

    for (let i = 0; i < words.length; i++) {
      currentText += (i > 0 ? ' ' : '') + words[i];

      // Use the recommendation passed from the API (server already extracted JSON)
      const extractedRecommendation = recommendation;

      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? {
                ...msg,
                content: currentText,
                isStreaming: i < words.length - 1,
                recommendation: i === words.length - 1 ? extractedRecommendation : undefined,
                isRealAI: i === words.length - 1 ? isRealAI : undefined
              }
            : msg
        )
      );

      await new Promise(resolve => setTimeout(resolve, 50));
    }
  };

  const formatCampaignRecommendation = (rec: CampaignRecommendation): string => {
    return `
**Target Audience:** ${rec.audience.segment} (${rec.audience.size.toLocaleString()} people)

**Optimal Timing:** ${rec.timing.optimal_time} (${rec.timing.timezone})
**Frequency:** ${rec.timing.frequency}

**Recommended Channel:** ${rec.channel.primary}
${rec.channel.secondary?.length ? `**Secondary Channels:** ${rec.channel.secondary.join(', ')}` : ''}
**Reason:** ${rec.channel.reason}

**Message Strategy:**
${rec.message.subject ? `**Subject:** ${rec.message.subject}` : ''}
**Content:** ${rec.message.content}
**Call to Action:** ${rec.message.call_to_action}

**Campaign Configuration:**
**Duration:** ${rec.campaign_config.duration}
${rec.campaign_config.budget ? `**Budget:** $${rec.campaign_config.budget.toLocaleString()}` : ''}

**Expected Results:**
- **Reach:** ${rec.campaign_config.expected_metrics.reach.toLocaleString()} people
- **Engagement Rate:** ${(rec.campaign_config.expected_metrics.engagement_rate * 100).toFixed(1)}%
- **Conversion Rate:** ${(rec.campaign_config.expected_metrics.conversion_rate * 100).toFixed(1)}%
    `.trim();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full max-h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Chat Assistant
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 min-h-0 max-h-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
        <div className="flex space-x-2">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about campaign strategies, audience insights, or marketing recommendations..."
            className="flex-1 resize-none rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            rows={2}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}