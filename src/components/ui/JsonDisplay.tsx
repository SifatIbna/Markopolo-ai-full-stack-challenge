'use client';

import { useState } from 'react';
import { Copy, Download, Check, Play } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { CampaignRecommendation } from '@/types';

interface JsonDisplayProps {
  data: object;
  filename?: string;
}

export function JsonDisplay({ data, filename = 'campaign-recommendation' }: JsonDisplayProps) {
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const jsonString = JSON.stringify(data, null, 2);

  // Check if this is a campaign recommendation with required fields
  const isCampaignRecommendation = (obj: unknown): obj is CampaignRecommendation => {
    const candidate = obj as Record<string, unknown>;
    return candidate &&
           typeof candidate.campaign_id === 'string' &&
           typeof candidate.audience === 'object' &&
           typeof candidate.channel === 'object' &&
           typeof candidate.message === 'object' &&
           typeof candidate.campaign_config === 'object';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExecuteCampaign = () => {
    if (isCampaignRecommendation(data)) {
      const campaignId = data.campaign_id;

      // Save campaign to localStorage for the execution page (only on client side)
      if (typeof window !== 'undefined') {
        localStorage.setItem(`campaign_${campaignId}`, JSON.stringify(data));
      }

      // Navigate to execution page
      router.push(`/execute/${campaignId}?data=${encodeURIComponent(JSON.stringify(data))}`);
    }
  };

  const showExecuteButton = isCampaignRecommendation(data);

  return (
    <div className="relative">
      {/* Execute Campaign Button - Full Width */}
      {showExecuteButton && (
        <div className="mb-3">
          <button
            onClick={handleExecuteCampaign}
            className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-sm"
          >
            <Play className="w-4 h-4 mr-2" />
            Execute Campaign
          </button>
        </div>
      )}

      {/* JSON Display with Action Buttons */}
      <div className="relative">
        <div className="absolute top-2 right-2 flex space-x-1 z-10">
          <button
            onClick={handleCopy}
            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Copy to clipboard"
          >
            {copied ? (
              <Check className="w-3 h-3 text-green-400" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
          <button
            onClick={handleDownload}
            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded text-gray-300 hover:text-white transition-colors"
            title="Download as JSON file"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
        <pre className="bg-gray-800 text-green-400 p-3 rounded text-xs overflow-auto max-h-60 border pr-16">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
}