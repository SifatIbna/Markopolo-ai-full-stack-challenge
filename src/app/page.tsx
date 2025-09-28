'use client';

import { useState } from 'react';
import ChatInterface from '@/components/chat/ChatInterface';
import DataSourcePanel from '@/components/data-sources/DataSourcePanel';
import ChannelPanel from '@/components/channels/ChannelPanel';
import ApiKeySettings from '@/components/settings/ApiKeySettings';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { DataSource, Channel } from '@/types';

export default function Home() {
  const [dataSources, setDataSources] = useState<DataSource[]>([
    { id: '1', name: 'Google Ads', type: 'google-ads', connected: false },
    { id: '2', name: 'Facebook Pixel', type: 'facebook-pixel', connected: false },
    { id: '3', name: 'Shopify Store', type: 'shopify', connected: false },
  ]);

  const [channels, setChannels] = useState<Channel[]>([
    { id: '1', name: 'Email Marketing', type: 'email', enabled: false },
    { id: '2', name: 'SMS Campaigns', type: 'sms', enabled: false },
    { id: '3', name: 'WhatsApp Business', type: 'whatsapp', enabled: false },
    { id: '4', name: 'Advertising Platforms', type: 'ads', enabled: false },
  ]);

  const [apiKey, setApiKey] = useState<string>('');

  const toggleDataSource = (id: string) => {
    setDataSources(prev =>
      prev.map(ds =>
        ds.id === id ? { ...ds, connected: !ds.connected } : ds
      )
    );
  };

  const toggleChannel = (id: string) => {
    setChannels(prev =>
      prev.map(ch =>
        ch.id === id ? { ...ch, enabled: !ch.enabled } : ch
      )
    );
  };

  return (
    <div className="h-screen max-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col overflow-hidden">
      <div className="container mx-auto px-4 py-4 flex-1 flex flex-col min-h-0 max-h-full">
        <header className="mb-6 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              AI Marketing Assistant
            </h1>
            <ThemeToggle />
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Connect your data sources and channels to get personalized campaign recommendations
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0 max-h-full overflow-hidden">
          <div className="lg:col-span-1 space-y-6 overflow-y-auto max-h-full">
            <ApiKeySettings onApiKeyChange={setApiKey} />
            <DataSourcePanel
              dataSources={dataSources}
              onToggle={toggleDataSource}
            />
            <ChannelPanel
              channels={channels}
              onToggle={toggleChannel}
            />
          </div>

          <div className="lg:col-span-3 flex flex-col min-h-0 max-h-full overflow-hidden">
            <ChatInterface
              dataSources={dataSources}
              channels={channels}
              apiKey={apiKey}
            />
          </div>
        </div>
      </div>
    </div>
  );
}