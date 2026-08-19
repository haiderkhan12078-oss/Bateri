import React from 'react';
import { Logo } from '../brand/Logo';
import { ActiveTab } from '../../types';
import { ShieldCheck, Globe, Zap, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: ActiveTab, subTab?: string, slug?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5 lg:gap-12">
          {/* Col 1: Brand & Positioning */}
          <div className="col-span-2 space-y-4">
            <Logo variant="light" size="lg" />
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Bateri.com is a global, independent engineering platform for battery calculation, automotive problem diagnosis, solar backup sizing, and EV battery technology.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5 text-slate-400">
                <Globe className="h-3.5 w-3.5 text-blue-400" />
                Global Edition (USA, CA, UK, EU, AU, ASIA)
              </span>
            </div>
          </div>

          {/* Col 2: Calculators & Converters */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Calculators & Tools
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('battery-tools', 'runtime-calculator')}
                  className="hover:text-white transition-colors"
                >
                  Battery Runtime Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('battery-tools', 'capacity-calculator')}
                  className="hover:text-white transition-colors"
                >
                  Battery Capacity Sizing
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('battery-tools', 'backup-calculator')}
                  className="hover:text-white transition-colors"
                >
                  Home Backup Power Sizer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('battery-tools', 'charging-time-calculator')}
                  className="hover:text-white transition-colors"
                >
                  Charging Time Estimator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('converters', 'ah-to-wh')}
                  className="hover:text-white transition-colors"
                >
                  Ah to Wh Converter
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('converters', 'watts-to-amps')}
                  className="hover:text-white transition-colors"
                >
                  Watts to Amps Converter
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Automotive & Diagnostics */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Automotive & Solar
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('car-problems', undefined, 'car-wont-start')}
                  className="hover:text-white transition-colors"
                >
                  Car Won’t Start Diagnostic
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('car-problems', undefined, 'battery-keeps-dying')}
                  className="hover:text-white transition-colors"
                >
                  Parasitic Drain Diagnostic
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('vehicle-battery')}
                  className="hover:text-white transition-colors"
                >
                  Vehicle Battery Group Finder
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solar', 'solar-battery-calculator')}
                  className="hover:text-white transition-colors"
                >
                  Solar Battery Bank Calculator
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('solar', 'inverter-calculator')}
                  className="hover:text-white transition-colors"
                >
                  Inverter & DC Cable Sizer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('ev', 'range-calculator')}
                  className="hover:text-white transition-colors"
                >
                  EV Range & Efficiency Sizer
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Knowledge & Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
              Guides & Legal
            </h3>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-400">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('guides', undefined, 'how-to-test-a-car-battery')}
                  className="hover:text-white transition-colors"
                >
                  Multimeter Testing Guide
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('comparisons', undefined, 'agm-vs-lead-acid')}
                  className="hover:text-white transition-colors"
                >
                  AGM vs. Lead-Acid
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Bateri.com
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('privacy')}
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('terms')}
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('disclaimer')}
                  className="hover:text-white transition-colors"
                >
                  Engineering Disclaimer
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('admin')}
                  className="hover:text-slate-200 transition-colors text-slate-500"
                >
                  Admin CMS
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="mt-10 border-t border-slate-800 pt-6 text-[11px] text-slate-500 leading-relaxed">
          <p>
            <strong>Engineering & Safety Notice:</strong> All calculators, diagnostics, and technical specifications on Bateri.com are deterministic engineering models and estimates provided for educational and informational purposes. Real-world battery performance varies with cell chemistry, state of health, ambient temperature, internal resistance, and manufacturing tolerances. High-voltage EV systems and automotive charging circuits present severe electrical and thermal hazards. Always verify vehicle specifications against your OEM service manual and consult certified automotive technicians for high-risk procedures.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-slate-400">
            <div>© {new Date().getFullYear()} Bateri.com. All rights reserved.</div>
            <div className="flex items-center gap-1 text-slate-500 text-[10px]">
              <span>Crafted for high accuracy and global utility</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
