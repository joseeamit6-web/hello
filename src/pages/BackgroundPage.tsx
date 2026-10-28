import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { removeBackground, loadImage } from '../utils/imageProcessing';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { AdSlot } from '../components/common/AdSlot';
import { 
  Scissors, 
  Check, 
  ArrowLeft, 
  Download, 
  RotateCcw, 
  Sliders,
  Palette
} from 'lucide-react';

interface BackgroundPageProps {
  navigate: (route: string) => void;
}

export const BackgroundPage: React.FC<BackgroundPageProps> = ({ navigate }) => {
  const { project, applyImageAsNewBase, createNewProject } = useProject();

  const [bgType, setBgType] = useState<'transparent' | 'solid' | 'gradient' | 'blur'>('transparent');
  const [solidColor, setSolidColor] = useState<string>('#ffffff');
  const [gradientPreset, setGradientPreset] = useState<string>('linear-gradient(135deg, #06b6d4, #3b82f6)');
  const [blurAmount, setBlurAmount] = useState<number>(15);

  const [tolerance, setTolerance] = useState<number>(35);
  const [feather, setFeather] = useState<number>(3);

  const [originalSrc, setOriginalSrc] = useState<string>('');
  const [cutoutSrc, setCutoutSrc] = useState<string>('');
  const [finalCompositeSrc, setFinalCompositeSrc] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Photo Background Remover & Editor | AI Photo Studio',
      description: 'Remove photo backgrounds automatically, create transparent PNG cutouts, and replace backdrops with plain white, passport blue, or soft blur bokeh.',
      canonicalPath: '/background',
    });
  }, []);

  useEffect(() => {
    const src = project?.layers[0]?.imageData?.src || SAMPLE_IMAGES[0].dataUrl;
    setOriginalSrc(src);
  }, [project]);

  // 1. Generate Cutout with transparent background
  useEffect(() => {
    if (!originalSrc) return;

    let isMounted = true;
    setIsProcessing(true);

    loadImage(originalSrc).then((img) => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth || img.width;
      c.height = img.naturalHeight || img.height;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);

      const cutout = removeBackground(c, {
        tolerance,
        feather,
        sampleMode: 'corners',
      });

      if (isMounted) {
        setCutoutSrc(cutout.toDataURL('image/png'));
        setIsProcessing(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [originalSrc, tolerance, feather]);

  // 2. Composite Cutout over chosen background (transparent, solid, gradient, blur)
  useEffect(() => {
    if (!cutoutSrc || !originalSrc) return;

    let isMounted = true;

    Promise.all([loadImage(originalSrc), loadImage(cutoutSrc)]).then(([origImg, cutImg]) => {
      const w = origImg.naturalWidth || origImg.width;
      const h = origImg.naturalHeight || origImg.height;

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (bgType === 'transparent') {
        // Draw only cutout
        ctx.drawImage(cutImg, 0, 0);
      } else if (bgType === 'solid') {
        ctx.fillStyle = solidColor;
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(cutImg, 0, 0);
      } else if (bgType === 'gradient') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0284c7');
        grad.addColorStop(1, '#4f46e5');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(cutImg, 0, 0);
      } else if (bgType === 'blur') {
        // Draw blurred original as background
        ctx.save();
        ctx.filter = `blur(${blurAmount}px)`;
        ctx.drawImage(origImg, -10, -10, w + 20, h + 20);
        ctx.restore();
        // Draw sharp cutout on top
        ctx.drawImage(cutImg, 0, 0);
      }

      if (isMounted) {
        setFinalCompositeSrc(canvas.toDataURL('image/png'));
      }
    });

    return () => {
      isMounted = false;
    };
  }, [cutoutSrc, originalSrc, bgType, solidColor, blurAmount]);

  const handleApply = () => {
    if (!finalCompositeSrc) return;
    if (project) {
      applyImageAsNewBase(finalCompositeSrc, `Background: ${bgType}`);
      navigate('/editor');
    } else {
      createNewProject(finalCompositeSrc, 'Background Cutout').then(() => navigate('/editor'));
    }
  };

  const handleDownload = () => {
    if (!finalCompositeSrc) return;
    const a = document.createElement('a');
    a.href = finalCompositeSrc;
    a.download = bgType === 'transparent' ? 'cutout-transparent.png' : 'photo-background-replaced.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
              <Scissors className="h-5 w-5 text-cyan-400" />
              Background Remover &amp; Replacer
            </h1>
            <p className="text-xs text-slate-400">
              Isolate subjects with transparent alpha cutouts or replace with passport white, solid tones, or depth blur.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500 transition"
            >
              <Check className="h-4 w-4" />
              <span>Commit to Editor</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
          {/* Left: Preview Canvas */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#070b12] p-2 sm:p-4 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[500px] relative shadow-2xl overflow-hidden bg-transparency-grid">
            {finalCompositeSrc ? (
              <img
                src={finalCompositeSrc}
                alt="Background Preview"
                className="max-h-[340px] sm:max-h-[500px] max-w-full object-contain rounded shadow-lg block"
              />
            ) : (
              <div className="text-xs text-slate-400 animate-pulse">Calculating alpha matting cutout...</div>
            )}
            <div className="absolute bottom-3 left-4 rounded-md bg-slate-900/90 px-2.5 py-1 text-[11px] font-mono text-cyan-400 border border-slate-800 backdrop-blur">
              Mode: {bgType.toUpperCase()}
            </div>
          </div>

          {/* Right: Background Controls */}
          <div className="space-y-5 text-xs">
            {/* Background Style Switcher */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-4">
              <div className="font-bold uppercase tracking-wider text-slate-300">Replacement Mode</div>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setBgType('transparent')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    bgType === 'transparent'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Scissors className="h-4 w-4 text-cyan-400" />
                  <span>Transparent</span>
                  <span className="text-[10px] text-slate-500 font-normal">Pure PNG cutout</span>
                </button>

                <button
                  onClick={() => setBgType('solid')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    bgType === 'solid'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Palette className="h-4 w-4 text-emerald-400" />
                  <span>Solid Color</span>
                  <span className="text-[10px] text-slate-500 font-normal">Passport &amp; Studio</span>
                </button>

                <button
                  onClick={() => setBgType('blur')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    bgType === 'blur'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="h-4 w-4 rounded-full border border-violet-400 bg-violet-400/30" />
                  <span>Bokeh Blur</span>
                  <span className="text-[10px] text-slate-500 font-normal">Depth-of-field</span>
                </button>

                <button
                  onClick={() => setBgType('gradient')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    bgType === 'gradient'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="h-4 w-4 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600" />
                  <span>Studio Gradient</span>
                  <span className="text-[10px] text-slate-500 font-normal">Creative backdrop</span>
                </button>
              </div>

              {/* If Solid: Preset Swatches */}
              {bgType === 'solid' && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-slate-400 font-medium">Standard Studio Colors</span>
                  <div className="flex items-center gap-2">
                    {[
                      { color: '#ffffff', name: 'White' },
                      { color: '#f1f5f9', name: 'Light Grey' },
                      { color: '#38bdf8', name: 'Passport Blue' },
                      { color: '#0f172a', name: 'Dark Slate' },
                      { color: '#dc2626', name: 'Crimson' },
                    ].map((sw) => (
                      <button
                        key={sw.color}
                        onClick={() => setSolidColor(sw.color)}
                        className={`h-7 w-7 rounded-lg border shadow-sm transition hover:scale-105 ${
                          solidColor === sw.color ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-slate-700'
                        }`}
                        style={{ backgroundColor: sw.color }}
                        title={sw.name}
                      />
                    ))}
                    <input
                      type="color"
                      value={solidColor}
                      onChange={(e) => setSolidColor(e.target.value)}
                      className="h-7 w-7 rounded cursor-pointer border-0 bg-transparent ml-2"
                      title="Custom color picker"
                    />
                  </div>
                </div>
              )}

              {/* If Blur: Amount Slider */}
              {bgType === 'blur' && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-slate-300 font-medium">
                    <span>Backdrop Bokeh Blur</span>
                    <span className="font-mono text-cyan-400">{blurAmount}px</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="40"
                    value={blurAmount}
                    onChange={(e) => setBlurAmount(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Edge Refinement & Tolerance */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-3">
              <div className="font-bold uppercase tracking-wider text-slate-300">Cutout Edge Matting</div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Color Tolerance</span>
                  <span className="font-mono text-cyan-400">{tolerance}</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="70"
                  value={tolerance}
                  onChange={(e) => setTolerance(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Edge Feather (Anti-aliasing)</span>
                  <span className="font-mono text-cyan-400">{feather}px</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="8"
                  value={feather}
                  onChange={(e) => setFeather(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_TOOLS} />
          </div>
        </div>
      </div>
    </div>
  );
};
