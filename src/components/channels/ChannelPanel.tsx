'use client';

import { Channel } from '@/types';
import { Mail, MessageSquare, Phone, Target, CheckCircle, Circle } from 'lucide-react';

interface ChannelPanelProps {
  channels: Channel[];
  onToggle: (id: string) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'email':
      return <Mail className="w-5 h-5" />;
    case 'sms':
      return <MessageSquare className="w-5 h-5" />;
    case 'whatsapp':
      return <Phone className="w-5 h-5" />;
    case 'ads':
      return <Target className="w-5 h-5" />;
    default:
      return <Mail className="w-5 h-5" />;
  }
};

export default function ChannelPanel({ channels, onToggle }: ChannelPanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Marketing Channels
      </h2>

      <div className="space-y-3">
        {channels.map((channel) => (
          <div
            key={channel.id}
            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`text-gray-600 dark:text-gray-400 ${channel.enabled ? 'text-green-600 dark:text-green-400' : ''}`}>
                {getIcon(channel.type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {channel.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {channel.enabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onToggle(channel.id)}
              className="flex items-center space-x-1"
            >
              {channel.enabled ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
        <p className="text-sm text-purple-700 dark:text-purple-300">
          🚀 Enable channels to receive campaign recommendations tailored to your available marketing platforms.
        </p>
      </div>
    </div>
  );
}