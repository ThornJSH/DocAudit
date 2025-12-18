
import React from 'react';
import { AnalysisMode } from '../types';
import { MODE_LABELS } from '../constants';
import { ChevronDown } from 'lucide-react';

interface Props {
  currentMode: AnalysisMode;
  onModeChange: (mode: AnalysisMode) => void;
  disabled?: boolean;
}

const ModeSelector: React.FC<Props> = ({ currentMode, onModeChange, disabled }) => {
  return (
    <div className="relative">
      <select
        value={currentMode}
        onChange={(e) => onModeChange(e.target.value as AnalysisMode)}
        disabled={disabled}
        className="w-full appearance-none bg-white border border-gray-200 rounded-lg py-3 px-4 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all disabled:bg-gray-50 disabled:text-gray-400"
      >
        {Object.entries(MODE_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
        <ChevronDown className="w-4 h-4" />
      </div>
    </div>
  );
};

export default ModeSelector;
