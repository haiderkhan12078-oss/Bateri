import React from 'react';
import { Breadcrumbs } from '../ui/Breadcrumbs';
import { ShieldCheck, FileText, AlertTriangle, Info, Globe, Mail } from 'lucide-react';

interface StaticPageProps {
  onNavigate: (tab: any, subTab?: string, slug?: string) => void;
}

export const AboutPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'About Bateri.com' }]} onNavigate={onNavigate} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">About Bateri.com</h1>
        <p className="mt-2 text-sm text-blue-600 font-semibold">
          Global Battery, Automotive, Solar, EV and Energy Tools Platform
        </p>

        <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            <strong>Bateri.com</strong> is an independent, global engineering platform engineered to solve real-world electrical, automotive, and renewable energy challenges. We provide deterministic calculations, verified OEM vehicle battery fitments, step-by-step diagnostic troubleshooting trees, and authoritative technical guides.
          </p>
          <p>
            Whether you are an automotive technician diagnosing a parasitic battery drain, a solar homeowner sizing a 48V LiFePO4 battery bank, or an EV driver calculating highway range loss in freezing winter conditions, Bateri.com delivers accurate mathematical models and fact-checked standards based on Battery Council International (BCI), SAE, IEEE, and OEM specifications.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-4">Our Core Directives</h2>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
            <li><strong>Accuracy Over Assumptions:</strong> Deterministic physical formulas with clear Peukert effect, depth-of-discharge, and temperature derating.</li>
            <li><strong>Safety First:</strong> Clear warnings for high-voltage DC hazards, automotive alternator overcharging risks, and thermal runaway protocols.</li>
            <li><strong>Global Utility:</strong> Seamless conversions across metric and imperial standards (Wh, Ah, Watts, Amps, CCA, CA, Volts).</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} onNavigate={onNavigate} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Privacy Policy</h1>
        <p className="mt-1 text-xs text-slate-500">Last updated: December 2024</p>

        <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            At Bateri.com, accessible from https://bateri.com, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Bateri.com and how we use it.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">1. Information We Collect</h2>
          <p>
            All calculation engines, vehicle lookups, and diagnostic trees on Bateri.com operate client-side without storing personal user information. If you use the Bateri AI Assistant, chat queries are securely transmitted to provide diagnostic responses and are not sold to third-party brokers.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">2. Cookies and Web Beacons</h2>
          <p>
            Like any other website, Bateri.com uses standard cookies to maintain session states and analyze aggregated site traffic metrics. Third-party partners, including Google AdSense and analytics providers, may use cookies to serve non-intrusive advertisements based on prior visits.
          </p>

          <h2 className="text-base font-bold text-slate-900 pt-2">3. Google DoubleClick DART Cookie</h2>
          <p>
            Google is one of a third-party vendor on our site. It also uses cookies, known as DART cookies, to serve ads to our site visitors based upon their visit to bateri.com and other sites on the internet.
          </p>
        </div>
      </div>
    </div>
  );
};

export const TermsPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Terms of Service' }]} onNavigate={onNavigate} />
      <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Terms of Service</h1>
        <p className="mt-1 text-xs text-slate-500">Last updated: December 2024</p>

        <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            By accessing and using Bateri.com, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.
          </p>
          <p>
            All content, calculations, algorithms, and design elements on Bateri.com are protected by applicable copyright and intellectual property laws. Tools are provided for personal, educational, and professional reference.
          </p>
        </div>
      </div>
    </div>
  );
};

export const DisclaimerPage: React.FC<StaticPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-6">
      <Breadcrumbs items={[{ label: 'Engineering & Safety Disclaimer' }]} onNavigate={onNavigate} />
      <div className="rounded-2xl border border-amber-200 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-amber-600">
          <AlertTriangle className="h-6 w-6" />
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Engineering & Safety Disclaimer
          </h1>
        </div>

        <div className="mt-6 space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <strong>CRITICAL SAFETY WARNING:</strong> Automotive batteries, stationary high-capacity DC battery banks, and electric vehicle traction packs carry significant electrical, thermal, chemical, and explosive hazards. Never touch energized high-voltage orange cables, bridge positive and negative terminals, or charge damaged batteries.
          </div>

          <p>
            The calculations, estimations, diagnostic procedures, and vehicle specifications provided on Bateri.com are mathematical models and engineering guidelines provided strictly for informational and educational purposes.
          </p>
          <p>
            Real-world battery performance depends on manufacturing batch tolerances, internal resistance, ambient operating temperature, state of health (SoH), duty cycle history, and wiring resistance. Always cross-reference manufacturer OEM service documentation and adhere to local electrical codes (NEC, NFPA, IEC, SAE).
          </p>
        </div>
      </div>
    </div>
  );
};
