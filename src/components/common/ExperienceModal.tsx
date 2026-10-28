import React from 'react';
import { 
  Layers, 
  Sparkles, 
  CreditCard, 
  Scissors, 
  RotateCw, 
  Shirt, 
  Printer, 
  X, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Zap,
  Sliders
} from 'lucide-react';

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageName?: string;
  imageDimensions?: { width: number; height: number };
  onSelectManual: () => void;
  onSelectAI: (route: string) => void;
}

export const ExperienceModal: React.FC<ExperienceModalProps> = ({
  isOpen,
  onClose,
  imageSrc,
  imageName = 'Uploaded Photograph',
  imageDimensions,
  onSelectManual,
  onSelectAI,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-3xl border border-slate-800 bg-[#0d131f] p-5 sm:p-8 shadow-2xl text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Photo Uploaded Successfully</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choose Your Editing Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Quickly create official passport/visa photos with AI or jump into advanced manual editing.
          </p>
        </div>

        {/* Thumbnail Preview bar */}
        <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-2.5 sm:p-3 flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex items-center gap-3 truncate">
            {imageSrc ? (
              <img
                src={imageSrc}
                alt="Uploaded Preview"
                className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
              />
            ) : (
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-4 w-4 text-cyan-400" />
              </div>
            )}
            <div className="truncate text-left">
              <div className="text-xs font-semibold text-slate-200 truncate">{imageName}</div>
              {imageDimensions && (
                <div className="text-[11px] font-mono text-cyan-400">
                  {imageDimensions.width} × {imageDimensions.height} px
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-1 rounded-lg flex-shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Local &amp; Private</span>
          </div>
        </div>

        {/* FEATURED: 1-Click AI Passport Photo Maker */}
        <div className="mt-5 rounded-2xl sm:rounded-3xl border-2 border-cyan-500/80 bg-gradient-to-r from-cyan-950/40 via-slate-900/90 to-blue-950/40 p-4 sm:p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-gradient-to-l from-cyan-500 to-blue-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-bl-xl tracking-wider uppercase flex items-center gap-1">
            <Zap className="h-3 w-3 fill-white" />
            Recommended • 1-Click
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-400">
                  <CreditCard className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    AI Passport, Visa &amp; ID Photo Maker
                  </h3>
                  <p className="text-xs text-cyan-300 font-mono">
                    Nepal MRP/E-Passport (35×45mm), US Visa (2×2"), Schengen &amp; India
                  </p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-0 sm:pl-12">
                Automatically straighten head alignment, apply official white/light-grey background, enforce strict 70-80% biometric face ratio, and generate printable 4×6" sheets.
              </p>
            </div>

            <button
              onClick={() => onSelectAI('/passport-photo')}
              className="w-full md:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-5 py-3 text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition flex-shrink-0"
            >
              <Zap className="h-4 w-4" />
              <span>Make Passport Photo Now</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Two Options: Other AI Suites vs Manual Photoshop Editor */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Other AI Automated Tools */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-violet-400" />
                  Specialized AI Tools
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                  Fast AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Single-purpose AI studios for specific portrait tasks:
              </p>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onSelectAI('/head-straightener')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 text-left transition group"
                >
                  <RotateCw className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 group-hover:text-cyan-300 truncate">Straighten Head</div>
                    <div className="text-[10px] text-slate-400">Fix tilted pose</div>
                  </div>
                </button>

                <button
                  onClick={() => onSelectAI('/outfit-studio')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 text-left transition group"
                >
                  <Shirt className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 group-hover:text-amber-300 truncate">Formal Suit</div>
                    <div className="text-[10px] text-slate-400">Blazer &amp; tie overlay</div>
                  </div>
                </button>

                <button
                  onClick={() => onSelectAI('/background')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 text-left transition group"
                >
                  <Scissors className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 group-hover:text-blue-300 truncate">Background</div>
                    <div className="text-[10px] text-slate-400">Cutout &amp; clean color</div>
                  </div>
                </button>

                <button
                  onClick={() => onSelectAI('/enhance')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 border border-slate-700/60 text-left transition group"
                >
                  <Sparkles className="h-3.5 w-3.5 text-violet-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 group-hover:text-violet-300 truncate">AI Enhance</div>
                    <div className="text-[10px] text-slate-400">Clarity &amp; sharpness</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Manual Photoshop-Style Editor */}
          <div
            onClick={onSelectManual}
            className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-5 hover:border-cyan-500/50 hover:bg-slate-900/90 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-cyan-400" />
                  Full Manual Editor
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">
                  Photoshop-Style
                </span>
              </div>
              <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                Layer-based canvas workspace with blend modes, clone stamp, blemish healing, brush strokes, text, and 12+ manual sliders.
              </p>

              <div className="flex flex-wrap gap-1.5 text-[11px] text-slate-300">
                <span className="bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/60">Layers &amp; Opacity</span>
                <span className="bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/60">Blemish Healing</span>
                <span className="bg-slate-800/90 px-2 py-0.5 rounded border border-slate-700/60">Tone &amp; Curves</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition flex items-center gap-1">
                <span>Open Manual Editor</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </span>
              <span className="text-[10px] font-mono text-slate-500">100% Free</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
