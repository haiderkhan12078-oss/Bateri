import React, { useState } from 'react';
import { Info, ChevronDown, ChevronUp } from 'lucide-react';

interface FormulaCardProps {
  formula: string;
  assumptions: string[];
  title?: string;
  defaultExpanded?: boolean;
}

export const FormulaCard: React.FC<FormulaCardProps> = ({
  formula,
  assumptions,
  title = 'Calculation Formula & Engineering Assumptions',
  defaultExpanded = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-all">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between text-left text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-slate-900 focus:outline-none"
        aria-expanded={isExpanded}
      >
        <span className="flex items-center gap-1.5">
          <Info className="h-4 w-4 text-blue-600" />
          {title}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-3 space-y-3 pt-2 border-t border-slate-200/60 text-xs text-slate-700">
          {formula && (
            <div>
              <span className="font-semibold text-slate-800">Formula Used:</span>
              <div className="mt-1 rounded-md bg-white p-2.5 font-mono text-xs text-blue-900 border border-slate-200 shadow-xs">
                {formula}
              </div>
            </div>
          )}

          {assumptions && assumptions.length > 0 && (
            <div>
              <span className="font-semibold text-slate-800">Engineered Assumptions:</span>
              <ul className="mt-1 list-disc pl-4 space-y-1 text-slate-600">
                {assumptions.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
