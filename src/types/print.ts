export type PrintUnit = 'mm' | 'cm' | 'inch' | 'px';

export type PaperPreset = 'A4' | 'Letter' | '4x6' | '5x7' | 'Custom';

export interface PaperDimensions {
  name: string;
  widthMm: number;
  heightMm: number;
}

export const PAPER_SIZES: Record<PaperPreset, PaperDimensions> = {
  'A4': { name: 'A4 Standard (210 × 297 mm)', widthMm: 210, heightMm: 297 },
  'Letter': { name: 'US Letter (8.5 × 11 in)', widthMm: 215.9, heightMm: 279.4 },
  '4x6': { name: 'Photo 4 × 6 in (10 × 15 cm)', widthMm: 101.6, heightMm: 152.4 },
  '5x7': { name: 'Photo 5 × 7 in (13 × 18 cm)', widthMm: 127.0, heightMm: 177.8 },
  'Custom': { name: 'Custom Dimensions', widthMm: 210, heightMm: 297 },
};

export interface PassportPreset {
  id: string;
  country: string;
  name: string;
  widthMm: number;
  heightMm: number;
  dpi: number;
  headHeightMinRatio: number; // e.g. 0.70 (70% of frame height)
  headHeightMaxRatio: number; // e.g. 0.80 (80% of frame height)
  topMarginRatio: number;      // e.g. 0.08 (8% top margin)
  bgColorName: string;
  notes: string;
}

export const PASSPORT_PRESETS: PassportPreset[] = [
  {
    id: 'nepal-passport',
    country: 'Nepal',
    name: 'Nepal MRP & E-Passport (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    headHeightMinRatio: 0.70,
    headHeightMaxRatio: 0.80,
    topMarginRatio: 0.08,
    bgColorName: 'Plain White',
    notes: 'Official Nepal Department of Passports biometric requirement: plain white background, neutral expression, centered face.',
  },
  {
    id: 'nepal-driving-license',
    country: 'Nepal',
    name: 'Nepal Smart Driving License (30 × 35 mm)',
    widthMm: 30,
    heightMm: 35,
    dpi: 300,
    headHeightMinRatio: 0.65,
    headHeightMaxRatio: 0.78,
    topMarginRatio: 0.08,
    bgColorName: 'White / Light Grey',
    notes: 'Standard Nepal Transport Management format.',
  },
  {
    id: 'us-visa',
    country: 'United States',
    name: 'US Visa & Passport (2 × 2 in / 51 × 51 mm)',
    widthMm: 50.8,
    heightMm: 50.8,
    dpi: 300,
    headHeightMinRatio: 0.50,
    headHeightMaxRatio: 0.69,
    topMarginRatio: 0.12,
    bgColorName: 'Pure White',
    notes: 'US Department of State: square 2x2 inches (600x600px at 300dpi), head between 1 and 1 3/8 inches.',
  },
  {
    id: 'schengen-visa',
    country: 'Schengen / Europe',
    name: 'Schengen Visa & EU Passport (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    headHeightMinRatio: 0.70,
    headHeightMaxRatio: 0.80,
    topMarginRatio: 0.07,
    bgColorName: 'Light Grey or Plain White',
    notes: 'ICAO standard compliant: head height between 32mm and 36mm from chin to crown.',
  },
  {
    id: 'india-passport',
    country: 'India',
    name: 'India Passport & OCI (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    headHeightMinRatio: 0.68,
    headHeightMaxRatio: 0.78,
    topMarginRatio: 0.08,
    bgColorName: 'White',
    notes: 'Passport Seva Kendra compliant: color photo with plain white background.',
  },
  {
    id: 'india-visa',
    country: 'India',
    name: 'India Visa (2 × 2 in / 51 × 51 mm)',
    widthMm: 50.8,
    heightMm: 50.8,
    dpi: 300,
    headHeightMinRatio: 0.55,
    headHeightMaxRatio: 0.70,
    topMarginRatio: 0.10,
    bgColorName: 'White',
    notes: 'Standard India e-Visa square format.',
  },
  {
    id: 'uk-passport',
    country: 'United Kingdom',
    name: 'UK Passport (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    headHeightMinRatio: 0.65,
    headHeightMaxRatio: 0.76,
    topMarginRatio: 0.08,
    bgColorName: 'Plain Light Cream or Light Grey',
    notes: 'HM Passport Office standard: head height 29mm to 34mm.',
  },
  {
    id: 'canada-passport',
    country: 'Canada',
    name: 'Canada Passport (50 × 70 mm)',
    widthMm: 50,
    heightMm: 70,
    dpi: 300,
    headHeightMinRatio: 0.44,
    headHeightMaxRatio: 0.51,
    topMarginRatio: 0.09,
    bgColorName: 'Plain White or Light Coloured',
    notes: 'Face length between 31mm and 36mm from chin to crown of head.',
  },
  {
    id: 'australia-passport',
    country: 'Australia',
    name: 'Australia Passport (35 × 45 mm)',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    headHeightMinRatio: 0.71,
    headHeightMaxRatio: 0.80,
    topMarginRatio: 0.08,
    bgColorName: 'Uniform Light Grey or White',
    notes: 'Australian Passport Office: 32mm to 36mm from chin to top of head.',
  },
];

export interface PrintStudioConfig {
  paperPreset: PaperPreset;
  paperWidthMm: number;
  paperHeightMm: number;
  orientation: 'portrait' | 'landscape';
  photoWidth: number;
  photoHeight: number;
  unit: PrintUnit;
  dpi: number;
  lockAspectRatio: boolean;
  copies: number;
  autoFillGrid: boolean;
  marginTopMm: number;
  marginBottomMm: number;
  marginLeftMm: number;
  marginRightMm: number;
  spacingMm: number;
  showCuttingGuides: boolean;
  cuttingGuideColor: string;
}

export const DEFAULT_PRINT_CONFIG: PrintStudioConfig = {
  paperPreset: 'A4',
  paperWidthMm: 210,
  paperHeightMm: 297,
  orientation: 'portrait',
  photoWidth: 35,
  photoHeight: 45,
  unit: 'mm',
  dpi: 300,
  lockAspectRatio: true,
  copies: 8,
  autoFillGrid: false,
  marginTopMm: 10,
  marginBottomMm: 10,
  marginLeftMm: 10,
  marginRightMm: 10,
  spacingMm: 5,
  showCuttingGuides: true,
  cuttingGuideColor: '#94a3b8',
};
