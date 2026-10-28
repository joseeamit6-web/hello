export type BlendMode = 
  | 'source-over' 
  | 'multiply' 
  | 'screen' 
  | 'overlay' 
  | 'darken' 
  | 'lighten' 
  | 'color-dodge' 
  | 'color-burn' 
  | 'hard-light' 
  | 'soft-light' 
  | 'difference' 
  | 'exclusion' 
  | 'luminosity';

export type LayerType = 'image' | 'text' | 'shape';

export interface ImageLayerData {
  src: string; // Base64 Data URL or Blob URL
  naturalWidth: number;
  naturalHeight: number;
  maskSrc?: string; // Optional alpha mask
}

export interface TextLayerData {
  text: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  isBold: boolean;
  isItalic: boolean;
  textAlign: 'left' | 'center' | 'right';
  letterSpacing?: number;
  lineHeight?: number;
}

export interface ShapeLayerData {
  shapeType: 'rectangle' | 'circle' | 'line' | 'star';
  fillColor: string;
  strokeColor: string;
  strokeWidth: number;
  radius?: number; // for rounded rect or circle
}

export interface Layer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  opacity: number; // 0 to 1
  blendMode: BlendMode;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number; // in degrees
  flipH?: boolean;
  flipV?: boolean;
  imageData?: ImageLayerData;
  textData?: TextLayerData;
  shapeData?: ShapeLayerData;
}

export interface Adjustments {
  brightness: number; // -100 to 100, default 0
  contrast: number;   // -100 to 100, default 0
  exposure: number;   // -100 to 100, default 0
  highlights: number; // -100 to 100, default 0
  shadows: number;    // -100 to 100, default 0
  saturation: number; // -100 to 100, default 0
  temperature: number;// -100 to 100 (cool to warm), default 0
  tint: number;       // -100 to 100 (green to magenta), default 0
  hue: number;        // -180 to 180, default 0
  sharpen: number;    // 0 to 100, default 0
  blur: number;       // 0 to 50, default 0
  vignette: number;   // 0 to 100, default 0
  grayscale: boolean;
  invert: boolean;
}

export const DEFAULT_ADJUSTMENTS: Adjustments = {
  brightness: 0,
  contrast: 0,
  exposure: 0,
  highlights: 0,
  shadows: 0,
  saturation: 0,
  temperature: 0,
  tint: 0,
  hue: 0,
  sharpen: 0,
  blur: 0,
  vignette: 0,
  grayscale: false,
  invert: false,
};

export interface Project {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnail: string;
  width: number;
  height: number;
  layers: Layer[];
  selectedLayerId: string | null;
  adjustments: Adjustments;
  sourceOriginalUrl?: string; // original unedited image
}

export interface ProjectSummary {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  thumbnail: string;
  width: number;
  height: number;
  layerCount: number;
}
