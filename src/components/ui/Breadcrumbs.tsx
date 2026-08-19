import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { ActiveTab } from '../../types';

export interface BreadcrumbItem {
  label: string;
  tab?: ActiveTab;
  subTab?: string;
  slug?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  onNavigate: (tab: ActiveTab, subTab?: string, slug?: string) => void;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, onNavigate }) => {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 text-xs text-slate-500 font-medium">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="flex items-center gap-1 hover:text-blue-600 transition-colors"
          >
            <Home className="h-3.5 w-3.5" />
            <span>Home</span>
          </button>
        </li>

        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={idx} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
              {isLast || !item.tab ? (
                <span className="text-slate-800 font-semibold truncate max-w-[200px] sm:max-w-xs">
                  {item.label}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onNavigate(item.tab!, item.subTab, item.slug)}
                  className="hover:text-blue-600 transition-colors truncate max-w-[150px]"
                >
                  {item.label}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
