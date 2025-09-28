import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FlowNode, getNodeColor } from '@/lib/campaignFlowConverter';
import {
  Database, Users, MessageSquare, Zap, BarChart3,
  Play, CheckCircle, XCircle, Clock, Loader2
} from 'lucide-react';

const CustomNode: React.FC<NodeProps<FlowNode['data']>> = ({ data, selected }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'data': return <Database className="w-4 h-4" />;
      case 'audience': return <Users className="w-4 h-4" />;
      case 'channel': return <MessageSquare className="w-4 h-4" />;
      case 'content': return <MessageSquare className="w-4 h-4" />;
      case 'execution': return <Zap className="w-4 h-4" />;
      case 'analytics': return <BarChart3 className="w-4 h-4" />;
      default: return <Play className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running': return <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const colorClasses = getNodeColor(data.category, data.status);

  return (
    <div className={`
      relative px-4 py-3 rounded-lg min-w-[200px] max-w-[280px] backdrop-blur-sm
      ${selected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
      ${data.status === 'running' ? 'animate-pulse' : ''}
      ${data.status === 'completed' ? 'bg-green-100/90 dark:bg-green-800/90 border border-green-300/50 dark:border-green-600/50' :
        data.status === 'running' ? 'bg-blue-100/90 dark:bg-blue-800/90 border border-blue-300/50 dark:border-blue-600/50' :
        data.status === 'failed' ? 'bg-red-100/90 dark:bg-red-800/90 border border-red-300/50 dark:border-red-600/50' :
        'bg-white/90 dark:bg-gray-800/90 border border-gray-300/30 dark:border-gray-600/30'}
      transition-all duration-300 shadow-sm
    `}>
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />

      <div className="flex items-start space-x-3">
        <div className={`
          flex-shrink-0 p-2 rounded-lg text-white
          ${colorClasses}
        `}>
          {getCategoryIcon(data.category)}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">
              {data.label}
            </h3>
            {getStatusIcon(data.status)}
          </div>

          <p className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
            {data.description}
          </p>

          {data.status === 'running' && data.duration && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{Math.floor(data.duration / 1000)}s</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: '0%' }}
                />
              </div>
            </div>
          )}

          {data.details && data.status === 'completed' && (
            <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
              {data.category === 'audience' && typeof data.details?.size === 'number' && (
                <div>✓ {data.details.size.toLocaleString()} people targeted</div>
              )}
              {data.category === 'execution' && typeof data.details?.targetSize === 'number' && (
                <div>✓ Sent to {data.details.targetSize.toLocaleString()} recipients</div>
              )}
              {data.category === 'analytics' && typeof data.details?.expectedEngagement === 'number' && (
                <div>✓ {(data.details.expectedEngagement * 100).toFixed(1)}% engagement rate</div>
              )}
            </div>
          )}
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 !bg-gray-400 !border-2 !border-white"
      />
    </div>
  );
};

export default CustomNode;