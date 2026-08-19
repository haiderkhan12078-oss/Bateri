import React from 'react';

interface AdSlotProps {
  placement: 'header-banner' | 'in-content' | 'sidebar' | 'content-bottom';
  className?: string;
}

export const AdSlot: React.FC<AdSlotProps> = ({ placement, className = '' }) => {
  // Ads disabled during current build mode
  const adsEnabled = false;

  if (!adsEnabled) {
    return null; // Return null so the site is clean and useful without empty grey boxes
  }

  return (
    <div
      className={`my-6 flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center ${className}`}
      aria-label="Advertisement Area"
    >
      <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
        Advertisement
      </span>
      <div className="mt-2 min-h-[90px] w-full flex items-center justify-center text-xs text-slate-400">
        Google AdSense placement ({placement})
      </div>
    </div>
  );
};
