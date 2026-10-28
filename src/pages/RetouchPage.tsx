import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { spotHeal, loadImage } from '../utils/imageProcessing';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { AdSlot } from '../components/common/AdSlot';
import { 
  UserCheck, 
  Sparkle, 
  Eraser, 
  RotateCcw, 
  Check, 
  ArrowLeft, 
  Undo, 
  Redo, 
  ZoomIn, 
  ZoomOut,
  Maximize2
} from 'lucide-react';

interface RetouchPageProps {
  navigate: (route: string) => void;
}

export const RetouchPage: React.FC<RetouchPageProps> = ({ navigate }) => {
  const { project, applyImageAsNewBase, createNewProject } = useProject();

  const [tool, setTool] = useState<'heal' | 'smooth' | 'dodge' | 'burn'>('heal');
  const [brushRadius, setBrushRadius] = useState<number>(18);
  const [brushIntensity, setBrushIntensity] = useState<number>(75);
  const [zoom, setZoom] = useState<number>(1);
  const [historyStack, setHistoryStack] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  useEffect(() => {
    updatePageSeo({
      title: 'Face Retouch & Brush Photo Editor | AI Photo Studio',
      description: 'Retouch portraits, eliminate blemishes, heal skin imperfections, and balance lighting with precision brush tools.',
      canonicalPath: '/retouch',
    });
  }, []);

  // Initialize canvas with active base image or sample portrait
  useEffect(() => {
    const src = project?.layers[0]?.imageData?.src || SAMPLE_IMAGES[0].dataUrl;
    loadImage(src).then((img) => {
      if (!canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (ctx) {
        ctx.drawImage(img, 0, 0);
        const initialSnapshot = canvas.toDataURL('image/png');
        setHistoryStack([initialSnapshot]);
        setHistoryIndex(0);
      }
    });
  }, [project]);

  const saveSnapshot = () => {
    if (!canvasRef.current) return;
    const snap = canvasRef.current.toDataURL('image/png');
    setHistoryStack((prev) => [...prev.slice(0, historyIndex + 1), snap]);
    setHistoryIndex((prev) => prev + 1);
  };

  const getCanvasCoords = (e: React.MouseEvent): { x: number; y: number } => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    return {
      x: Math.round(Math.max(0, Math.min(canvasRef.current.width, x))),
      y: Math.round(Math.max(0, Math.min(canvasRef.current.height, y))),
    };
  };

  const applyRetouchStroke = (x: number, y: number) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    if (tool === 'heal') {
      spotHeal(canvas, x, y, brushRadius);
    } else if (tool === 'smooth') {
      // Skin smoothing pass: localized gentle box blur
      const r = Math.round(brushRadius);
      const startX = Math.max(0, x - r);
      const startY = Math.max(0, y - r);
      const w = Math.min(r * 2, canvas.width - startX);
      const h = Math.min(r * 2, canvas.height - startY);
      if (w <= 0 || h <= 0) return;

      const imgData = ctx.getImageData(startX, startY, w, h);
      const data = imgData.data;
      const weight = (brushIntensity / 100) * 0.45;

      for (let py = 1; py < h - 1; py += 2) {
        for (let px = 1; px < w - 1; px += 2) {
          const dx = px - r;
          const dy = py - r;
          if (dx * dx + dy * dy <= r * r) {
            const idx = (py * w + px) * 4;
            const top = ((py - 1) * w + px) * 4;
            const btm = ((py + 1) * w + px) * 4;
            const lft = (py * w + (px - 1)) * 4;
            const rgt = (py * w + (px + 1)) * 4;

            for (let c = 0; c < 3; c++) {
              const avg = (data[top + c] + data[btm + c] + data[lft + c] + data[rgt + c]) / 4;
              data[idx + c] = Math.round(data[idx + c] * (1 - weight) + avg * weight);
            }
          }
        }
      }
      ctx.putImageData(imgData, startX, startY);
    } else if (tool === 'dodge' || tool === 'burn') {
      // Dodge (brighten) or Burn (darken)
      ctx.save();
      ctx.globalCompositeOperation = tool === 'dodge' ? 'screen' : 'multiply';
      ctx.globalAlpha = (brushIntensity / 100) * 0.15;
      ctx.fillStyle = tool === 'dodge' ? '#ffffff' : '#000000';
      ctx.beginPath();
      ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsMouseDown(true);
    const { x, y } = getCanvasCoords(e);
    applyRetouchStroke(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDown) return;
    const { x, y } = getCanvasCoords(e);
    applyRetouchStroke(x, y);
  };

  const handleMouseUp = () => {
    if (isMouseDown) {
      saveSnapshot();
    }
    setIsMouseDown(false);
  };

  // Touch handlers for mobile and tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      setIsMouseDown(true);
      const touch = e.touches[0];
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const x = Math.round(Math.max(0, Math.min(canvasRef.current.width, (touch.clientX - rect.left) / zoom)));
      const y = Math.round(Math.max(0, Math.min(canvasRef.current.height, (touch.clientY - rect.top) / zoom)));
      applyRetouchStroke(x, y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMouseDown || !e.touches[0] || !canvasRef.current) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const x = Math.round(Math.max(0, Math.min(canvasRef.current.width, (touch.clientX - rect.left) / zoom)));
    const y = Math.round(Math.max(0, Math.min(canvasRef.current.height, (touch.clientY - rect.top) / zoom)));
    applyRetouchStroke(x, y);
  };

  const handleTouchEnd = () => {
    if (isMouseDown) {
      saveSnapshot();
    }
    setIsMouseDown(false);
  };

  const handleUndo = () => {
    if (historyIndex <= 0) return;
    const newIdx = historyIndex - 1;
    const snap = historyStack[newIdx];
    if (snap && canvasRef.current) {
      loadImage(snap).then((img) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
          setHistoryIndex(newIdx);
        }
      });
    }
  };

  const handleRedo = () => {
    if (historyIndex >= historyStack.length - 1) return;
    const newIdx = historyIndex + 1;
    const snap = historyStack[newIdx];
    if (snap && canvasRef.current) {
      loadImage(snap).then((img) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0);
          setHistoryIndex(newIdx);
        }
      });
    }
  };

  const handleApply = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    if (project) {
      applyImageAsNewBase(dataUrl, 'Apply Face Retouching');
      navigate('/editor');
    } else {
      createNewProject(dataUrl, 'Retouched Photo').then(() => navigate('/editor'));
    }
  };

  return (
    <div className="flex-1 bg-[#090d16] text-slate-100 py-6 px-4 sm:px-6 flex flex-col">
      <div className="mx-auto max-w-6xl w-full flex-1 flex flex-col">
        {/* Top Header */}
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
              <UserCheck className="h-5 w-5 text-cyan-400" />
              Portrait Retouch &amp; Blemish Brush
            </h1>
            <p className="text-xs text-slate-400">
              Click or drag directly over skin blemishes, wrinkles, or uneven shadows to heal and soften.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              title="Undo Stroke"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= historyStack.length - 1}
              className="p-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 hover:text-white disabled:opacity-40"
              title="Redo Stroke"
            >
              <Redo className="h-4 w-4" />
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

        {/* Toolbar & Canvas Layout */}
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 items-start">
          {/* Main Retouch Canvas */}
          <div
            ref={containerRef}
            className="lg:col-span-3 rounded-2xl border border-slate-800 bg-[#070b12] p-4 flex flex-col items-center justify-center min-h-[500px] overflow-auto select-none relative shadow-2xl"
          >
            <div
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
              className="transition-transform duration-75 relative bg-transparency-grid rounded shadow"
            >
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{ touchAction: 'none' }}
                className="block cursor-crosshair max-w-none"
              />
            </div>

            {/* Bottom floating zoom bar */}
            <div className="absolute bottom-3 left-4 flex items-center gap-1 bg-slate-900/90 rounded-lg p-1 border border-slate-800 backdrop-blur text-xs">
              <button onClick={() => setZoom(Math.max(0.2, zoom - 0.2))} className="p-1 hover:text-cyan-400">
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <span className="font-mono text-cyan-400 px-1">{Math.round(zoom * 100)}%</span>
              <button onClick={() => setZoom(Math.min(3, zoom + 0.2))} className="p-1 hover:text-cyan-400">
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button onClick={() => setZoom(1)} className="p-1 hover:text-cyan-400 border-l border-slate-800 pl-1.5" title="Reset 100%">
                <Maximize2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Right Retouch Controls Sidebar */}
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-4 text-xs">
              <div className="font-bold uppercase tracking-wider text-slate-300">Retouch Tool</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTool('heal')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    tool === 'heal'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <Sparkle className="h-4 w-4 text-cyan-400" />
                  <span>Spot Healing</span>
                  <span className="text-[10px] text-slate-500 font-normal">Blemish remover</span>
                </button>

                <button
                  onClick={() => setTool('smooth')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    tool === 'smooth'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <UserCheck className="h-4 w-4 text-violet-400" />
                  <span>Skin Soften</span>
                  <span className="text-[10px] text-slate-500 font-normal">Pore &amp; tone blur</span>
                </button>

                <button
                  onClick={() => setTool('dodge')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    tool === 'dodge'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="h-4 w-4 rounded-full border border-amber-300 bg-amber-400/20" />
                  <span>Dodge Brush</span>
                  <span className="text-[10px] text-slate-500 font-normal">Brighten eyes/teeth</span>
                </button>

                <button
                  onClick={() => setTool('burn')}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col gap-1 ${
                    tool === 'burn'
                      ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="h-4 w-4 rounded-full border border-slate-600 bg-slate-900" />
                  <span>Burn Brush</span>
                  <span className="text-[10px] text-slate-500 font-normal">Deepen shadows</span>
                </button>
              </div>

              {/* Sliders */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Brush Radius</span>
                    <span className="font-mono text-cyan-400">{brushRadius}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={brushRadius}
                    onChange={(e) => setBrushRadius(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-slate-300 font-medium mb-1">
                    <span>Stroke Intensity</span>
                    <span className="font-mono text-cyan-400">{brushIntensity}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={brushIntensity}
                    onChange={(e) => setBrushIntensity(Number(e.target.value))}
                    className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                  />
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
