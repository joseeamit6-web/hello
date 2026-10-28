import React from 'react';
import { useProject } from '../../context/ProjectContext';
import { Adjustments } from '../../types/project';
import { RotateCcw } from 'lucide-react';

export const AdjustmentsPanel: React.FC = () => {
  const { project, updateAdjustments, resetAdjustments } = useProject();

  if (!project) return null;
  const adj = project.adjustments;

  interface SliderRowProps {
    label: string;
    prop: keyof Adjustments;
    min: number;
    max: number;
    step?: number;
    unit?: string;
  }

  const SliderRow: React.FC<SliderRowProps> = ({ label, prop, min, max, step = 1, unit = '' }) => {
    const val = adj[prop] as number;
    return (
      <div className="space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-slate-300 font-medium">{label}</span>
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-cyan-400 w-9 text-right">
              {val > 0 ? `+${val}` : val}{unit}
            </span>
            {val !== 0 && (
              <button
                onClick={() => updateAdjustments({ [prop]: 0 })}
                className="text-slate-500 hover:text-slate-300 p-0.5"
                title={`Reset ${label}`}
              >
                <RotateCcw className="h-2.5 w-2.5" />
              </button>
            )}
          </div>
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={val}
          onChange={(e) => updateAdjustments({ [prop]: Number(e.target.value) })}
          className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
        />
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full text-xs">
      {/* Header */}
      <div className="p-3 border-b border-slate-800 bg-slate-900/40 flex items-center justify-between">
        <span className="font-semibold text-slate-200">Color &amp; Tone Grading</span>
        <button
          onClick={resetAdjustments}
          className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[11px] text-slate-300 transition"
        >
          <RotateCcw className="h-3 w-3" />
          Reset All
        </button>
      </div>

      {/* Adjustments Form */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Light Section */}
        <div className="space-y-2.5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Light &amp; Exposure</div>
          <SliderRow label="Exposure" prop="exposure" min={-100} max={100} />
          <SliderRow label="Brightness" prop="brightness" min={-100} max={100} />
          <SliderRow label="Contrast" prop="contrast" min={-100} max={100} />
          <SliderRow label="Highlights" prop="highlights" min={-100} max={100} />
          <SliderRow label="Shadows" prop="shadows" min={-100} max={100} />
        </div>

        <div className="h-px bg-slate-800/80" />

        {/* Color Section */}
        <div className="space-y-2.5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Color Balance</div>
          <SliderRow label="Temperature (Cool/Warm)" prop="temperature" min={-100} max={100} />
          <SliderRow label="Tint (Green/Magenta)" prop="tint" min={-100} max={100} />
          <SliderRow label="Saturation" prop="saturation" min={-100} max={100} />
          <SliderRow label="Hue Angle" prop="hue" min={-180} max={180} unit="°" />
        </div>

        <div className="h-px bg-slate-800/80" />

        {/* Detail Section */}
        <div className="space-y-2.5">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Clarity &amp; Effects</div>
          <SliderRow label="Sharpening (3×3 Kernel)" prop="sharpen" min={0} max={100} />
          <SliderRow label="Gaussian Blur" prop="blur" min={0} max={40} unit="px" />
          <SliderRow label="Vignette" prop="vignette" min={0} max={100} />
        </div>

        <div className="h-px bg-slate-800/80" />

        {/* Quick Style Toggles */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500">Quick Filters</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => updateAdjustments({ grayscale: !adj.grayscale })}
              className={`p-2 rounded-lg border text-left transition ${
                adj.grayscale
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-medium text-xs">Monochrome</div>
              <div className="text-[10px] text-slate-500">Black &amp; white conversion</div>
            </button>
            <button
              onClick={() => updateAdjustments({ invert: !adj.invert })}
              className={`p-2 rounded-lg border text-left transition ${
                adj.invert
                  ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="font-medium text-xs">Invert Colors</div>
              <div className="text-[10px] text-slate-500">Negative tone spectrum</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
