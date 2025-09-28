'use client';

import { Message } from '@/types';
import { User, Bot, Loader2 } from 'lucide-react';
import { JsonDisplay } from '@/components/ui/JsonDisplay';

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className={`flex space-x-3 ${message.isUser ? 'justify-end' : 'justify-start'}`}>
      {!message.isUser && (
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-white" />
        </div>
      )}

      <div className={`max-w-[80%] min-w-0 ${message.isUser ? 'order-first' : ''}`}>
        <div
          className={`rounded-lg px-4 py-2 overflow-hidden ${
            message.isUser
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          <div className="prose prose-sm max-w-none dark:prose-invert overflow-hidden">
            <div
              className="whitespace-pre-wrap break-words overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: message.content
                  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                  .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-800 text-gray-200 p-3 rounded text-sm overflow-auto max-h-60 border"><code>$1</code></pre>')
                  .replace(/\n/g, '<br>')
              }}
            />
          </div>
          {message.recommendation && !message.isStreaming && (
            <div className="mt-4">
              <div className="mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  📄 Campaign Configuration (JSON)
                </span>
              </div>
              <JsonDisplay
                data={message.recommendation}
                filename={`campaign-${message.recommendation.audience.segment.toLowerCase().replace(/\s+/g, '-')}`}
              />
            </div>
          )}
          {message.isStreaming && (
            <div className="flex items-center space-x-1 mt-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span className="text-xs opacity-70">Thinking...</span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {message.timestamp.toLocaleTimeString()}
        </div>
      </div>

      {message.isUser && (
        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-white" />
        </div>
      )}
    </div>
  );
}