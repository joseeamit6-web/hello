import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import { applyAdjustments, loadImage } from '../../utils/imageProcessing';
import { generatePrintPDF } from '../../utils/pdfGenerator';
import { DEFAULT_PRINT_CONFIG } from '../../types/print';
import { X, Download, FileImage, FileText, Check } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { project } = useProject();
  const [format, setFormat] = useState<'png' | 'jpeg' | 'webp' | 'pdf'>('png');
  const [quality, setQuality] = useState<number>(95);
  const [scale, setScale] = useState<number>(1);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Render composite image onto a canvas for export
  useEffect(() => {
    if (!isOpen || !project) return;

    let isMounted = true;
    setIsProcessing(true);

    const renderComposite = async () => {
      const exportW = Math.round(project.width * scale);
      const exportH = Math.round(project.height * scale);

      const compCanvas = document.createElement('canvas');
      compCanvas.width = exportW;
      compCanvas.height = exportH;
      const ctx = compCanvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;

      // Draw each visible layer in order
      for (const layer of project.layers) {
        if (!layer.visible || layer.opacity <= 0) continue;

        ctx.save();
        ctx.globalAlpha = layer.opacity;
        ctx.globalCompositeOperation = layer.blendMode || 'source-over';

        // Coordinates scaled
        const lx = layer.x * scale;
        const ly = layer.y * scale;
        const lw = layer.width * scale;
        const lh = layer.height * scale;

        if (layer.rotation !== 0) {
          ctx.translate(lx + lw / 2, ly + lh / 2);
          ctx.rotate((layer.rotation * Math.PI) / 180);
          ctx.translate(-(lx + lw / 2), -(ly + lh / 2));
        }

        if (layer.type === 'image' && layer.imageData?.src) {
          try {
            const img = await loadImage(layer.imageData.src);
            ctx.drawImage(img, lx, ly, lw, lh);
          } catch (e) {
            console.error('Export layer render error:', e);
          }
        } else if (layer.type === 'text' && layer.textData) {
          const t = layer.textData;
          ctx.font = `${t.isItalic ? 'italic ' : ''}${t.isBold ? 'bold ' : ''}${Math.round(t.fontSize * scale)}px ${t.fontFamily || 'sans-serif'}`;
          ctx.fillStyle = t.color;
          ctx.textAlign = t.textAlign || 'center';
          ctx.textBaseline = 'middle';
          const textX = t.textAlign === 'center' ? lx + lw / 2 : t.textAlign === 'right' ? lx + lw : lx;
          ctx.fillText(t.text, textX, ly + lh / 2);
        } else if (layer.type === 'shape' && layer.shapeData) {
          const s = layer.shapeData;
          ctx.fillStyle = s.fillColor;
          ctx.strokeStyle = s.strokeColor;
          ctx.lineWidth = s.strokeWidth * scale;

          if (s.shapeType === 'rectangle') {
            ctx.fillRect(lx, ly, lw, lh);
            if (s.strokeWidth > 0) ctx.strokeRect(lx, ly, lw, lh);
          } else if (s.shapeType === 'circle') {
            ctx.beginPath();
            ctx.arc(lx + lw / 2, ly + lh / 2, Math.min(lw, lh) / 2, 0, Math.PI * 2);
            ctx.fill();
            if (s.strokeWidth > 0) ctx.stroke();
          }
        }

        ctx.restore();
      }

      // Apply project adjustments
      const finalCanvas = applyAdjustments(compCanvas, project.adjustments);
      canvasRef.current = finalCanvas;

      if (isMounted) {
        setPreviewUrl(finalCanvas.toDataURL('image/jpeg', 0.85));
        setIsProcessing(false);
      }
    };

    renderComposite();

    return () => {
      isMounted = false;
    };
  }, [isOpen, project, scale]);

  if (!isOpen || !project) return null;

  const handleDownload = async () => {
    if (!canvasRef.current) return;
    const sanitizedName = (project.name || 'photo').replace(/[^a-zA-Z0-9_-]/g, '_');

    if (format === 'pdf') {
      const config = {
        ...DEFAULT_PRINT_CONFIG,
        photoWidth: Math.round(canvasRef.current.width / (DEFAULT_PRINT_CONFIG.dpi / 25.4)),
        photoHeight: Math.round(canvasRef.current.height / (DEFAULT_PRINT_CONFIG.dpi / 25.4)),
        copies: 1,
      };
      const result = await generatePrintPDF(canvasRef.current, config, `${sanitizedName}.pdf`);
      result.download();
      onClose();
      return;
    }

    const mime = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
    const dataUrl = canvasRef.current.toDataURL(mime, quality / 100);

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${sanitizedName}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onClose();
  };

  const finalW = Math.round(project.width * scale);
  const finalH = Math.round(project.height * scale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-[#0d131f] p-6 shadow-2xl text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white">Export &amp; Download Photo</h2>
            <p className="text-xs text-slate-400">High-resolution export with all layers, vectors, and adjustments preserved.</p>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left: Preview thumbnail */}
          <div className="flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-950 p-3 min-h-[260px] relative overflow-hidden bg-transparency-grid">
            {isProcessing ? (
              <div className="text-xs text-cyan-400 animate-pulse">Rendering full-resolution composite...</div>
            ) : previewUrl ? (
              <img src={previewUrl} alt="Export Preview" className="max-h-[240px] max-w-full object-contain rounded shadow" />
            ) : null}
            <div className="absolute bottom-2 left-2 right-2 flex justify-between bg-slate-900/90 backdrop-blur px-2.5 py-1 rounded-md text-[11px] font-mono text-slate-300 border border-slate-800">
              <span>{finalW} × {finalH} px</span>
              <span className="text-cyan-400 uppercase">{format}</span>
            </div>
          </div>

          {/* Right: Format & Quality Controls */}
          <div className="space-y-4 text-xs">
            {/* Format Selector */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">File Format</label>
              <div className="grid grid-cols-4 gap-1.5">
                {(['png', 'jpeg', 'webp', 'pdf'] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`py-2 rounded-lg border font-mono uppercase text-xs transition flex flex-col items-center gap-1 ${
                      format === fmt
                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {fmt === 'pdf' ? <FileText className="h-4 w-4" /> : <FileImage className="h-4 w-4" />}
                    <span>{fmt}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Scale multiplier */}
            <div>
              <div className="flex justify-between text-slate-300 font-medium mb-1.5">
                <span>Output Resolution</span>
                <span className="font-mono text-cyan-400">{scale}x ({finalW} × {finalH} px)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[0.5, 1, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => setScale(s)}
                    className={`py-1.5 rounded-lg border font-mono text-xs transition ${
                      scale === s
                        ? 'bg-slate-800 border-cyan-500 text-cyan-300 font-bold'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {s}x {s === 1 ? '(Original)' : s === 2 ? '(2X Ultra)' : '(Half)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Quality slider (for JPEG & WebP) */}
            {(format === 'jpeg' || format === 'webp') && (
              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1.5">
                  <span>Compression Quality</span>
                  <span className="font-mono text-cyan-400">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            )}

            {format === 'png' && (
              <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-800 text-slate-400 text-[11px] flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                <span>PNG preserves transparent pixels and alpha channel cutouts without quality loss.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 transition disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            <span>Download {format.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
