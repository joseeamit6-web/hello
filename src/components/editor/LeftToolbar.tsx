import React from 'react';
import { ToolMode, BrushSettings } from '../../types/editor';
import { 
  Move, 
  Crop, 
  Paintbrush, 
  Eraser, 
  Sparkle, 
  Copy, 
  Type, 
  Square, 
  Pipette, 
  PaintBucket, 
  Search, 
  Droplet,
  MousePointer
} from 'lucide-react';

interface LeftToolbarProps {
  currentTool: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
  brushSettings: BrushSettings;
  onChangeBrushSettings: (settings: Partial<BrushSettings>) => void;
  className?: string;
}

export const LeftToolbar: React.FC<LeftToolbarProps> = ({
  currentTool,
  onSelectTool,
  brushSettings,
  onChangeBrushSettings,
  className = '',
}) => {
  const tools: { id: ToolMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'move', label: 'Move / Pan (V)', icon: Move },
    { id: 'select', label: 'Transform / Selection (M)', icon: MousePointer },
    { id: 'crop', label: 'Crop Tool (C)', icon: Crop },
    { id: 'brush', label: 'Paintbrush (B)', icon: Paintbrush },
    { id: 'eraser', label: 'Eraser (E)', icon: Eraser },
    { id: 'healing', label: 'Spot Healing Brush (J)', icon: Sparkle },
    { id: 'clone', label: 'Clone Stamp (S)', icon: Copy },
    { id: 'text', label: 'Text Layer (T)', icon: Type },
    { id: 'shape', label: 'Vector Shapes (U)', icon: Square },
    { id: 'eyedropper', label: 'Eyedropper (I)', icon: Pipette },
    { id: 'fill', label: 'Bucket Fill (G)', icon: PaintBucket },
    { id: 'blur-brush', label: 'Selective Blur (R)', icon: Droplet },
    { id: 'zoom', label: 'Zoom Tool (Z)', icon: Search },
  ];

  return (
    <>
      {/* Desktop / Tablet Vertical Sidebar (md: and up) */}
      <aside
        className={`hidden md:flex w-14 lg:w-16 flex-shrink-0 border-r border-slate-800 bg-[#0d131f] flex-col items-center py-2.5 gap-1 z-20 select-none overflow-y-auto ${className}`}
        aria-label="Desktop Tool Palette"
      >
        <div className="flex flex-col gap-1 w-full px-2">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = currentTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                title={t.label}
                className={`group relative flex h-9 lg:h-10 w-full items-center justify-center rounded-xl transition ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
                aria-label={t.label}
              >
                <Icon className="h-4 w-4" />
                {/* Tooltip */}
                <div className="pointer-events-none absolute left-full ml-2 hidden rounded-md bg-slate-900 border border-slate-800 px-2 py-1 text-[11px] font-medium text-slate-200 shadow-xl group-hover:block whitespace-nowrap z-50">
                  {t.label}
                </div>
              </button>
            );
          })}
        </div>

        {/* Color picker swatch */}
        <div className="mt-auto pt-2 border-t border-slate-800/80 w-full px-2 flex flex-col items-center">
          <label
            htmlFor="brushColorPickerDesktop"
            className="block h-7 w-7 rounded-lg border-2 border-slate-700 shadow cursor-pointer transition hover:scale-105"
            style={{ backgroundColor: brushSettings.color }}
            title="Brush / Shape Color"
          />
          <input
            id="brushColorPickerDesktop"
            type="color"
            value={brushSettings.color.startsWith('#') ? brushSettings.color : '#06b6d4'}
            onChange={(e) => onChangeBrushSettings({ color: e.target.value })}
            className="sr-only"
          />
        </div>
      </aside>

      {/* Mobile Horizontal Bottom Floating Tool Dock (< md) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0d131f]/95 border-t border-slate-800 backdrop-blur-lg px-2 py-1.5 flex items-center justify-between gap-1 overflow-x-auto shadow-2xl"
        aria-label="Mobile Tool Palette"
      >
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
          {tools.map((t) => {
            const Icon = t.icon;
            const isActive = currentTool === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onSelectTool(t.id)}
                className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-xl transition ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label={t.label}
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}
        </div>

        {/* Mobile Color Picker Swatch */}
        <div className="flex-shrink-0 pl-1 border-l border-slate-800">
          <label
            htmlFor="brushColorPickerMobile"
            className="block h-8 w-8 rounded-lg border-2 border-slate-700 shadow cursor-pointer"
            style={{ backgroundColor: brushSettings.color }}
            title="Brush Color"
          />
          <input
            id="brushColorPickerMobile"
            type="color"
            value={brushSettings.color.startsWith('#') ? brushSettings.color : '#06b6d4'}
            onChange={(e) => onChangeBrushSettings({ color: e.target.value })}
            className="sr-only"
          />
        </div>
      </nav>
    </>
  );
};
