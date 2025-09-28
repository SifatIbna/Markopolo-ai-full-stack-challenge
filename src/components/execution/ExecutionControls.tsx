import React from 'react';
import { Play, Pause, RotateCcw, Gauge } from 'lucide-react';

interface ExecutionControlsProps {
  isExecuting: boolean;
  progress: number;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  executionSpeed: number;
  onSpeedChange: (speed: number) => void;
  className?: string;
}

const ExecutionControls: React.FC<ExecutionControlsProps> = ({
  isExecuting,
  progress,
  onStart,
  onPause,
  onReset,
  executionSpeed,
  onSpeedChange,
  className = ''
}) => {
  const speedOptions = [
    { value: 0.5, label: '0.5x' },
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 4, label: '4x' }
  ];

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
      <div className="space-y-4">
        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
            <span>Campaign Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex items-center space-x-2">
          {!isExecuting ? (
            <button
              onClick={onStart}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
            >
              <Play className="w-4 h-4 mr-1" />
              Start
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              <Pause className="w-4 h-4 mr-1" />
              Pause
            </button>
          )}

          <button
            onClick={onReset}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            disabled={isExecuting}
          >
            <RotateCcw className="w-4 h-4 mr-1" />
            Reset
          </button>
        </div>

        {/* Speed Control */}
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <Gauge className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Execution Speed</span>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {speedOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => onSpeedChange(option.value)}
                className={`px-2 py-1 text-xs rounded border transition-colors ${
                  executionSpeed === option.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
                disabled={isExecuting}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Execution Status */}
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {isExecuting ? (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
              Executing campaign...
            </div>
          ) : progress === 100 ? (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
              Campaign completed
            </div>
          ) : (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-gray-400 rounded-full mr-2" />
              Ready to execute
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutionControls;