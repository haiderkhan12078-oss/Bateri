import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Calculator, Repeat, Wrench, Car, BookOpen, Scale, ArrowRight } from 'lucide-react';
import { ActiveTab } from '../../types';
import { VEHICLE_BATTERY_DATABASE } from '../../data/vehicleDatabase';
import { COMMON_CAR_PROBLEMS } from '../../data/carProblemsData';
import { GUIDES_DATABASE } from '../../data/guidesData';
import { COMPARISONS_DATABASE } from '../../data/comparisonsData';

interface SearchResultItem {
  id: string;
  title: string;
  category: 'Tools' | 'Converters' | 'Car Problems' | 'Vehicles' | 'Guides' | 'Comparisons';
  snippet: string;
  tab: ActiveTab;
  subTab?: string;
  slug?: string;
  icon: any;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: ActiveTab, subTab?: string, slug?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Keyboard shortcut listener (Cmd+K / Ctrl+K & Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Trigger search open
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build searchable index
  const allSearchItems: SearchResultItem[] = [
    // Calculators
    {
      id: 'tool-runtime',
      title: 'Battery Runtime Calculator',
      category: 'Tools',
      snippet: 'Calculate how long a battery will last based on voltage, capacity (Ah), and load (Watts).',
      tab: 'battery-tools',
      subTab: 'runtime-calculator',
      icon: Calculator,
    },
    {
      id: 'tool-capacity',
      title: 'Battery Capacity Calculator',
      category: 'Tools',
      snippet: 'Determine required Amp-Hours and Watt-Hours for desired load and runtime hours.',
      tab: 'battery-tools',
      subTab: 'capacity-calculator',
      icon: Calculator,
    },
    {
      id: 'tool-backup',
      title: 'Home / Off-Grid Backup Calculator',
      category: 'Tools',
      snippet: 'Size multi-voltage battery banks (12V, 24V, 48V) and inverters for appliances.',
      tab: 'battery-tools',
      subTab: 'backup-calculator',
      icon: Calculator,
    },
    {
      id: 'tool-charging',
      title: 'Charging Time Calculator',
      category: 'Tools',
      snippet: 'Estimate Constant Current and Absorption charging duration across chemistries.',
      tab: 'battery-tools',
      subTab: 'charging-time-calculator',
      icon: Calculator,
    },
    {
      id: 'tool-solar-bank',
      title: 'Solar Battery Bank Sizing Calculator',
      category: 'Tools',
      snippet: 'Calculate required kWh storage with days of autonomy, DoD, and temperature derating.',
      tab: 'solar',
      subTab: 'solar-battery-calculator',
      icon: Calculator,
    },
    {
      id: 'tool-inverter',
      title: 'Inverter & DC Cable Sizer',
      category: 'Tools',
      snippet: 'Determine continuous and surge wattage ratings, max DC amperage, and AWG wire gauge.',
      tab: 'solar',
      subTab: 'inverter-calculator',
      icon: Calculator,
    },
    {
      id: 'tool-ev-range',
      title: 'EV Range & Consumption Calculator',
      category: 'Tools',
      snippet: 'Simulate electric vehicle real-world range factoring temperature, HVAC, and speed.',
      tab: 'ev',
      subTab: 'range-calculator',
      icon: Calculator,
    },
    {
      id: 'tool-ev-charging',
      title: 'EV Charging Time & Cost Calculator',
      category: 'Tools',
      snippet: 'Calculate Level 1, Level 2, and DC Fast charging speed, taper curves, and energy cost.',
      tab: 'ev',
      subTab: 'charging-time',
      icon: Calculator,
    },

    // Converters
    {
      id: 'conv-ah-to-wh',
      title: 'Ah to Wh Converter (Amp-Hours to Watt-Hours)',
      category: 'Converters',
      snippet: 'Convert Amp-Hours into Watt-Hours using voltage formula Wh = Ah × V.',
      tab: 'converters',
      subTab: 'ah-to-wh',
      icon: Repeat,
    },
    {
      id: 'conv-wh-to-ah',
      title: 'Wh to Ah Converter (Watt-Hours to Amp-Hours)',
      category: 'Converters',
      snippet: 'Calculate Amp-Hours from Watt-Hours: Ah = Wh ÷ V.',
      tab: 'converters',
      subTab: 'wh-to-ah',
      icon: Repeat,
    },
    {
      id: 'conv-watts-to-amps',
      title: 'Watts to Amps Converter',
      category: 'Converters',
      snippet: 'Calculate electrical current draw in Amps from Watts and system voltage.',
      tab: 'converters',
      subTab: 'watts-to-amps',
      icon: Repeat,
    },
    {
      id: 'conv-mah-to-wh',
      title: 'mAh to Wh Converter',
      category: 'Converters',
      snippet: 'Convert power bank and drone battery milliamp-hours to Watt-hours.',
      tab: 'converters',
      subTab: 'mah-to-wh',
      icon: Repeat,
    },

    // Car Problems
    ...COMMON_CAR_PROBLEMS.map((prob) => ({
      id: `prob-${prob.slug}`,
      title: prob.title,
      category: 'Car Problems' as const,
      snippet: prob.shortDescription,
      tab: 'car-problems' as const,
      slug: prob.slug,
      icon: Wrench,
    })),

    // Vehicles
    ...VEHICLE_BATTERY_DATABASE.map((v) => ({
      id: `veh-${v.id}`,
      title: `${v.make} ${v.model} (${v.years}) Battery Group Size`,
      category: 'Vehicles' as const,
      snippet: `Battery Group Size: ${v.groupSize} | Min CCA: ${v.minCCA} | Chemistry: ${v.chemistry}`,
      tab: 'vehicle-battery' as const,
      slug: v.id,
      icon: Car,
    })),

    // Guides
    ...GUIDES_DATABASE.map((g) => ({
      id: `guide-${g.slug}`,
      title: g.title,
      category: 'Guides' as const,
      snippet: g.summary,
      tab: 'guides' as const,
      slug: g.slug,
      icon: BookOpen,
    })),

    // Comparisons
    ...COMPARISONS_DATABASE.map((c) => ({
      id: `comp-${c.slug}`,
      title: c.title,
      category: 'Comparisons' as const,
      snippet: c.summary,
      tab: 'comparisons' as const,
      slug: c.slug,
      icon: Scale,
    })),
  ];

  const q = query.toLowerCase().trim();
  const results = q
    ? allSearchItems.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.snippet.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      )
    : allSearchItems.slice(0, 8); // Top featured items when search box is empty

  const handleSelect = (item: SearchResultItem) => {
    onNavigate(item.tab, item.subTab, item.slug);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/60 p-4 pt-16 sm:pt-24 backdrop-blur-xs">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Input Header */}
        <div className="relative flex items-center border-b border-slate-200 px-4 py-3.5">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search a tool, vehicle (e.g. Corolla, F-150), car problem, or guide..."
            className="w-full bg-transparent pl-3 pr-8 text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No results found for &ldquo;<span className="font-semibold text-slate-700">{query}</span>&rdquo;.
              Try searching for &ldquo;Ah to Wh&rdquo;, &ldquo;Corolla&rdquo;, &ldquo;Clicking sound&rdquo;, or &ldquo;Multimeter&rdquo;.
            </div>
          ) : (
            <div className="space-y-1">
              {results.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className="group flex w-full items-start gap-3 rounded-xl p-3 text-left transition-colors hover:bg-slate-100/80 focus:bg-blue-50 focus:outline-none"
                  >
                    <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 truncate">
                          {item.title}
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 border border-slate-200">
                          {item.category}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500 line-clamp-1">
                        {item.snippet}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-600 self-center opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-4 py-2 text-[11px] text-slate-500">
          <span>Global technical search indexed</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
