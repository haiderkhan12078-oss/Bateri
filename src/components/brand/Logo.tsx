import React from 'react';

interface LogoProps {
  variant?: 'light' | 'dark' | 'icon-only';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ variant = 'dark', size = 'md', className = '' }) => {
  const isDark = variant === 'dark';
  
  // Sizing definitions
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* Custom Geometric Bateri Power Symbol (SVG) */}
      <svg
        className={`${iconSizes[size]} flex-shrink-0 transition-transform duration-200 hover:scale-105`}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Battery Top Terminal Anode */}
        <rect x="16" y="2" width="8" height="3" rx="1.5" fill="#2563eb" />
        
        {/* Main Battery Casing Body */}
        <rect
          x="6"
          y="6"
          width="28"
          height="32"
          rx="6"
          fill={isDark ? '#0f172a' : '#1e293b'}
          stroke="#2563eb"
          strokeWidth="2"
        />
        
        {/* Stylized 'B' Power Energy Core Cutout */}
        <path
          d="M13 13H19.5C21.433 13 23 14.343 23 16C23 17.657 21.433 19 19.5 19H13V13Z"
          fill="#3b82f6"
        />
        <path
          d="M13 19H20.5C22.433 19 24 20.343 24 22C24 23.657 22.433 25 20.5 25H13V19Z"
          fill="#06b6d4"
        />
        
        {/* Energy Pulse Center Spark Indicator */}
        <path
          d="M20 27L16 32H20L18 36L24 30H20L22 27H20Z"
          fill="#38bdf8"
        />
      </svg>

      {/* Brand Typography */}
      {variant !== 'icon-only' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center tracking-tight">
            <span
              className={`font-black ${textSizes[size]} ${
                isDark ? 'text-slate-900' : 'text-white'
              }`}
              style={{ letterSpacing: '-0.03em' }}
            >
              Bateri
            </span>
            <span className="font-extrabold text-blue-600 text-sm ml-0.5">.com</span>
          </div>
          {size === 'lg' && (
            <span
              className={`text-[10px] uppercase font-semibold tracking-wider ${
                isDark ? 'text-slate-500' : 'text-slate-400'
              }`}
            >
              Calculate · Diagnose · Learn
            </span>
          )}
        </div>
      )}
    </div>
  );
};
