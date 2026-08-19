import React, { useState } from 'react';
import { Logo } from '../brand/Logo';
import { ActiveTab } from '../../types';
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
  Search,
  Menu,
  X,
  ShieldAlert,
} from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab, subTab?: string, slug?: string) => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'battery-tools', label: 'Battery Tools', icon: Calculator },
    { id: 'converters', label: 'Converters', icon: Repeat },
    { id: 'car-problems', label: 'Car Problems', icon: Wrench },
    { id: 'vehicle-battery', label: 'Vehicle Battery', icon: Car },
    { id: 'solar', label: 'Solar & Energy', icon: Sun },
    { id: 'ev', label: 'EV Tools', icon: Zap },
    { id: 'guides', label: 'Guides', icon: BookOpen },
    { id: 'comparisons', label: 'Comparisons', icon: Scale },
  ];

  const handleNavClick = (tab: ActiveTab, subTab?: string) => {
    onNavigate(tab, subTab);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="flex items-center focus:outline-none"
            aria-label="Bateri.com Home"
          >
            <Logo variant="dark" size="md" />
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id as ActiveTab)}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search Omnibar Trigger */}
          <button
            type="button"
            onClick={onOpenSearch}
            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-500 hover:border-slate-300 hover:bg-slate-100 transition-colors focus:outline-none"
            aria-label="Search tools and guides"
          >
            <Search className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Search tools, cars, guides...</span>
            <kbd className="hidden sm:inline-block rounded bg-white px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 border border-slate-200">
              ⌘K
            </kbd>
          </button>

          {/* Bateri AI Diagnostic Button */}
          <button
            type="button"
            onClick={() => handleNavClick('ai')}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              activeTab === 'ai'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs'
            }`}
          >
            <Bot className="h-3.5 w-3.5 text-blue-200" />
            <span>Bateri AI</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-6 shadow-lg animate-in slide-in-from-top-2">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id as ActiveTab)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => handleNavClick('ai')}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              <Bot className="h-4 w-4" />
              <span>Launch Bateri AI Diagnostic Agent</span>
            </button>
            <button
              type="button"
              onClick={() => handleNavClick('admin')}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              <ShieldAlert className="h-3.5 w-3.5 text-slate-400" />
              <span>Admin CMS Portal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
