import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { 
  PrintStudioConfig, 
  DEFAULT_PRINT_CONFIG, 
  PAPER_SIZES, 
  PaperPreset, 
  PrintUnit 
} from '../types/print';
import { calculatePrintGrid, generatePrintPDF } from '../utils/pdfGenerator';
import { triggerBrowserPrint } from '../utils/printHelper';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { AdSlot } from '../components/common/AdSlot';
import { 
  Printer, 
  Download, 
  FileText, 
  ArrowLeft, 
  Check, 
  ShieldCheck, 
  Sliders, 
  Grid, 
  FileCheck2,
  RefreshCw
} from 'lucide-react';

interface PrintStudioPageProps {
  navigate: (route: string) => void;
}

export const PrintStudioPage: React.FC<PrintStudioPageProps> = ({ navigate }) => {
  const { project } = useProject();

  const [config, setConfig] = useState<PrintStudioConfig>(DEFAULT_PRINT_CONFIG);
  const [photoSrc, setPhotoSrc] = useState<string>('');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);
  const [lastPdfInfo, setLastPdfInfo] = useState<{ pages: number; filename: string } | null>(null);

  useEffect(() => {
    updatePageSeo({
      title: 'Custom Photo Print Size & A4 Layout Maker | AI Photo Studio',
      description: 'Prepare exact millimetre photo sheets for A4, 4x6, and custom paper sizes at 300 DPI with cutting guides and guaranteed zero blank pages.',
      canonicalPath: '/print-studio',
    });
  }, []);

  useEffect(() => {
    const src = project?.layers[0]?.imageData?.src || SAMPLE_IMAGES[0].dataUrl;
    setPhotoSrc(src);
  }, [project]);

  // Derived grid calculation
  const grid = calculatePrintGrid(config);

  const handlePaperPresetChange = (preset: PaperPreset) => {
    const p = PAPER_SIZES[preset];
    setConfig((prev) => ({
      ...prev,
      paperPreset: preset,
      paperWidthMm: p.widthMm,
      paperHeightMm: p.heightMm,
    }));
  };

  const handleGeneratePdf = async () => {
    if (!photoSrc) return;
    setIsGeneratingPdf(true);
    try {
      const filename = `photo-sheet-${config.paperPreset}-${config.photoWidth}x${config.photoHeight}${config.unit}.pdf`;
      const result = await generatePrintPDF(photoSrc, config, filename);
      result.download();
      setLastPdfInfo({ pages: result.pageCount, filename });
    } catch (e) {
      console.error('PDF generation error:', e);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleBrowserPrint = async () => {
    if (!photoSrc) return;
    setIsPrinting(true);
    try {
      await triggerBrowserPrint(photoSrc, config);
    } catch (e) {
      console.error('Browser print error:', e);
    } finally {
      setIsPrinting(false);
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
              <Printer className="h-5 w-5 text-emerald-400" />
              Custom Print Studio &amp; A4 Layout Engine
            </h1>
            <p className="text-xs text-slate-400">
              Calculate optimal rows and columns on A4 or 4×6 photo paper with precision 300 DPI resolution and zero blank pages.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleBrowserPrint}
              disabled={isPrinting}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white transition disabled:opacity-50"
            >
              <Printer className="h-4 w-4 text-cyan-400" />
              <span>{isPrinting ? 'Preparing Print...' : 'Browser Print'}</span>
            </button>
            <button
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download Print PDF'}</span>
            </button>
          </div>
        </div>

        {/* Content Layout */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
          {/* Left: Scaled Sheet Layout Preview */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#070b12] p-3 sm:p-6 flex flex-col items-center justify-center min-h-[360px] sm:min-h-[520px] relative shadow-2xl overflow-hidden">
            {/* Sheet Representation with true aspect ratio */}
            <div
              style={{
                width: '100%',
                maxWidth: config.orientation === 'landscape' ? '460px' : '360px',
                aspectRatio: `${grid.paperWidthMm} / ${grid.paperHeightMm}`,
              }}
              className="relative rounded border border-slate-300 bg-white shadow-2xl p-2 select-none"
            >
              {/* Scaled photo grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
                  gap: '4px',
                  padding: '6px',
                  height: '100%',
                  alignContent: 'start',
                }}
              >
                {Array.from({ length: Math.min(grid.totalCopies, grid.perPageCapacity) }).map((_, i) => (
                  <div
                    key={i}
                    style={{
                      aspectRatio: `${grid.photoWidthMm} / ${grid.photoHeightMm}`,
                      outline: config.showCuttingGuides ? `1px dashed ${config.cuttingGuideColor || '#94a3b8'}` : 'none',
                    }}
                    className="overflow-hidden bg-slate-100 flex items-center justify-center"
                  >
                    <img src={photoSrc} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Print Quality & Zero Blank Page Assurance Banner */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="h-4 w-4" />
                <span>Zero Blank Page Engine: Active</span>
              </span>
              <span>•</span>
              <span>Capacity: {grid.perPageCapacity} photos/sheet</span>
              <span>•</span>
              <span>Sheets: {grid.totalSheetsNeeded}</span>
              <span>•</span>
              <span>{config.dpi} DPI</span>
            </div>
          </div>

          {/* Right: Print Configuration Panel */}
          <div className="space-y-5 text-xs">
            {/* Paper Selection */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-3">
              <div className="font-bold uppercase tracking-wider text-slate-300">Paper Format &amp; Orientation</div>

              <div className="grid grid-cols-2 gap-2">
                {(['A4', '4x6', '5x7', 'Letter'] as PaperPreset[]).map((preset) => (
                  <button
                    key={preset}
                    onClick={() => handlePaperPresetChange(preset)}
                    className={`p-2 rounded-xl border text-center transition ${
                      config.paperPreset === preset
                        ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {PAPER_SIZES[preset].name}
                  </button>
                ))}
              </div>

              {/* Orientation */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, orientation: 'portrait' }))}
                  className={`py-1.5 rounded-lg border font-medium transition ${
                    config.orientation === 'portrait'
                      ? 'bg-slate-800 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Portrait (Tall)
                </button>
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, orientation: 'landscape' }))}
                  className={`py-1.5 rounded-lg border font-medium transition ${
                    config.orientation === 'landscape'
                      ? 'bg-slate-800 border-cyan-500 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  Landscape (Wide)
                </button>
              </div>
            </div>

            {/* Individual Photo Sizing */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-3">
              <div className="font-bold uppercase tracking-wider text-slate-300">Photo Physical Dimensions</div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Width</label>
                  <input
                    type="number"
                    value={config.photoWidth}
                    onChange={(e) => setConfig((prev) => ({ ...prev, photoWidth: Number(e.target.value) }))}
                    className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Height</label>
                  <input
                    type="number"
                    value={config.photoHeight}
                    onChange={(e) => setConfig((prev) => ({ ...prev, photoHeight: Number(e.target.value) }))}
                    className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Unit</label>
                  <select
                    value={config.unit}
                    onChange={(e) => setConfig((prev) => ({ ...prev, unit: e.target.value as PrintUnit }))}
                    className="w-full rounded bg-slate-900 border border-slate-700 px-2 py-1 text-white"
                  >
                    <option value="mm">mm</option>
                    <option value="cm">cm</option>
                    <option value="inch">in</option>
                    <option value="px">px</option>
                  </select>
                </div>
              </div>

              {/* Quick passport shortcuts */}
              <div className="flex items-center gap-1.5 pt-1">
                <span className="text-[10px] text-slate-500 font-mono">Quick:</span>
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, photoWidth: 35, photoHeight: 45, unit: 'mm' }))}
                  className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white"
                >
                  35×45 mm
                </button>
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, photoWidth: 2, photoHeight: 2, unit: 'inch' }))}
                  className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white"
                >
                  2×2 in
                </button>
                <button
                  onClick={() => setConfig((prev) => ({ ...prev, photoWidth: 50, photoHeight: 70, unit: 'mm' }))}
                  className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 hover:text-white"
                >
                  50×70 mm
                </button>
              </div>
            </div>

            {/* Copies & Cutting Lines */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-3">
              <div className="font-bold uppercase tracking-wider text-slate-300">Layout &amp; Copies</div>

              <div className="flex items-center justify-between">
                <div>
                  <span className="text-slate-300 font-medium">Auto-fill entire sheet</span>
                  <p className="text-[10px] text-slate-500">Max capacity: {grid.perPageCapacity} copies</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.autoFillGrid}
                  onChange={(e) => setConfig((prev) => ({ ...prev, autoFillGrid: e.target.checked }))}
                  className="h-4 w-4 rounded accent-cyan-500 cursor-pointer"
                />
              </div>

              {!config.autoFillGrid && (
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Copies Count</span>
                    <span className="font-mono text-cyan-400">{config.copies} photos</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="32"
                    value={config.copies}
                    onChange={(e) => setConfig((prev) => ({ ...prev, copies: Number(e.target.value) }))}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>
              )}

              {/* Cutting guides toggle */}
              <label className="flex items-center justify-between pt-1 cursor-pointer">
                <div>
                  <span className="text-slate-300 font-medium">Cutting guides</span>
                  <p className="text-[10px] text-slate-500">Hairline scissor boundary lines</p>
                </div>
                <input
                  type="checkbox"
                  checked={config.showCuttingGuides}
                  onChange={(e) => setConfig((prev) => ({ ...prev, showCuttingGuides: e.target.checked }))}
                  className="h-4 w-4 rounded accent-cyan-500 cursor-pointer"
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
