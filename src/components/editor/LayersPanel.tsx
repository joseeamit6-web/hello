import React, { useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import { BlendMode } from '../../types/project';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Type, 
  Square, 
  Image as ImageIcon 
} from 'lucide-react';

export const LayersPanel: React.FC = () => {
  const { 
    project, 
    selectLayer, 
    updateLayer, 
    deleteLayer, 
    duplicateLayer, 
    reorderLayers,
    addLayer 
  } = useProject();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!project) return null;

  const selectedLayer = project.layers.find((l) => l.id === project.selectedLayerId) || project.layers[0];

  const blendModes: { value: BlendMode; label: string }[] = [
    { value: 'source-over', label: 'Normal' },
    { value: 'multiply', label: 'Multiply' },
    { value: 'screen', label: 'Screen' },
    { value: 'overlay', label: 'Overlay' },
    { value: 'darken', label: 'Darken' },
    { value: 'lighten', label: 'Lighten' },
    { value: 'color-dodge', label: 'Color Dodge' },
    { value: 'color-burn', label: 'Color Burn' },
    { value: 'hard-light', label: 'Hard Light' },
    { value: 'difference', label: 'Difference' },
    { value: 'luminosity', label: 'Luminosity' },
  ];

  const handleAddImageLayer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        if (src) {
          const img = new Image();
          img.onload = () => {
            addLayer({
              name: file.name.replace(/\.[^/.]+$/, ''),
              type: 'image',
              visible: true,
              locked: false,
              opacity: 1,
              blendMode: 'source-over',
              x: 20,
              y: 20,
              width: img.width,
              height: img.height,
              rotation: 0,
              imageData: {
                src,
                naturalWidth: img.width,
                naturalHeight: img.height,
              },
            });
          };
          img.src = src;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddTextLayer = () => {
    addLayer({
      name: 'Text Layer',
      type: 'text',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'source-over',
      x: Math.round(project.width * 0.2),
      y: Math.round(project.height * 0.3),
      width: Math.round(project.width * 0.6),
      height: 80,
      rotation: 0,
      textData: {
        text: 'AI Photo Studio',
        fontFamily: 'Plus Jakarta Sans',
        fontSize: Math.round(project.width * 0.06),
        color: '#ffffff',
        isBold: true,
        isItalic: false,
        textAlign: 'center',
      },
    });
  };

  const handleAddShapeLayer = (shapeType: 'rectangle' | 'circle') => {
    addLayer({
      name: shapeType === 'rectangle' ? 'Badge Rectangle' : 'Graphic Circle',
      type: 'shape',
      visible: true,
      locked: false,
      opacity: 0.9,
      blendMode: 'source-over',
      x: Math.round(project.width * 0.25),
      y: Math.round(project.height * 0.25),
      width: Math.round(project.width * 0.5),
      height: Math.round(project.height * 0.25),
      rotation: 0,
      shapeData: {
        shapeType,
        fillColor: 'rgba(6, 182, 212, 0.4)',
        strokeColor: '#06b6d4',
        strokeWidth: 4,
      },
    });
  };

  return (
    <div className="flex flex-col h-full text-xs">
      {/* Selected layer properties (Blend mode & Opacity) */}
      {selectedLayer && (
        <div className="p-3 border-b border-slate-800 bg-slate-900/40 space-y-2.5">
          <div className="flex items-center justify-between gap-2">
            <label className="text-slate-400 font-medium">Blend Mode:</label>
            <select
              value={selectedLayer.blendMode}
              onChange={(e) => updateLayer(selectedLayer.id, { blendMode: e.target.value as BlendMode })}
              className="bg-slate-800 text-slate-200 rounded px-2 py-1 text-xs border border-slate-700 outline-none focus:border-cyan-500"
            >
              {blendModes.map((bm) => (
                <option key={bm.value} value={bm.value}>{bm.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between gap-2">
            <label className="text-slate-400 font-medium">Opacity:</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(selectedLayer.opacity * 100)}
                onChange={(e) => updateLayer(selectedLayer.id, { opacity: Number(e.target.value) / 100 })}
                className="w-24 accent-cyan-400 h-1"
              />
              <span className="font-mono text-slate-300 w-8 text-right">
                {Math.round(selectedLayer.opacity * 100)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Layers list */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
        {project.layers
          .slice()
          .reverse()
          .map((layer, revIdx) => {
            const actualIdx = project.layers.length - 1 - revIdx;
            const isSelected = project.selectedLayerId === layer.id;

            return (
              <div
                key={layer.id}
                onClick={() => selectLayer(layer.id)}
                className={`group flex items-center justify-between p-2 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/50 shadow-sm'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-800/40 hover:border-slate-700'
                }`}
              >
                {/* Left: Thumbnail & Name */}
                <div className="flex items-center gap-2.5 truncate">
                  <div className="h-7 w-7 rounded bg-slate-950 flex-shrink-0 flex items-center justify-center border border-slate-800 overflow-hidden">
                    {layer.type === 'image' && layer.imageData?.src ? (
                      <img src={layer.imageData.src} alt="" className="w-full h-full object-cover" />
                    ) : null}
                    {layer.type === 'text' && <Type className="h-3.5 w-3.5 text-cyan-400" />}
                    {layer.type === 'shape' && <Square className="h-3.5 w-3.5 text-violet-400" />}
                  </div>
                  <span className={`font-medium truncate ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                    {layer.name}
                  </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-1">
                  {/* Visibility */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLayer(layer.id, { visible: !layer.visible });
                    }}
                    className={`p-1 rounded hover:bg-slate-700/60 ${layer.visible ? 'text-slate-400 hover:text-white' : 'text-slate-600'}`}
                    title={layer.visible ? 'Hide layer' : 'Show layer'}
                  >
                    {layer.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                  </button>

                  {/* Lock */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      updateLayer(layer.id, { locked: !layer.locked });
                    }}
                    className={`p-1 rounded hover:bg-slate-700/60 ${layer.locked ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                    title={layer.locked ? 'Unlock layer' : 'Lock layer'}
                  >
                    {layer.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      {/* Layer management footer */}
      <div className="p-2 border-t border-slate-800 bg-[#090d16] flex items-center justify-between gap-1">
        <div className="flex items-center gap-1">
          {/* Add Text */}
          <button
            onClick={handleAddTextLayer}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Add Text Layer"
          >
            <Type className="h-3.5 w-3.5" />
          </button>
          {/* Add Shape */}
          <button
            onClick={() => handleAddShapeLayer('rectangle')}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Add Shape Layer"
          >
            <Square className="h-3.5 w-3.5" />
          </button>
          {/* Add Image */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAddImageLayer}
            accept="image/*"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
            title="Add Image Layer"
          >
            <ImageIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Duplicate */}
          <button
            onClick={() => selectedLayer && duplicateLayer(selectedLayer.id)}
            disabled={!selectedLayer}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-40"
            title="Duplicate Layer"
          >
            <Copy className="h-3.5 w-3.5" />
          </button>
          {/* Delete */}
          <button
            onClick={() => selectedLayer && deleteLayer(selectedLayer.id)}
            disabled={!selectedLayer || project.layers.length <= 1}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-900/60 text-slate-300 hover:text-rose-300 disabled:opacity-40"
            title="Delete Layer"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
