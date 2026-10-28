import React, { useEffect, useRef } from 'react';

interface AdSlotProps {
  slotId?: string;
  clientId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
  label?: string;
}

/**
 * Google AdSense Ad Slot Component
 * Safely renders ads only when a valid Google Publisher ID is configured.
 * Does not obstruct editing canvas or interactive controls.
 * Shows a neat reserved placeholder container when unconfigured to prevent cumulative layout shifts.
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  slotId,
  clientId = import.meta.env.VITE_ADSENSE_CLIENT_ID || '',
  format = 'auto',
  className = '',
  label = 'Sponsored',
}) => {
  const adRef = useRef<HTMLDivElement>(null);
  const isConfigured = Boolean(clientId && clientId.startsWith('ca-pub-'));

  useEffect(() => {
    if (!isConfigured) return;

    try {
      // Check if adsbygoogle script is already loaded
      if (typeof window !== 'undefined') {
        const adsbygoogle = (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle || [];
        adsbygoogle.push({});
      }
    } catch (err) {
      console.warn('AdSense tag initialization ignored:', err);
    }
  }, [isConfigured]);

  return (
    <div
      ref={adRef}
      className={`relative my-4 rounded-xl border border-slate-800/80 bg-slate-900/40 p-2 text-center overflow-hidden transition-all ${className}`}
      aria-label="Advertisement container"
    >
      <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 mb-1.5 flex items-center justify-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
        {label}
      </div>

      {isConfigured ? (
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={clientId}
          data-ad-slot={slotId || '0000000000'}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="py-3 px-4 text-xs text-slate-400 bg-slate-900/60 rounded-lg border border-dashed border-slate-800 flex items-center justify-center gap-2">
          <span className="text-slate-500 font-mono text-[11px]">Ad Space reserved for Google AdSense ({clientId || 'Configurable via VITE_ADSENSE_CLIENT_ID'})</span>
        </div>
      )}
    </div>
  );
};
