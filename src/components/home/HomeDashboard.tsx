import React from 'react';
import { ActiveTab } from '../../types';
import { VEHICLE_BATTERY_DATABASE } from '../../data/vehicleDatabase';
import { COMMON_CAR_PROBLEMS } from '../../data/carProblemsData';
import { GUIDES_DATABASE } from '../../data/guidesData';
import { COMPARISONS_DATABASE } from '../../data/comparisonsData';
import {
  Calculator,
  Repeat,
  Wrench,
  Car,
  Sun,
  Zap,
  BookOpen,
  Scale,
  Bot,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  TrendingUp,
  Search,
} from 'lucide-react';

interface HomeDashboardProps {
  onNavigate: (tab: ActiveTab, subTab?: string, slug?: string) => void;
  onOpenSearch: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onNavigate, onOpenSearch }) => {
  const featuredVehicles = VEHICLE_BATTERY_DATABASE.slice(0, 4);
  const featuredGuides = GUIDES_DATABASE.slice(0, 3);
  const featuredComparisons = COMPARISONS_DATABASE.slice(0, 2);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 p-8 sm:p-12 text-white shadow-xl">
        {/* Background Subtle Accent Spark */}
        <div className="absolute top-0 right-0 -mt-12 -mr-12 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-12 -ml-12 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-500/10 border border-blue-400/30 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <ShieldCheck className="h-4 w-4 text-blue-400" />
            <span>Independent Global Battery & Energy Engineering Platform</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Calculate, Diagnose, Compare, and Master Battery Systems.
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            Deterministic engineering calculators for battery runtime and capacity, verified OEM vehicle battery fitment specs, step-by-step diagnostic trees, and off-grid solar storage sizers.
          </p>

          {/* Quick Search Bar in Hero */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="button"
              onClick={onOpenSearch}
              className="flex w-full sm:w-auto flex-1 items-center justify-between rounded-xl bg-slate-800/90 border border-slate-700 px-4 py-3 text-xs text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all shadow-inner"
            >
              <div className="flex items-center gap-2.5">
                <Search className="h-4 w-4 text-blue-400" />
                <span>Search battery tools, vehicle specs (e.g. Corolla, F-150), or guides...</span>
              </div>
              <kbd className="hidden sm:inline-block rounded bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                ⌘K
              </kbd>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('ai')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white hover:bg-blue-500 shadow-md transition-all whitespace-nowrap"
            >
              <Bot className="h-4 w-4" />
              <span>Ask Bateri AI</span>
            </button>
          </div>
        </div>

        {/* 4 Core Pillars Action Grid */}
        <div className="relative z-10 mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Card 1 */}
          <button
            type="button"
            onClick={() => onNavigate('battery-tools', 'runtime-calculator')}
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-800/60 p-5 text-left transition-all hover:border-blue-500/60 hover:bg-slate-800 shadow-sm"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white group-hover:scale-105 transition-transform">
                <Calculator className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white group-hover:text-blue-300 transition-colors">
                Battery Runtime Calculator
              </h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Compute runtime for any load (Watts) across LiFePO4, AGM, and Gel batteries.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Calculator</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>

          {/* Card 2 */}
          <button
            type="button"
            onClick={() => onNavigate('vehicle-battery')}
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-800/60 p-5 text-left transition-all hover:border-blue-500/60 hover:bg-slate-800 shadow-sm"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white group-hover:scale-105 transition-transform">
                <Car className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                Vehicle Battery Group Finder
              </h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Look up exact BCI Group Sizes, min CCA ratings, and tray dimensions by Make & Model.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Find Fitment</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>

          {/* Card 3 */}
          <button
            type="button"
            onClick={() => onNavigate('car-problems', undefined, 'car-wont-start')}
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-800/60 p-5 text-left transition-all hover:border-amber-500/60 hover:bg-slate-800 shadow-sm"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-white group-hover:scale-105 transition-transform">
                <Wrench className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white group-hover:text-amber-300 transition-colors">
                Car Won’t Start Diagnostic
              </h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Decision tree to isolate dead battery, starter clicking, or alternator charging fault.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>Start Diagnostic</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>

          {/* Card 4 */}
          <button
            type="button"
            onClick={() => onNavigate('solar', 'solar-battery-calculator')}
            className="group flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-800/60 p-5 text-left transition-all hover:border-cyan-500/60 hover:bg-slate-800 shadow-sm"
          >
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600 text-white group-hover:scale-105 transition-transform">
                <Sun className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                Solar Battery Bank Sizer
              </h3>
              <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                Size 12V, 24V, and 48V off-grid battery storage with days of autonomy and winter derating.
              </p>
            </div>
            <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>Size Solar Bank</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>
      </section>

      {/* Section 2: Popular Calculators & Converters Suite */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-blue-600" />
              Calculators & Unit Converters
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              High-precision deterministic formulas for battery life, charging duration, and power conversion.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('converters')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 self-start sm:self-auto"
          >
            View all converters →
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              title: 'Ah to Wh Converter',
              tab: 'converters',
              subTab: 'ah-to-wh',
              desc: 'Convert Amp-Hours to Watt-Hours with voltage multiplication: Wh = Ah × V.',
              icon: Repeat,
            },
            {
              title: 'Watts to Amps Converter',
              tab: 'converters',
              subTab: 'watts-to-amps',
              desc: 'Determine electrical current draw (Amps) for 12V, 24V, 120V, and 230V systems.',
              icon: Zap,
            },
            {
              title: 'Battery Capacity Sizing',
              tab: 'battery-tools',
              subTab: 'capacity-calculator',
              desc: 'Calculate required Ah/Wh to power equipment for desired hours with DoD buffer.',
              icon: Calculator,
            },
            {
              title: 'Home Backup Sizer',
              tab: 'battery-tools',
              subTab: 'backup-calculator',
              desc: 'Build custom appliance lists to compute daily energy needs and inverter size.',
              icon: ShieldCheck,
            },
            {
              title: 'EV Range & Consumption',
              tab: 'ev',
              subTab: 'range-calculator',
              desc: 'Simulate highway range factoring cold temperatures, speed, and HVAC heating.',
              icon: Zap,
            },
            {
              title: 'Inverter & Cable Gauge Sizer',
              tab: 'solar',
              subTab: 'inverter-calculator',
              desc: 'Size continuous wattage, surge requirements, and safe DC copper cable gauge.',
              icon: Sun,
            },
          ].map((tool, idx) => {
            const Icon = tool.icon;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => onNavigate(tool.tab as any, tool.subTab)}
                className="group flex flex-col justify-between rounded-xl border border-slate-200 p-4 text-left hover:border-blue-500 hover:shadow-xs transition-all bg-slate-50/50"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {tool.title}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-500 leading-relaxed">{tool.desc}</p>
                </div>
                <div className="mt-3 text-[11px] font-semibold text-blue-600 group-hover:underline">
                  Open Tool →
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Section 3: Verified Vehicle Battery Fitments */}
      <section className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Car className="h-5 w-5 text-blue-600" />
              Verified OEM Vehicle Battery Specifications
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              BCI Group Size, minimum CCA, tray dimensions, and Start-Stop AGM requirements.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('vehicle-battery')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-800 self-start sm:self-auto"
          >
            Browse all vehicles →
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {featuredVehicles.map((v) => (
            <div
              key={v.id}
              onClick={() => onNavigate('vehicle-battery', undefined, v.id)}
              className="group cursor-pointer rounded-xl border border-slate-200 p-4 shadow-2xs hover:border-blue-500 hover:shadow-xs transition-all bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {v.make} {v.model}
                  </span>
                  <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200 font-mono">
                    {v.groupSize}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-slate-500">{v.years} · {v.engine}</p>
                <div className="mt-2 text-[11px] text-slate-600">
                  <span>Min CCA: <strong>{v.minCCA}</strong></span> · <span>{v.chemistry}</span>
                </div>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] font-semibold text-blue-600">
                View Full Dimensions →
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4: Diagnostic Guides & Comparisons */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Guides Column */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-600" />
                Featured Technical Guides
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('guides')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                All Guides →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {featuredGuides.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => onNavigate('guides', undefined, guide.slug)}
                  className="cursor-pointer rounded-lg p-3 hover:bg-slate-50 transition-colors border border-slate-100"
                >
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                      {guide.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{guide.readTimeMinutes} min read</span>
                  </div>
                  <h4 className="mt-1 text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {guide.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                    {guide.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparisons Column */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Scale className="h-4 w-4 text-blue-600" />
                Engineering Comparisons
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('comparisons')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                All Comparisons →
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {featuredComparisons.map((comp) => (
                <div
                  key={comp.id}
                  onClick={() => onNavigate('comparisons', undefined, comp.slug)}
                  className="cursor-pointer rounded-lg p-3 hover:bg-slate-50 transition-colors border border-slate-100"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                    Technology Matchup
                  </span>
                  <h4 className="mt-1 text-xs font-bold text-slate-900 hover:text-blue-600 transition-colors">
                    {comp.title}
                  </h4>
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2">
                    {comp.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
