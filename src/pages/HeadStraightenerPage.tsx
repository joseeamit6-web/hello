import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { rotateCanvas, estimateHeadTilt, loadImage } from '../utils/imageProcessing';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { AdSlot } from '../components/common/AdSlot';
import { 
  RotateCw, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  Sliders, 
  Grid, 
  Sparkles,
  Download
} from 'lucide-react';

interface HeadStraightenerPageProps {
  navigate: (route: string) => void;
}

export const HeadStraightenerPage: React.FC<HeadStraightenerPageProps> = ({ navigate }) => {
  const { project, applyImageAsNewBase, createNewProject } = useProject();

  const [angle, setAngle] = useState<number>(0);
  const [autoSuggestedAngle, setAutoSuggestedAngle] = useState<number | null>(null);
  const [cropToFill, setCropToFill] = useState<boolean>(true);
  const [showGuides, setShowGuides] = useState<boolean>(true);

  const [originalSrc, setOriginalSrc] = useState<string>('');
  const [previewSrc, setPreviewSrc] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Straighten Tilted Heads in Portrait Photos | AI Photo Studio',
      description: 'Automatically estimate portrait tilt angle, straighten heads with precision fine-rotation, and align eyes perfectly with biometric guidelines.',
      canonicalPath: '/head-straightener',
    });
  }, []);

  // Set original image from active project or sample
  useEffect(() => {
    const src = project?.layers[0]?.imageData?.src || SAMPLE_IMAGES[1].dataUrl; // tilted sample
    setOriginalSrc(src);

    // Run automatic tilt estimation
    setIsAnalyzing(true);
    loadImage(src).then((img) => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const est = estimateHeadTilt(c);
        setAutoSuggestedAngle(est.angle);
        setAngle(est.angle);
      }
      setIsAnalyzing(false);
    });
  }, [project]);

  // Compute rotated preview
  useEffect(() => {
    if (!originalSrc) return;

    loadImage(originalSrc).then((img) => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const rotated = rotateCanvas(c, angle, cropToFill);
        setPreviewSrc(rotated.toDataURL('image/jpeg', 0.95));
      }
    });
  }, [originalSrc, angle, cropToFill]);

  const handleApply = () => {
    if (!previewSrc) return;
    if (project) {
      applyImageAsNewBase(previewSrc, `Straighten Head (${angle > 0 ? '+' : ''}${angle}°)`);
      navigate('/editor');
    } else {
      createNewProject(previewSrc, 'Straightened Portrait').then(() => navigate('/editor'));
    }
  };

  return (
    <div className="flex-1 bg-[#090d16] text-slate-100 py-6 px-4 sm:px-6 flex flex-col">
      <div className="mx-auto max-w-6xl w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <button
              onClick={() => navigate('/editor')}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Editor Workspace</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <RotateCw className="h-5 w-5 text-cyan-400" />
              Head Straightener &amp; Tilt Correction
            </h1>
            <p className="text-xs text-slate-400">
              Align portraits vertically and level tilted eyes with precision degree angle adjustments.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAngle(0)}
              className="px-3 py-2 rounded-xl border border-slate-700 bg-slate-800 text-xs font-medium text-slate-300 hover:text-white"
            >
              Reset 0°
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500 transition"
            >
              <Check className="h-4 w-4" />
              <span>Apply to Editor</span>
            </button>
          </div>
        </div>

        {/* Workspace Body */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
          {/* Left: Preview Canvas with Alignment Guides */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#070b12] p-2 sm:p-4 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[480px] relative shadow-2xl overflow-hidden">
            {previewSrc ? (
              <div className="relative max-h-[340px] sm:max-h-[500px] inline-block">
                <img
                  src={previewSrc}
                  alt="Rotated preview"
                  className="max-h-[340px] sm:max-h-[500px] max-w-full object-contain rounded shadow-lg block"
                />

                {/* Horizontal & Vertical Alignment Grid Guides */}
                {showGuides && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Horizontal Eye Level Guideline */}
                    <div className="absolute top-[38%] left-0 right-0 h-px bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] opacity-70" />
                    {/* Secondary chin guideline */}
                    <div className="absolute top-[58%] left-0 right-0 h-px border-b border-dashed border-cyan-400/50" />
                    {/* Vertical Center Symmetry Guideline */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)] opacity-70" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 animate-pulse">Rendering rotated portrait...</div>
            )}

            {/* Guides toggle pill */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2 bg-slate-900/90 rounded-lg px-2.5 py-1 border border-slate-800 text-xs">
              <button
                onClick={() => setShowGuides(!showGuides)}
                className={`flex items-center gap-1.5 ${showGuides ? 'text-cyan-400' : 'text-slate-500'}`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>Alignment Guides</span>
              </button>
            </div>
          </div>

          {/* Right: Angle Controls & Auto Suggestion */}
          <div className="space-y-5 text-xs">
            {/* Auto AI suggestion card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-300 font-semibold">
                <Sparkles className="h-4 w-4 text-cyan-400" />
                <span>Automated Tilt Analysis</span>
              </div>
              <p className="text-[11px] text-slate-300">
                {isAnalyzing
                  ? 'Analyzing eye and mouth symmetry axes...'
                  : autoSuggestedAngle !== null
                  ? `Detected a head tilt. Recommended correction: ${autoSuggestedAngle > 0 ? '+' : ''}${autoSuggestedAngle}°.`
                  : 'Image analyzed.'}
              </p>
              {autoSuggestedAngle !== null && autoSuggestedAngle !== 0 && (
                <button
                  onClick={() => setAngle(autoSuggestedAngle)}
                  className="mt-1 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition"
                >
                  Apply Suggested {autoSuggestedAngle > 0 ? '+' : ''}{autoSuggestedAngle}°
                </button>
              )}
            </div>

            {/* Manual Fine Rotation Card */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-4">
              <div className="font-bold uppercase tracking-wider text-slate-300">Fine Rotation Angle</div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Tilt Angle</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      step="0.1"
                      min="-25"
                      max="25"
                      value={angle}
                      onChange={(e) => setAngle(Number(e.target.value))}
                      className="w-16 rounded bg-slate-900 border border-slate-700 px-2 py-0.5 text-right font-mono text-cyan-400 outline-none"
                    />
                    <span className="font-mono text-cyan-400">°</span>
                  </div>
                </div>

                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="0.1"
                  value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>-20° (Left)</span>
                  <span>0° (Level)</span>
                  <span>+20° (Right)</span>
                </div>
              </div>

              {/* Quick Nudge Buttons */}
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {[-2, -0.5, 0.5, 2].map((delta) => (
                  <button
                    key={delta}
                    onClick={() => setAngle((prev) => Number((prev + delta).toFixed(1)))}
                    className="py-1 rounded bg-slate-800 hover:bg-slate-700 font-mono text-[11px] text-slate-300 transition"
                  >
                    {delta > 0 ? `+${delta}` : delta}°
                  </button>
                ))}
              </div>

              <div className="h-px bg-slate-800" />

              {/* Auto crop toggle */}
              <label className="flex items-center justify-between cursor-pointer pt-1">
                <div>
                  <div className="font-medium text-slate-200">Auto-crop corners</div>
                  <div className="text-[10px] text-slate-500">Trim transparent rotation wedges</div>
                </div>
                <input
                  type="checkbox"
                  checked={cropToFill}
                  onChange={(e) => setCropToFill(e.target.checked)}
                  className="rounded accent-cyan-500 h-4 w-4"
                />
              </label>
            </div>

            <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_TOOLS} />
          </div>
        </div>
      </div>
    </div>
  );
};
