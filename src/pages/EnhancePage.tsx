import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { enhancePhotoAlgorithm, loadImage } from '../utils/imageProcessing';
import { BeforeAfterSlider } from '../components/common/BeforeAfterSlider';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { AdSlot } from '../components/common/AdSlot';
import { 
  Sparkles, 
  Sliders, 
  RotateCcw, 
  Check, 
  Download, 
  Upload, 
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';

interface EnhancePageProps {
  navigate: (route: string) => void;
}

export const EnhancePage: React.FC<EnhancePageProps> = ({ navigate }) => {
  const { project, applyImageAsNewBase, createNewProject } = useProject();

  const [mode, setMode] = useState<'auto' | 'manual'>('auto');
  const [preset, setPreset] = useState<'natural' | 'balanced' | 'strong'>('balanced');

  // Manual Controls
  const [intensity, setIntensity] = useState<number>(65);
  const [sharpness, setSharpness] = useState<number>(60);
  const [noiseReduction, setNoiseReduction] = useState<number>(40);
  const [lightingBoost, setLightingBoost] = useState<number>(50);

  const [originalSrc, setOriginalSrc] = useState<string>(() => project?.layers[0]?.imageData?.src || SAMPLE_IMAGES[0]?.dataUrl || '');
  const [enhancedSrc, setEnhancedSrc] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    updatePageSeo({
      title: 'AI Photo Enhancer – Improve Photo Quality Online | AI Photo Studio',
      description: 'Enhance portrait and photo quality with algorithmic unsharp masking, dynamic contrast balancing, noise reduction, and facial lighting clarity.',
      canonicalPath: '/enhance',
    });
  }, []);

  // Sync with project base image or fallback
  useEffect(() => {
    if (project && project.layers[0]?.imageData?.src) {
      setOriginalSrc(project.layers[0].imageData.src);
    } else {
      setOriginalSrc(SAMPLE_IMAGES[0].dataUrl);
    }
  }, [project]);

  // Apply enhancement algorithm
  useEffect(() => {
    if (!originalSrc) return;

    let isMounted = true;
    setIsProcessing(true);

    const runEnhance = async () => {
      try {
        const img = await loadImage(originalSrc);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = img.naturalWidth || img.width;
        tempCanvas.height = img.naturalHeight || img.height;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);

        let finalIntensity = intensity;
        let finalSharpness = sharpness;
        let finalNoise = noiseReduction;
        let finalLighting = lightingBoost;

        if (mode === 'auto') {
          if (preset === 'natural') {
            finalIntensity = 45;
            finalSharpness = 40;
            finalNoise = 30;
            finalLighting = 35;
          } else if (preset === 'balanced') {
            finalIntensity = 70;
            finalSharpness = 65;
            finalNoise = 50;
            finalLighting = 55;
          } else if (preset === 'strong') {
            finalIntensity = 90;
            finalSharpness = 85;
            finalNoise = 70;
            finalLighting = 75;
          }
        }

        const enhancedCanvas = enhancePhotoAlgorithm(tempCanvas, {
          intensity: finalIntensity,
          sharpness: finalSharpness,
          noiseReduction: finalNoise,
          lightingBoost: finalLighting,
        });

        if (isMounted) {
          setEnhancedSrc(enhancedCanvas.toDataURL('image/jpeg', 0.95));
          setIsProcessing(false);
        }
      } catch (err) {
        console.error('Enhance failed:', err);
        if (isMounted) setIsProcessing(false);
      }
    };

    const timer = setTimeout(runEnhance, 80);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [originalSrc, mode, preset, intensity, sharpness, noiseReduction, lightingBoost]);

  const handleApplyToProject = () => {
    if (!enhancedSrc) return;
    if (project) {
      applyImageAsNewBase(enhancedSrc, 'Apply AI Photo Enhancement');
      navigate('/editor');
    } else {
      createNewProject(enhancedSrc, 'Enhanced Photo').then(() => navigate('/editor'));
    }
  };

  const handleDownload = () => {
    if (!enhancedSrc) return;
    const a = document.createElement('a');
    a.href = enhancedSrc;
    a.download = 'enhanced-photo.jpg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex-1 bg-[#090d16] text-slate-100 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Navigation & Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <button
              onClick={() => navigate('/editor')}
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-cyan-400 transition mb-2"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Editor Workspace</span>
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-white">AI Photo Enhancement &amp; Clarity</h1>
              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/30 px-2 py-0.5 text-[10px] font-mono text-cyan-400">
                Genuine Algorithm
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Sharpens facial details, recovers shadow illumination, and reduces digital noise non-destructively.
            </p>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <button
              onClick={handleApplyToProject}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500 transition"
            >
              <Check className="h-4 w-4" />
              <span>Commit to Editor</span>
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition"
              title="Download enhanced image"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Workspace Body: Split comparison & Controls */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Center: Before / After Slider */}
          <div className="lg:col-span-2 space-y-3">
            {originalSrc && enhancedSrc ? (
              <BeforeAfterSlider
                beforeSrc={originalSrc}
                afterSrc={enhancedSrc}
                beforeLabel="Original Photo"
                afterLabel="Enhanced Clarity"
              />
            ) : (
              <div className="h-[400px] flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-900/60 animate-pulse text-xs text-slate-400">
                Processing image...
              </div>
            )}
            <div className="flex items-center justify-between text-xs text-slate-400 px-2">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>Skin texture and facial proportions are naturally preserved without artificial blur.</span>
              </span>
              {isProcessing && <span className="font-mono text-cyan-400 animate-pulse text-[11px]">Computing...</span>}
            </div>
          </div>

          {/* Right: Mode & Sliders Sidebar */}
          <div className="space-y-6">
            {/* Auto / Manual Mode Switcher */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-slate-300">Processing Mode</span>
                <div className="flex rounded-lg bg-slate-900 p-0.5 border border-slate-800">
                  <button
                    onClick={() => setMode('auto')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                      mode === 'auto' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Automatic
                  </button>
                  <button
                    onClick={() => setMode('manual')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition ${
                      mode === 'manual' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Manual
                  </button>
                </div>
              </div>

              {/* Automatic Mode: Presets */}
              {mode === 'auto' ? (
                <div className="space-y-3 pt-2">
                  <label className="block text-xs text-slate-400">Enhancement Intensity Preset</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['natural', 'balanced', 'strong'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPreset(p)}
                        className={`py-2 rounded-xl border text-xs capitalize transition ${
                          preset === p
                            ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                    {preset === 'natural' && 'Subtle sharpening and mild shadow lift for already well-exposed portraits.'}
                    {preset === 'balanced' && 'Optimal adaptive contrast, edge clarity, and noise balance for general photos.'}
                    {preset === 'strong' && 'Maximum dynamic range recovery and high-frequency edge definition for dim shots.'}
                  </p>
                </div>
              ) : (
                /* Manual Mode: Sliders */
                <div className="space-y-4 pt-1 text-xs">
                  <div>
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>Overall Intensity</span>
                      <span className="font-mono text-cyan-400">{intensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={intensity}
                      onChange={(e) => setIntensity(Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>Sharpness (Laplacian Kernel)</span>
                      <span className="font-mono text-cyan-400">{sharpness}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sharpness}
                      onChange={(e) => setSharpness(Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>Bilateral Noise Reduction</span>
                      <span className="font-mono text-cyan-400">{noiseReduction}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={noiseReduction}
                      onChange={(e) => setNoiseReduction(Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-slate-300 font-medium mb-1">
                      <span>Facial Lighting Recovery</span>
                      <span className="font-mono text-cyan-400">{lightingBoost}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={lightingBoost}
                      onChange={(e) => setLightingBoost(Number(e.target.value))}
                      className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                    />
                  </div>

                  <button
                    onClick={() => {
                      setIntensity(65);
                      setSharpness(60);
                      setNoiseReduction(40);
                      setLightingBoost(50);
                    }}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white pt-1"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset manual sliders
                  </button>
                </div>
              )}
            </div>

            {/* Non-intrusive Ad slot below options */}
            <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_TOOLS} />
          </div>
        </div>
      </div>
    </div>
  );
};
