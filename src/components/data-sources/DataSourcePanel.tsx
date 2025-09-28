'use client';

import { DataSource } from '@/types';
import { Database, Globe, ShoppingCart, CheckCircle, Circle } from 'lucide-react';

interface DataSourcePanelProps {
  dataSources: DataSource[];
  onToggle: (id: string) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'google-ads':
      return <Globe className="w-5 h-5" />;
    case 'facebook-pixel':
      return <Database className="w-5 h-5" />;
    case 'shopify':
      return <ShoppingCart className="w-5 h-5" />;
    default:
      return <Database className="w-5 h-5" />;
  }
};

export default function DataSourcePanel({ dataSources, onToggle }: DataSourcePanelProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Data Sources
      </h2>

      <div className="space-y-3">
        {dataSources.map((source) => (
          <div
            key={source.id}
            className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className={`text-gray-600 dark:text-gray-400 ${source.connected ? 'text-green-600 dark:text-green-400' : ''}`}>
                {getIcon(source.type)}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {source.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {source.connected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>

            <button
              onClick={() => onToggle(source.id)}
              className="flex items-center space-x-1"
            >
              {source.connected ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : (
                <Circle className="w-5 h-5 text-gray-400" />
              )}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-700 dark:text-blue-300">
          💡 Connect data sources to get more accurate campaign recommendations based on your actual customer data and performance metrics.
        </p>
      </div>
    </div>
  );
}