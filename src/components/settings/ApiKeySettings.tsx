'use client';

import { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, X } from 'lucide-react';

interface ApiKeySettingsProps {
  onApiKeyChange: (apiKey: string) => void;
}

export default function ApiKeySettings({ onApiKeyChange }: ApiKeySettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidKey, setIsValidKey] = useState<boolean | null>(null);

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('claude-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      onApiKeyChange(savedApiKey);
      validateApiKey(savedApiKey);
    }
  }, [onApiKeyChange]);

  const validateApiKey = (key: string) => {
    // Basic validation - Claude API keys start with 'sk-ant-'
    const isValid = key.startsWith('sk-ant-') && key.length > 20;
    setIsValidKey(isValid);
    return isValid;
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newKey = e.target.value;
    setApiKey(newKey);

    if (newKey) {
      validateApiKey(newKey);
      localStorage.setItem('claude-api-key', newKey);
      onApiKeyChange(newKey);
    } else {
      setIsValidKey(null);
      localStorage.removeItem('claude-api-key');
      onApiKeyChange('');
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    setIsValidKey(null);
    localStorage.removeItem('claude-api-key');
    onApiKeyChange('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Key className="w-5 h-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Claude API Configuration
        </h2>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Claude API Key
          </label>
          <div className="relative">
            <input
              id="api-key"
              type={showApiKey ? 'text' : 'password'}
              value={apiKey}
              onChange={handleApiKeyChange}
              placeholder="sk-ant-api..."
              className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
              {apiKey && (
                <button
                  type="button"
                  onClick={clearApiKey}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear API key"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                title={showApiKey ? 'Hide API key' : 'Show API key'}
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              {isValidKey !== null && (
                <div className={`${isValidKey ? 'text-green-500' : 'text-red-500'}`}>
                  {isValidKey ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={`text-xs p-3 rounded-lg ${
          apiKey
            ? isValidKey
              ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
              : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
            : 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
        }`}>
          {apiKey
            ? isValidKey
              ? '✅ Valid Claude API key detected. You\'ll receive real AI-powered campaign recommendations.'
              : '❌ Invalid API key format. Claude API keys should start with "sk-ant-" and be longer than 20 characters.'
            : '💡 Add your Claude API key to receive real AI-powered marketing campaign recommendations. Without an API key, you\'ll see demo responses.'
          }
        </div>

        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p className="mb-2">
            <strong>How to get your Claude API key:</strong>
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Visit <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">console.anthropic.com</a></li>
            <li>Sign up or log in to your account</li>
            <li>Navigate to &quot;API Keys&quot; in your dashboard</li>
            <li>Create a new API key and copy it here</li>
          </ol>
          <p className="mt-2 text-xs">
            🔒 Your API key is stored locally in your browser and never sent to our servers.
          </p>
        </div>
      </div>
    </div>
  );
}