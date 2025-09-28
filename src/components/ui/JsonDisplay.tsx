'use client';

import { useState } from 'react';
import { Copy, Download, Check } from 'lucide-react';

interface JsonDisplayProps {
  data: object;
  filename?: string;
}

export function JsonDisplay({ data, filename = 'campaign-recommendation' }: JsonDisplayProps) {
  const [copied, setCopied] = useState(false);

  const jsonString = JSON.stringify(data, null, 2);

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

  return (
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
  );
}