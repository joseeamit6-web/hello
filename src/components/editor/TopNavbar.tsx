import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { ToolMode, BrushSettings } from '../../types/editor';
import { 
  Undo2, 
  Redo2, 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Sliders, 
  Layers, 
  Sparkles,
  Printer,
  CreditCard,
  Scissors,
  Menu,
  ChevronRight
} from 'lucide-react';

interface TopNavbarProps {
  currentTool: ToolMode;
  brushSettings: BrushSettings;
  onChangeBrushSettings: (settings: Partial<BrushSettings>) => void;
  zoom: number;
  onZoomChange: (newZoom: number) => void;
  onFitScreen: () => void;
  onOpenExport: () => void;
  onNavigateToTool: (toolRoute: string) => void;
  activeRightTab: 'adjustments' | 'layers' | 'history';
  onSelectRightTab: (tab: 'adjustments' | 'layers' | 'history') => void;
  isRightPanelOpen?: boolean;
  onToggleRightPanel?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTool,
  brushSettings,
  onChangeBrushSettings,
  zoom,
  onZoomChange,
  onFitScreen,
  onOpenExport,
  onNavigateToTool,
  activeRightTab,
  onSelectRightTab,
  isRightPanelOpen = false,
  onToggleRightPanel,
}) => {
  const { project, updateProject, canUndo, canRedo, undo, redo } = useProject();
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(project?.name || 'Untitled Photo');

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (project && titleInput.trim()) {
      updateProject((prev) => ({ ...prev, name: titleInput.trim() }), 'Rename Project');
    }
  };

  const isBrushTool = currentTool === 'brush' || currentTool === 'eraser' || currentTool === 'healing' || currentTool === 'clone' || currentTool === 'blur-brush';

  return (
    <div className="h-12 border-b border-slate-800 bg-[#0b101a] px-2 sm:px-3 flex items-center justify-between gap-1.5 sm:gap-3 text-xs z-30 select-none overflow-x-auto no-scrollbar">
      {/* Left: Project title & Undo/Redo */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            autoFocus
            className="rounded bg-slate-800 px-2 py-0.5 text-xs text-white border border-cyan-500 outline-none w-28 sm:w-44"
          />
        ) : (
          <button
            onClick={() => {
              setTitleInput(project?.name || 'Untitled');
              setIsEditingTitle(true);
            }}
            className="font-medium text-slate-200 hover:text-cyan-400 transition truncate max-w-[90px] xs:max-w-[130px] sm:max-w-[200px]"
            title="Click to rename project"
          >
            {project?.name || 'Untitled'}
          </button>
        )}

        <div className="h-4 w-px bg-slate-800 mx-0.5 sm:mx-1" />

        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded-lg transition ${
              canUndo ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 cursor-not-allowed'
            }`}
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded-lg transition ${
              canRedo ? 'text-slate-300 hover:bg-slate-800 hover:text-white' : 'text-slate-600 cursor-not-allowed'
            }`}
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Center: Tool Options Bar (Brush size / hardness on medium/large screens) */}
      <div className="hidden xl:flex items-center gap-3">
        {isBrushTool && (
          <div className="flex items-center gap-2.5 bg-slate-900/90 rounded-lg px-2.5 py-1 border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Size:</span>
              <input
                type="range"
                min="2"
                max="150"
                value={brushSettings.size}
                onChange={(e) => onChangeBrushSettings({ size: Number(e.target.value) })}
                className="w-16 accent-cyan-400 h-1"
              />
              <span className="font-mono text-[11px] text-slate-300 w-6">{brushSettings.size}px</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Opacity:</span>
              <input
                type="range"
                min="5"
                max="100"
                value={brushSettings.opacity}
                onChange={(e) => onChangeBrushSettings({ opacity: Number(e.target.value) })}
                className="w-16 accent-cyan-400 h-1"
              />
              <span className="font-mono text-[11px] text-slate-300 w-6">{brushSettings.opacity}%</span>
            </div>
          </div>
        )}

        {/* Quick jump to specialized suites */}
        <div className="flex items-center gap-1 bg-slate-900/60 rounded-lg p-0.5 border border-slate-800/80">
          <button
            onClick={() => onNavigateToTool('/enhance')}
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-cyan-400 hover:bg-slate-800 text-[11px] transition"
          >
            <Sparkles className="h-3 w-3 text-cyan-400" />
            AI Enhance
          </button>
          <button
            onClick={() => onNavigateToTool('/passport-photo')}
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-violet-400 hover:bg-slate-800 text-[11px] transition"
          >
            <CreditCard className="h-3 w-3 text-violet-400" />
            Passport
          </button>
          <button
            onClick={() => onNavigateToTool('/print-studio')}
            className="flex items-center gap-1 px-2 py-1 rounded text-slate-300 hover:text-emerald-400 hover:bg-slate-800 text-[11px] transition"
          >
            <Printer className="h-3 w-3 text-emerald-400" />
            Print
          </button>
        </div>
      </div>

      {/* Right: Zoom controls, Panel toggles, and Export */}
      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        {/* Zoom */}
        <div className="flex items-center gap-0.5 sm:gap-1 bg-slate-900/90 rounded-lg px-1.5 sm:px-2 py-0.5 border border-slate-800">
          <button
            onClick={() => onZoomChange(Math.max(0.1, zoom - 0.15))}
            className="text-slate-400 hover:text-white p-0.5"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-[10px] sm:text-[11px] text-cyan-400 px-0.5 sm:px-1 w-8 sm:w-10 text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => onZoomChange(Math.min(4, zoom + 0.15))}
            className="text-slate-400 hover:text-white p-0.5"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onFitScreen}
            className="hidden sm:inline-block text-slate-400 hover:text-white p-0.5 ml-0.5 border-l border-slate-800 pl-1"
            title="Fit to Screen"
            aria-label="Fit to Screen"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Panel Switchers on Desktop (lg:) */}
        <div className="hidden lg:flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
          <button
            onClick={() => onSelectRightTab('adjustments')}
            className={`p-1.5 rounded transition ${
              activeRightTab === 'adjustments' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Adjustments Panel"
            aria-label="Adjustments Panel"
          >
            <Sliders className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => onSelectRightTab('layers')}
            className={`p-1.5 rounded transition ${
              activeRightTab === 'layers' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Layers Panel"
            aria-label="Layers Panel"
          >
            <Layers className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mobile & Tablet Slide-Over Drawer Toggle (< lg) */}
        {onToggleRightPanel && (
          <button
            onClick={onToggleRightPanel}
            className={`lg:hidden flex items-center gap-1 px-2 py-1 rounded-lg border text-xs font-medium transition ${
              isRightPanelOpen
                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white'
            }`}
            aria-label="Toggle Properties Panel"
          >
            <Sliders className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden xs:inline capitalize">{activeRightTab}</span>
          </button>
        )}

        {/* Export Button */}
        <button
          onClick={onOpenExport}
          className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500 transition"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
};
