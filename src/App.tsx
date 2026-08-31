import React, { useState, useEffect, useCallback } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from '@vercel/analytics/react';
import { ActiveTab } from './types';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { GlobalSearchModal } from './components/search/GlobalSearchModal';
import { AdSlot } from './components/ui/AdSlot';

// Page & Hub Components
import { HomeDashboard } from './components/home/HomeDashboard';
import { BatteryRuntimeCalculator } from './components/calculators/BatteryRuntimeCalculator';
import { BatteryCapacityCalculator } from './components/calculators/BatteryCapacityCalculator';
import { BatteryBackupCalculator } from './components/calculators/BatteryBackupCalculator';
import { ChargingTimeCalculator } from './components/calculators/ChargingTimeCalculator';
import { SolarBankCalculator } from './components/calculators/SolarBankCalculator';
import { InverterCalculator } from './components/calculators/InverterCalculator';
import { EVRangeCalculator } from './components/calculators/EVRangeCalculator';
import { EVChargingCalculator } from './components/calculators/EVChargingCalculator';
import { ConverterTool } from './components/calculators/ConverterTool';
import { CarProblemsHub } from './components/automotive/CarProblemsHub';
import { VehicleBatteryFinder } from './components/automotive/VehicleBatteryFinder';
import { GuidesHub } from './components/guides/GuidesHub';
import { ComparisonsHub } from './components/comparisons/ComparisonsHub';
import { BateriAIAssistant } from './components/ai/BateriAIAssistant';
import { AdminPortal } from './components/admin/AdminPortal';
import { AboutPage, PrivacyPage, TermsPage, DisclaimerPage } from './components/static/StaticPages';

export function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activeSubTab, setActiveSubTab] = useState<string | undefined>(undefined);
  const [activeSlug, setActiveSlug] = useState<string | undefined>(undefined);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Navigate handler
  const handleNavigate = useCallback(
    (tab: ActiveTab, subTab?: string, slug?: string) => {
      setActiveTab(tab);
      setActiveSubTab(subTab);
      setActiveSlug(slug);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    []
  );

  // Keyboard shortcut for search (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Render appropriate view based on tab & sub-tab
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeDashboard
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        );

      case 'battery-tools': {
        const subTab = activeSubTab || 'runtime-calculator';
        return (
          <div className="space-y-6">
            {/* Sub-navigation tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
              {[
                { id: 'runtime-calculator', label: 'Battery Runtime' },
                { id: 'capacity-calculator', label: 'Capacity Sizing' },
                { id: 'backup-calculator', label: 'Home Backup Sizer' },
                { id: 'charging-calculator', label: 'Charge Duration' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSubTab(sub.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    subTab === sub.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {subTab === 'runtime-calculator' && <BatteryRuntimeCalculator />}
            {subTab === 'capacity-calculator' && <BatteryCapacityCalculator />}
            {subTab === 'backup-calculator' && <BatteryBackupCalculator />}
            {subTab === 'charging-calculator' && <ChargingTimeCalculator />}
          </div>
        );
      }

      case 'converters':
        return <ConverterTool initialSubTab={activeSubTab || 'ah-to-wh'} />;

      case 'car-problems':
        return <CarProblemsHub initialSlug={activeSlug} onNavigate={handleNavigate} />;

      case 'vehicle-battery':
        return (
          <VehicleBatteryFinder
            initialVehicleId={activeSlug}
            onNavigate={handleNavigate}
          />
        );

      case 'solar': {
        const solarSub = activeSubTab || 'solar-battery-calculator';
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
              {[
                { id: 'solar-battery-calculator', label: 'Solar Battery Bank Sizer' },
                { id: 'inverter-calculator', label: 'Inverter & Cable Gauge Sizer' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSubTab(sub.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    solarSub === sub.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {solarSub === 'solar-battery-calculator' && <SolarBankCalculator />}
            {solarSub === 'inverter-calculator' && <InverterCalculator />}
          </div>
        );
      }

      case 'ev': {
        const evSub = activeSubTab || 'range-calculator';
        return (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-1.5 border-b border-slate-200 pb-3">
              {[
                { id: 'range-calculator', label: 'EV Range & Highway Degradation' },
                { id: 'charging-calculator', label: 'EV Charging Time & Cost' },
              ].map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setActiveSubTab(sub.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    evSub === sub.id
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {evSub === 'range-calculator' && <EVRangeCalculator />}
            {evSub === 'charging-calculator' && <EVChargingCalculator />}
          </div>
        );
      }

      case 'guides':
        return <GuidesHub initialSlug={activeSlug} onNavigate={handleNavigate} />;

      case 'comparisons':
        return <ComparisonsHub initialSlug={activeSlug} onNavigate={handleNavigate} />;

      case 'ai':
        return <BateriAIAssistant onNavigate={handleNavigate} />;

      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;

      case 'privacy':
        return <PrivacyPage onNavigate={handleNavigate} />;

      case 'terms':
        return <TermsPage onNavigate={handleNavigate} />;

      case 'disclaimer':
        return <DisclaimerPage onNavigate={handleNavigate} />;

      case 'admin':
        return <AdminPortal onNavigate={handleNavigate} />;

      default:
        return (
          <HomeDashboard
            onNavigate={handleNavigate}
            onOpenSearch={() => setIsSearchOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 text-slate-900 selection:bg-blue-600 selection:text-white font-sans antialiased">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {renderContent()}

        {/* Responsive In-Content Monetization Banner */}
        <div className="mt-12">
          <AdSlot
            slotName="Responsive Footer Leaderboard"
            format="leaderboard"
            aspectRatio="728x90"
          />
        </div>
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Vercel Speed Insights */}
      <SpeedInsights />
      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
}

export default App;
