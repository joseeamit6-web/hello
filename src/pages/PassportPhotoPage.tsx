import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { PASSPORT_PRESETS, PassportPreset } from '../types/print';
import { loadImage, cropCanvas } from '../utils/imageProcessing';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { AdSlot } from '../components/common/AdSlot';
import { 
  CreditCard, 
  Check, 
  ArrowLeft, 
  Download, 
  Printer, 
  ShieldCheck, 
  Sliders, 
  Grid, 
  Info,
  Maximize2
} from 'lucide-react';

interface PassportPhotoPageProps {
  navigate: (route: string) => void;
}

export const PassportPhotoPage: React.FC<PassportPhotoPageProps> = ({ navigate }) => {
  const { project, applyImageAsNewBase, createNewProject } = useProject();

  const [selectedPreset, setSelectedPreset] = useState<PassportPreset>(PASSPORT_PRESETS[0]);
  const [showBiometricGuide, setShowBiometricGuide] = useState<boolean>(true);
  const [bgColor, setBgColor] = useState<string>('#ffffff');

  // Interactive Crop & Positioning adjustments
  const [zoomFactor, setZoomFactor] = useState<number>(1);
  const [offsetY, setOffsetY] = useState<number>(0); // percent shift
  const [offsetX, setOffsetX] = useState<number>(0);

  const [originalSrc, setOriginalSrc] = useState<string>('');
  const [passportCroppedSrc, setPassportCroppedSrc] = useState<string>('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    updatePageSeo({
      title: 'Passport Photo Maker – Custom Size & Background | AI Photo Studio',
      description: 'Create biometric compliant Nepal passport photos, US visa photos, Schengen 35x45mm, and custom ID sheets with official proportion guides.',
      canonicalPath: '/passport-photo',
    });
  }, []);

  useEffect(() => {
    const src = project?.layers[0]?.imageData?.src || SAMPLE_IMAGES[3].dataUrl;
    setOriginalSrc(src);
  }, [project]);

  // Render framed passport photo to standard 300 DPI pixel dimensions
  useEffect(() => {
    if (!originalSrc) return;

    loadImage(originalSrc).then((img) => {
      // Calculate exact pixel dimensions at 300 DPI
      const targetWidthPx = Math.round((selectedPreset.widthMm / 25.4) * selectedPreset.dpi);
      const targetHeightPx = Math.round((selectedPreset.heightMm / 25.4) * selectedPreset.dpi);

      const canvas = document.createElement('canvas');
      canvas.width = targetWidthPx;
      canvas.height = targetHeightPx;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, targetWidthPx, targetHeightPx);

      // Compute cropped head and shoulders placement
      const imgAspect = img.width / img.height;
      const targetAspect = targetWidthPx / targetHeightPx;

      let drawW = targetWidthPx * zoomFactor;
      let drawH = drawW / imgAspect;

      if (drawH < targetHeightPx) {
        drawH = targetHeightPx * zoomFactor;
        drawW = drawH * imgAspect;
      }

      const drawX = (targetWidthPx - drawW) / 2 + (offsetX / 100) * targetWidthPx;
      const drawY = (targetHeightPx - drawH) / 2 + (offsetY / 100) * targetHeightPx;

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

      const finalUrl = canvas.toDataURL('image/jpeg', 0.98);
      setPassportCroppedSrc(finalUrl);
    });
  }, [originalSrc, selectedPreset, zoomFactor, offsetX, offsetY, bgColor]);

  const handleDownloadSingle = () => {
    if (!passportCroppedSrc) return;
    const a = document.createElement('a');
    a.href = passportCroppedSrc;
    a.download = `${selectedPreset.id}-${selectedPreset.widthMm}x${selectedPreset.heightMm}mm.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpenInPrintStudio = () => {
    if (!passportCroppedSrc) return;
    // Commit the passport photo as base project and navigate to Print Studio
    if (project) {
      applyImageAsNewBase(passportCroppedSrc, `Passport Photo: ${selectedPreset.name}`);
    } else {
      createNewProject(passportCroppedSrc, `Passport ${selectedPreset.name}`);
    }
    navigate('/print-studio');
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
              <CreditCard className="h-5 w-5 text-cyan-400" />
              Passport, Visa &amp; ID Photo Maker
            </h1>
            <p className="text-xs text-slate-400">
              Official biometric proportion framing for Nepal, US, Schengen, and international consular specifications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSingle}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white"
            >
              <Download className="h-4 w-4" />
              <span>Download Photo (300 DPI)</span>
            </button>
            <button
              onClick={handleOpenInPrintStudio}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition"
            >
              <Printer className="h-4 w-4" />
              <span>Print A4 Sheet</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
          {/* Left: Passport Photo Frame Preview with Biometric Overlay */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#070b12] p-2 sm:p-6 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[500px] relative shadow-2xl overflow-hidden">
            {passportCroppedSrc ? (
              <div className="relative shadow-2xl border-4 border-slate-800 rounded bg-white overflow-hidden max-h-[340px] sm:max-h-[460px]">
                <img
                  src={passportCroppedSrc}
                  alt="Passport preview"
                  className="max-h-[320px] sm:max-h-[450px] object-contain block"
                />

                {/* Biometric Guidelines Overlay */}
                {showBiometricGuide && (
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Crown limit line (top of head) */}
                    <div
                      className="absolute left-0 right-0 border-t border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      style={{ top: `${selectedPreset.topMarginRatio * 100}%` }}
                    >
                      <span className="absolute right-1 -top-3.5 text-[9px] font-mono text-cyan-400 bg-slate-950/80 px-1 rounded">
                        Crown Limit
                      </span>
                    </div>

                    {/* Chin limit line (bottom of head) */}
                    <div
                      className="absolute left-0 right-0 border-t border-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]"
                      style={{
                        top: `${(selectedPreset.topMarginRatio + selectedPreset.headHeightMaxRatio) * 100}%`,
                      }}
                    >
                      <span className="absolute right-1 -top-3.5 text-[9px] font-mono text-cyan-400 bg-slate-950/80 px-1 rounded">
                        Chin Limit (70-80%)
                      </span>
                    </div>

                    {/* Eye level guideline */}
                    <div
                      className="absolute left-0 right-0 border-t border-dashed border-amber-400/80"
                      style={{ top: `${(selectedPreset.topMarginRatio + 0.35) * 100}%` }}
                    >
                      <span className="absolute left-1 -top-3.5 text-[9px] font-mono text-amber-400 bg-slate-950/80 px-1 rounded">
                        Eye Axis
                      </span>
                    </div>

                    {/* Center axis */}
                    <div className="absolute top-0 bottom-0 left-1/2 border-l border-cyan-400/50" />
                  </div>
                )}
              </div>
            ) : (
              <div className="text-xs text-slate-400 animate-pulse">Rendering biometric passport frame...</div>
            )}

            {/* Guide toggle button */}
            <div className="absolute bottom-3 left-4 flex items-center gap-2 bg-slate-900/90 rounded-lg px-2.5 py-1 border border-slate-800 text-xs">
              <button
                onClick={() => setShowBiometricGuide(!showBiometricGuide)}
                className={`flex items-center gap-1.5 ${showBiometricGuide ? 'text-cyan-400' : 'text-slate-500'}`}
              >
                <Grid className="h-3.5 w-3.5" />
                <span>Biometric Overlay ({showBiometricGuide ? 'ON' : 'OFF'})</span>
              </button>
            </div>
          </div>

          {/* Right: Presets & Positioning Sidebar */}
          <div className="space-y-5 text-xs">
            {/* Country Presets */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-3">
              <div className="font-bold uppercase tracking-wider text-slate-300">Select Official Preset</div>
              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {PASSPORT_PRESETS.map((preset) => {
                  const isSelected = selectedPreset.id === preset.id;
                  return (
                    <button
                      key={preset.id}
                      onClick={() => setSelectedPreset(preset)}
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-semibold'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs">{preset.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{preset.country} • {preset.bgColorName}</div>
                      </div>
                      <span className="font-mono text-[11px] text-cyan-400">
                        {preset.widthMm}×{preset.heightMm}mm
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Requirement Notes */}
              <div className="rounded-lg bg-slate-950 p-2.5 border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                <div className="font-semibold text-slate-300 flex items-center gap-1">
                  <Info className="h-3.5 w-3.5 text-cyan-400" />
                  <span>Consular Requirement:</span>
                </div>
                <p>{selectedPreset.notes}</p>
              </div>
            </div>

            {/* Framing & Scale Controls */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-3">
              <div className="font-bold uppercase tracking-wider text-slate-300">Head Scale &amp; Position</div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Zoom / Face Proportion</span>
                  <span className="font-mono text-cyan-400">{Math.round(zoomFactor * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.8"
                  step="0.02"
                  value={zoomFactor}
                  onChange={(e) => setZoomFactor(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Vertical Head Alignment</span>
                  <span className="font-mono text-cyan-400">{offsetY}%</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  value={offsetY}
                  onChange={(e) => setOffsetY(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              {/* Background Color Swatch */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Backdrop:</span>
                <div className="flex items-center gap-2">
                  {['#ffffff', '#f1f5f9', '#e2e8f0', '#38bdf8'].map((c) => (
                    <button
                      key={c}
                      onClick={() => setBgColor(c)}
                      className={`h-6 w-6 rounded border ${bgColor === c ? 'border-cyan-400 ring-2 ring-cyan-400/40' : 'border-slate-700'}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_TOOLS} />
          </div>
        </div>
      </div>
    </div>
  );
};
