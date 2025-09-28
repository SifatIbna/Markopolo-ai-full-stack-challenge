'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { CampaignRecommendation } from '@/types';
import CampaignExecutionFlow from '@/components/execution/CampaignExecutionFlow';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function ExecuteCampaignPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [campaign, setCampaign] = useState<CampaignRecommendation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client side to avoid hydration issues
    if (typeof window === 'undefined') return;

    // Try to get campaign data from URL params or localStorage
    const campaignData = searchParams.get('data');
    if (campaignData) {
      try {
        const parsedCampaign = JSON.parse(decodeURIComponent(campaignData));
        setCampaign(parsedCampaign);
      } catch (error) {
        console.error('Failed to parse campaign data:', error);
      }
    } else {
      // Fallback: try to get from localStorage
      const savedCampaign = localStorage.getItem(`campaign_${params.campaignId}`);
      if (savedCampaign) {
        try {
          setCampaign(JSON.parse(savedCampaign));
        } catch (error) {
          console.error('Failed to parse saved campaign:', error);
        }
      }
    }
    setIsLoading(false);
  }, [params.campaignId, searchParams]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading campaign...</p>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Campaign Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The campaign data could not be loaded. Please return to the chat and try again.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Link>
          <ThemeToggle />
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Campaign Execution: {campaign.campaign_id}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Target Audience: {campaign.audience.segment} ({campaign.audience.size.toLocaleString()} people)
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Primary Channel: {campaign.channel.primary}
          </p>
        </div>

        <CampaignExecutionFlow campaign={campaign} />
      </div>
    </div>
  );
}