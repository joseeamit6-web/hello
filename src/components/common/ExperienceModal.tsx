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
  CheckCircle2
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
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-800 bg-[#0d131f] p-5 sm:p-8 shadow-2xl text-slate-100 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Photo Uploaded Successfully</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight">
            How would you like to edit your photo?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Choose between full manual Photoshop-style control or specialized automatic AI studio suites.
          </p>
        </div>

        {/* Thumbnail Preview bar */}
        <div className="mt-5 rounded-2xl border border-slate-800 bg-slate-950/80 p-3 flex items-center justify-between gap-3 max-w-md mx-auto">
          <div className="flex items-center gap-3 truncate">
            <img
              src={imageSrc}
              alt="Uploaded Preview"
              className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
            />
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
            <span>Local &amp; Secure</span>
          </div>
        </div>

        {/* Two Main Cards: Manual Edit vs Automatic AI */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Option A: Manual Photoshop-Style Editor */}
          <div
            onClick={onSelectManual}
            className="group rounded-2xl border-2 border-slate-800 bg-slate-900/50 p-5 sm:p-6 hover:border-cyan-500 hover:bg-slate-900/90 transition cursor-pointer flex flex-col justify-between shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl group-hover:bg-cyan-500/15 transition" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition">
                  <Layers className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
                  Photoshop-Style
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition">
                Advanced Manual Editor
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Complete creative control with image layers, blend modes, blemish healing, clone stamp, brush strokes, vector shapes, typography, and 12+ fine color adjustments.
              </p>

              <ul className="mt-4 space-y-1.5 text-xs text-slate-300">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Multi-layer composition &amp; opacity</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Exposure, contrast &amp; tone grading</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Unlimited undo/redo history</span>
                </li>
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition flex items-center gap-1.5">
                <span>Open Manual Editor</span>
                <ArrowRight className="h-4 w-4" />
              </span>
              <span className="text-[10px] font-mono text-slate-500">Free • Client-side</span>
            </div>
          </div>

          {/* Option B: Automatic AI Photo Studio */}
          <div className="rounded-2xl border-2 border-slate-800 bg-slate-900/50 p-5 sm:p-6 transition flex flex-col justify-between shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/5 rounded-full blur-2xl transition" />

            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-violet-500/20 to-blue-500/20 border border-violet-500/30 text-violet-400">
                  <Sparkles className="h-6 w-6" />
                </div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded-full border border-violet-500/20">
                  AI Suites
                </span>
              </div>

              <h3 className="text-lg font-bold text-white">
                Automatic AI Photo Studio
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Smart automated tools designed for 1-click enhancements, portrait retouching, head straightening, and official document preparation.
              </p>

              {/* Quick AI tool buttons */}
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => onSelectAI('/enhance')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 hover:border-cyan-500/50 border border-slate-700/80 text-left transition group/btn"
                >
                  <Sparkles className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 group-hover/btn:text-cyan-300 truncate">AI Enhance</div>
                    <div className="text-[10px] text-slate-400">Clarity &amp; Noise</div>
                  </div>
                </button>

                <button
                  onClick={() => onSelectAI('/passport-photo')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 hover:border-violet-500/50 border border-slate-700/80 text-left transition group/btn"
                >
                  <CreditCard className="h-4 w-4 text-violet-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 group-hover/btn:text-violet-300 truncate">Passport Photo</div>
                    <div className="text-[10px] text-slate-400">Nepal, US &amp; EU</div>
                  </div>
                </button>

                <button
                  onClick={() => onSelectAI('/background')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 hover:border-blue-500/50 border border-slate-700/80 text-left transition group/btn"
                >
                  <Scissors className="h-4 w-4 text-blue-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 group-hover/btn:text-blue-300 truncate">Cutout &amp; BG</div>
                    <div className="text-[10px] text-slate-400">Transparent PNG</div>
                  </div>
                </button>

                <button
                  onClick={() => onSelectAI('/head-straightener')}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 hover:border-rose-500/50 border border-slate-700/80 text-left transition group/btn"
                >
                  <RotateCw className="h-4 w-4 text-rose-400 flex-shrink-0" />
                  <div className="truncate">
                    <div className="font-semibold text-slate-200 group-hover/btn:text-rose-300 truncate">Straighten Head</div>
                    <div className="text-[10px] text-slate-400">Tilt correction</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => onSelectAI('/enhance')}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-violet-500/20 transition flex items-center justify-center gap-1.5"
              >
                <span>Launch AI Photo Enhancer</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
