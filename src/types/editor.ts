export type ToolMode =
  | 'select'       // Selection marquee / transform
  | 'move'         // Move layer / Pan
  | 'crop'         // Crop & Straighten
  | 'brush'        // Freehand paint
  | 'eraser'       // Alpha eraser
  | 'healing'      // Spot blemish healing
  | 'clone'        // Clone stamp
  | 'text'         // Text placement
  | 'shape'        // Geometric shape
  | 'eyedropper'   // Color sampler
  | 'fill'         // Bucket flood fill
  | 'blur-brush'   // Selective blur
  | 'zoom';        // Zoom tool

export interface BrushSettings {
  size: number;        // in pixels, e.g. 5 to 200
  hardness: number;    // 0 (soft airbrush) to 100 (hard pencil)
  opacity: number;     // 0 to 100%
  color: string;       // hex or rgba
}

export interface CropRect {
  x: number;
  y: number;
  width: number;
  height: number;
  aspectRatio?: number | 'free' | '1:1' | '4:3' | '16:9' | '3:4' | 'custom';
}

export interface HistoryItem {
  id: string;
  description: string;
  timestamp: number;
  layers: string; // JSON snapshot
  adjustments: string; // JSON snapshot
  width: number;
  height: number;
}
