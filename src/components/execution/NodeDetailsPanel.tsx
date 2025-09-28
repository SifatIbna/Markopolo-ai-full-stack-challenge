import React from 'react';
import { X, Clock, CheckCircle, XCircle, Loader2, Info } from 'lucide-react';
import { FlowNode } from '@/lib/campaignFlowConverter';

interface NodeDetailsPanelProps {
  node: FlowNode;
  onClose: () => void;
  className?: string;
}

const NodeDetailsPanel: React.FC<NodeDetailsPanelProps> = ({
  node,
  onClose,
  className = ''
}) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: <Clock className="w-5 h-5 text-gray-400" />,
          text: 'Waiting to execute',
          color: 'text-gray-600 dark:text-gray-400'
        };
      case 'running':
        return {
          icon: <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />,
          text: 'Currently executing',
          color: 'text-blue-600 dark:text-blue-400'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="w-5 h-5 text-green-500" />,
          text: 'Successfully completed',
          color: 'text-green-600 dark:text-green-400'
        };
      case 'failed':
        return {
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          text: 'Execution failed',
          color: 'text-red-600 dark:text-red-400'
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-gray-400" />,
          text: 'Unknown status',
          color: 'text-gray-600 dark:text-gray-400'
        };
    }
  };

  const statusInfo = getStatusInfo(node.data.status);

  const renderDetails = () => {
    if (!node.data.details) return null;

    const { details, category } = node.data;

    switch (category) {
      case 'audience':
        return (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Target Segment</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.segment === 'string' ? details.segment : 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Audience Size</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.size === 'number' ? details.size.toLocaleString() : 'N/A'} people
              </p>
            </div>
            {typeof details.demographics === 'object' && details.demographics && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Demographics</h4>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p>Age: {typeof details.demographics === 'object' && details.demographics && 'age_range' in details.demographics ? String(details.demographics.age_range) : 'N/A'}</p>
                  <p>Location: {typeof details.demographics === 'object' && details.demographics && 'location' in details.demographics ? String(details.demographics.location) : 'N/A'}</p>
                  {typeof details.demographics === 'object' && details.demographics && 'interests' in details.demographics && Array.isArray(details.demographics.interests) && (
                    <p>Interests: {details.demographics.interests.join(', ')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'channel':
        return (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Primary Channel</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.primary === 'string' ? details.primary : 'N/A'}
              </p>
            </div>
            {Array.isArray(details.secondary) && details.secondary.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Secondary Channels</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {details.secondary.map(String).join(', ')}
                </p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Reasoning</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.reason === 'string' ? details.reason : 'N/A'}
              </p>
            </div>
          </div>
        );

      case 'content':
        return (
          <div className="space-y-3">
            {typeof details.subject === 'string' && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Subject/Headline</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{details.subject}</p>
              </div>
            )}
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Content</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.content === 'string' ? details.content : 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Call to Action</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.cta === 'string' ? details.cta : 'N/A'}
              </p>
            </div>
          </div>
        );

      case 'execution':
        return (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Channel</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.channel === 'string' ? details.channel : 'N/A'}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Target Size</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.targetSize === 'number' ? details.targetSize.toLocaleString() : 'N/A'} recipients
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Timing</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.timing === 'string' ? details.timing : 'N/A'}
              </p>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Expected Reach</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.expectedReach === 'number' ? details.expectedReach.toLocaleString() : 'N/A'} people
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Expected Engagement</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.expectedEngagement === 'number' ? (details.expectedEngagement * 100).toFixed(1) : 'N/A'}%
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">Expected Conversion</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {typeof details.expectedConversion === 'number' ? (details.expectedConversion * 100).toFixed(1) : 'N/A'}%
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            No additional details available for this step.
          </div>
        );
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 h-full overflow-y-auto ${className}`}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Node Details
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Node Header */}
        <div>
          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            {node.data.label}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
            {node.data.description}
          </p>

          {/* Status */}
          <div className="flex items-center space-x-2">
            {statusInfo.icon}
            <span className={`text-sm font-medium ${statusInfo.color}`}>
              {statusInfo.text}
            </span>
          </div>
        </div>

        {/* Duration Info */}
        {node.data.duration && (
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
              Execution Duration
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {Math.floor(node.data.duration / 1000)} seconds
            </p>
          </div>
        )}

        {/* Detailed Information */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
            Step Details
          </h4>
          {renderDetails()}
        </div>

        {/* Category Badge */}
        <div className="flex justify-end">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {node.data.category}
          </span>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsPanel;