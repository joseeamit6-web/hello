import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useProject } from '../../context/ProjectContext';
import { ToolMode, BrushSettings, CropRect } from '../../types/editor';
import { applyAdjustments, spotHeal, loadImage } from '../../utils/imageProcessing';
import { Check, X, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';

interface CanvasWorkspaceProps {
  currentTool: ToolMode;
  brushSettings: BrushSettings;
  zoom: number;
  onZoomChange: (z: number) => void;
  cropRect: CropRect | null;
  setCropRect: React.Dispatch<React.SetStateAction<CropRect | null>>;
}

export const CanvasWorkspace: React.FC<CanvasWorkspaceProps> = ({
  currentTool,
  brushSettings,
  zoom,
  onZoomChange,
  cropRect,
  setCropRect,
}) => {
  const { project, updateProject, updateLayer } = useProject();
  const containerRef = useRef<HTMLDivElement>(null);
  const mainCanvasRef = useRef<HTMLCanvasElement>(null);

  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const lastMousePos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const touchDistanceRef = useRef<number | null>(null);

  // Render the composition
  const renderComposition = useCallback(async () => {
    if (!project || !mainCanvasRef.current) return;
    const canvas = mainCanvasRef.current;
    canvas.width = project.width;
    canvas.height = project.height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw layers from bottom to top
    for (const layer of project.layers) {
      if (!layer.visible || layer.opacity <= 0) continue;

      ctx.save();
      ctx.globalAlpha = layer.opacity;
      ctx.globalCompositeOperation = layer.blendMode || 'source-over';

      if (layer.rotation !== 0) {
        ctx.translate(layer.x + layer.width / 2, layer.y + layer.height / 2);
        ctx.rotate((layer.rotation * Math.PI) / 180);
        ctx.translate(-(layer.x + layer.width / 2), -(layer.y + layer.height / 2));
      }

      if (layer.type === 'image' && layer.imageData?.src) {
        try {
          const img = await loadImage(layer.imageData.src);
          ctx.drawImage(img, layer.x, layer.y, layer.width, layer.height);
        } catch (e) {
          console.error(e);
        }
      } else if (layer.type === 'text' && layer.textData) {
        const t = layer.textData;
        ctx.font = `${t.isItalic ? 'italic ' : ''}${t.isBold ? 'bold ' : ''}${t.fontSize}px ${t.fontFamily || 'sans-serif'}`;
        ctx.fillStyle = t.color;
        ctx.textAlign = t.textAlign || 'center';
        ctx.textBaseline = 'middle';
        const textX = t.textAlign === 'center' ? layer.x + layer.width / 2 : t.textAlign === 'right' ? layer.x + layer.width : layer.x;
        ctx.fillText(t.text, textX, layer.y + layer.height / 2);
      } else if (layer.type === 'shape' && layer.shapeData) {
        const s = layer.shapeData;
        ctx.fillStyle = s.fillColor;
        ctx.strokeStyle = s.strokeColor;
        ctx.lineWidth = s.strokeWidth;

        if (s.shapeType === 'rectangle') {
          ctx.fillRect(layer.x, layer.y, layer.width, layer.height);
          if (s.strokeWidth > 0) ctx.strokeRect(layer.x, layer.y, layer.width, layer.height);
        } else if (s.shapeType === 'circle') {
          ctx.beginPath();
          ctx.arc(layer.x + layer.width / 2, layer.y + layer.height / 2, Math.min(layer.width, layer.height) / 2, 0, Math.PI * 2);
          ctx.fill();
          if (s.strokeWidth > 0) ctx.stroke();
        }
      }

      ctx.restore();
    }

    // Apply adjustments
    const adjusted = applyAdjustments(canvas, project.adjustments);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(adjusted, 0, 0);
  }, [project]);

  useEffect(() => {
    renderComposition();
  }, [renderComposition]);

  // Convert client coordinate to canvas coordinate
  const clientToCanvasCoords = (clientX: number, clientY: number): { x: number; y: number } => {
    if (!mainCanvasRef.current) return { x: 0, y: 0 };
    const rect = mainCanvasRef.current.getBoundingClientRect();
    const x = (clientX - rect.left) / zoom;
    const y = (clientY - rect.top) / zoom;
    return {
      x: Math.round(Math.max(0, Math.min(project?.width || 0, x))),
      y: Math.round(Math.max(0, Math.min(project?.height || 0, y))),
    };
  };

  const executeToolAction = (x: number, y: number) => {
    if (!project || !mainCanvasRef.current) return;

    if (currentTool === 'brush' || currentTool === 'eraser') {
      const ctx = mainCanvasRef.current.getContext('2d');
      if (ctx) {
        ctx.save();
        if (currentTool === 'eraser') {
          ctx.globalCompositeOperation = 'destination-out';
        } else {
          ctx.globalCompositeOperation = 'source-over';
          ctx.fillStyle = brushSettings.color;
        }
        ctx.globalAlpha = brushSettings.opacity / 100;
        ctx.beginPath();
        ctx.arc(x, y, brushSettings.size / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    } else if (currentTool === 'healing') {
      spotHeal(mainCanvasRef.current, x, y, brushSettings.size);
    }
  };

  const commitToolAction = () => {
    if (!project || !mainCanvasRef.current) return;
    if (currentTool === 'brush' || currentTool === 'eraser' || currentTool === 'healing') {
      const dataUrl = mainCanvasRef.current.toDataURL('image/png');
      const selected = project.layers.find((l) => l.id === project.selectedLayerId);
      if (selected) {
        updateLayer(selected.id, {
          imageData: {
            src: dataUrl,
            naturalWidth: project.width,
            naturalHeight: project.height,
          },
        });
      }
    }
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!project) return;
    const isSpaceOrMiddle = e.button === 1 || e.altKey || currentTool === 'move';

    if (isSpaceOrMiddle) {
      setIsPanning(true);
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    setIsMouseDown(true);
    const { x, y } = clientToCanvasCoords(e.clientX, e.clientY);
    executeToolAction(x, y);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      const dx = e.clientX - lastMousePos.current.x;
      const dy = e.clientY - lastMousePos.current.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: e.clientX, y: e.clientY };
      return;
    }

    if (!isMouseDown) return;
    const { x, y } = clientToCanvasCoords(e.clientX, e.clientY);
    executeToolAction(x, y);
  };

  const handleMouseUp = () => {
    setIsPanning(false);
    if (isMouseDown) {
      commitToolAction();
    }
    setIsMouseDown(false);
  };

  // Touch Handlers for Mobile & Tablet
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!project) return;

    if (e.touches.length === 2) {
      // Two fingers: Pinch to zoom / Pan
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchDistanceRef.current = dist;
      setIsPanning(true);
      lastMousePos.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (currentTool === 'move') {
        setIsPanning(true);
        lastMousePos.current = { x: touch.clientX, y: touch.clientY };
        return;
      }

      setIsMouseDown(true);
      const { x, y } = clientToCanvasCoords(touch.clientX, touch.clientY);
      executeToolAction(x, y);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchDistanceRef.current !== null) {
      // Pinch zoom
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scaleDelta = (newDist - touchDistanceRef.current) * 0.005;
      onZoomChange(Math.max(0.1, Math.min(4, zoom + scaleDelta)));
      touchDistanceRef.current = newDist;

      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const dx = midX - lastMousePos.current.x;
      const dy = midY - lastMousePos.current.y;
      setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
      lastMousePos.current = { x: midX, y: midY };
      return;
    }

    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (isPanning) {
        const dx = touch.clientX - lastMousePos.current.x;
        const dy = touch.clientY - lastMousePos.current.y;
        setPan((prev) => ({ x: prev.x + dx, y: prev.y + dy }));
        lastMousePos.current = { x: touch.clientX, y: touch.clientY };
        return;
      }

      if (isMouseDown) {
        const { x, y } = clientToCanvasCoords(touch.clientX, touch.clientY);
        executeToolAction(x, y);
      }
    }
  };

  const handleTouchEnd = () => {
    touchDistanceRef.current = null;
    setIsPanning(false);
    if (isMouseDown) {
      commitToolAction();
    }
    setIsMouseDown(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      onZoomChange(Math.max(0.1, Math.min(4, zoom + delta)));
    } else {
      setPan((prev) => ({ x: prev.x - e.deltaX, y: prev.y - e.deltaY }));
    }
  };

  // Crop confirmation
  const handleApplyCrop = () => {
    if (!cropRect || !mainCanvasRef.current || !project) return;
    const cropped = document.createElement('canvas');
    cropped.width = cropRect.width;
    cropped.height = cropRect.height;
    const cCtx = cropped.getContext('2d');
    if (cCtx) {
      cCtx.drawImage(
        mainCanvasRef.current,
        cropRect.x,
        cropRect.y,
        cropRect.width,
        cropRect.height,
        0,
        0,
        cropRect.width,
        cropRect.height
      );
      const dataUrl = cropped.toDataURL('image/png');
      updateProject((prev) => ({
        ...prev,
        width: cropRect.width,
        height: cropRect.height,
        layers: [
          {
            ...prev.layers[0],
            width: cropRect.width,
            height: cropRect.height,
            imageData: {
              src: dataUrl,
              naturalWidth: cropRect.width,
              naturalHeight: cropRect.height,
            },
          },
        ],
      }), 'Crop Canvas');
    }
    setCropRect(null);
  };

  if (!project) return null;

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ touchAction: 'none' }}
      className="relative flex-1 overflow-hidden bg-[#070b12] flex items-center justify-center select-none cursor-crosshair pb-12 md:pb-0"
    >
      {/* Centered Canvas Container */}
      <div
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: 'center center',
          transition: isPanning ? 'none' : 'transform 0.05s ease-out',
        }}
        className="relative shadow-2xl rounded-sm overflow-hidden bg-transparency-grid border border-slate-700/60 max-w-[95vw] max-h-[80vh] flex items-center justify-center"
      >
        <canvas
          ref={mainCanvasRef}
          width={project.width}
          height={project.height}
          className="block max-w-none"
        />

        {/* Overlay for crop marquee */}
        {cropRect && (
          <div
            className="absolute border-2 border-cyan-400 bg-cyan-400/10 pointer-events-none"
            style={{
              left: `${cropRect.x}px`,
              top: `${cropRect.y}px`,
              width: `${cropRect.width}px`,
              height: `${cropRect.height}px`,
            }}
          >
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
              <div className="border-r border-b border-cyan-300/40" />
              <div className="border-r border-b border-cyan-300/40" />
              <div className="border-b border-cyan-300/40" />
              <div className="border-r border-b border-cyan-300/40" />
              <div className="border-r border-b border-cyan-300/40" />
              <div className="border-b border-cyan-300/40" />
              <div className="border-r border-cyan-300/40" />
              <div className="border-r border-cyan-300/40" />
              <div />
            </div>
          </div>
        )}
      </div>

      {/* Floating Crop Action Bar if Crop is active */}
      {cropRect && (
        <div className="absolute bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/95 px-3 sm:px-4 py-2 text-xs shadow-2xl backdrop-blur">
          <span className="font-mono text-cyan-400">{cropRect.width} × {cropRect.height} px</span>
          <div className="h-4 w-px bg-slate-800" />
          <button
            onClick={handleApplyCrop}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium shadow transition"
          >
            <Check className="h-3.5 w-3.5" />
            Apply
          </button>
          <button
            onClick={() => setCropRect(null)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="h-3.5 w-3.5" />
            Cancel
          </button>
        </div>
      )}

      {/* Status Bar */}
      <div className="absolute bottom-14 md:bottom-2 left-2 sm:left-3 right-2 sm:right-3 pointer-events-none flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2 bg-slate-950/80 px-2 sm:px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur">
          <span>{project.width} × {project.height} px</span>
          <span>•</span>
          <span>{project.layers.length} Layers</span>
        </div>
        <div className="hidden sm:flex items-center gap-2 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800 backdrop-blur">
          <span>Zoom: {Math.round(zoom * 100)}%</span>
        </div>
      </div>
    </div>
  );
};
