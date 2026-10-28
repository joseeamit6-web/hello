import React from 'react';
import { LayersPanel } from './LayersPanel';
import { AdjustmentsPanel } from './AdjustmentsPanel';
import { HistoryPanel } from './HistoryPanel';
import { AdSlot } from '../common/AdSlot';
import { Sliders, Layers, Clock, X } from 'lucide-react';

interface RightPanelProps {
  activeTab: 'adjustments' | 'layers' | 'history';
  onSelectTab: (tab: 'adjustments' | 'layers' | 'history') => void;
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  activeTab,
  onSelectTab,
  isOpenOnMobile = false,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile/Tablet Backdrop overlay when open */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Panel Container (Docked on lg: and up, Slide-over Drawer on smaller screens) */}
      <aside
        className={`fixed lg:static top-0 right-0 bottom-0 z-50 lg:z-20 w-80 max-w-[85vw] lg:w-80 flex-shrink-0 border-l border-slate-800 bg-[#0d131f] flex flex-col h-full select-none shadow-2xl lg:shadow-none transition-transform duration-200 ease-in-out ${
          isOpenOnMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        } ${!isOpenOnMobile ? 'hidden lg:flex' : 'flex'}`}
        aria-label="Editor Properties & Layers Panel"
      >
        {/* Tabs Header */}
        <div className="h-11 border-b border-slate-800 flex items-center justify-between px-2 bg-slate-950/80">
          <div className="flex items-center space-x-1 flex-1">
            <button
              onClick={() => onSelectTab('adjustments')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition ${
                activeTab === 'adjustments'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Adjust</span>
            </button>

            <button
              onClick={() => onSelectTab('layers')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition ${
                activeTab === 'layers'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              <span>Layers</span>
            </button>

            <button
              onClick={() => onSelectTab('history')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md transition ${
                activeTab === 'history'
                  ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>History</span>
            </button>
          </div>

          {/* Close button for mobile slide-over */}
          {onCloseMobile && (
            <button
              onClick={onCloseMobile}
              className="lg:hidden ml-2 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Close Properties Panel"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'adjustments' && <AdjustmentsPanel />}
          {activeTab === 'layers' && <LayersPanel />}
          {activeTab === 'history' && <HistoryPanel />}
        </div>

        {/* Non-intrusive Ad container reserved at the bottom of the panel */}
        <div className="p-2 border-t border-slate-800/80 bg-slate-950/40">
          <AdSlot
            slotId={import.meta.env.VITE_ADSENSE_SLOT_SIDEBAR}
            format="horizontal"
            className="my-0 py-1"
            label="Sponsor"
          />
        </div>
      </aside>
    </>
  );
};
