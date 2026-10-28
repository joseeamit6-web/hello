/**
 * Generates instant crisp SVG Data URLs of realistic sample portraits and photos
 * for testing editing tools, background remover, head straightener, and passport maker.
 */

function createPortraitSvg(
  bg: string,
  hairColor: string,
  skinColor: string,
  clothingColor: string,
  tiltAngle: number = 0
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800">
    <defs>
      <radialGradient id="bgGrad" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stop-color="${bg}" stop-opacity="1"/>
        <stop offset="100%" stop-color="#94a3b8" stop-opacity="1"/>
      </radialGradient>
      <linearGradient id="hairGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${hairColor}"/>
        <stop offset="100%" stop-color="#1e1b18"/>
      </linearGradient>
    </defs>
    <!-- Background -->
    <rect width="600" height="800" fill="url(#bgGrad)"/>
    
    <!-- Torso and Clothing -->
    <path d="M150 800 C150 630 200 580 300 580 C400 580 450 630 450 800 Z" fill="${clothingColor}"/>
    <!-- Shirt Collar -->
    <polygon points="260,580 300,640 280,580" fill="#f8fafc"/>
    <polygon points="340,580 300,640 320,580" fill="#f8fafc"/>
    <polygon points="280,580 300,660 320,580" fill="#cbd5e1"/>
    <!-- Tie or Button line -->
    <line x1="300" y1="660" x2="300" y2="800" stroke="#0f172a" stroke-width="4"/>

    <!-- Head and Neck with optional tilt -->
    <g transform="rotate(${tiltAngle}, 300, 360)">
      <!-- Neck -->
      <rect x="260" y="460" width="80" height="130" rx="20" fill="${skinColor}"/>
      <path d="M260 520 Q300 550 340 520 Z" fill="#000000" fill-opacity="0.08"/>

      <!-- Ears -->
      <ellipse cx="205" cy="380" rx="16" ry="26" fill="${skinColor}"/>
      <ellipse cx="395" cy="380" rx="16" ry="26" fill="${skinColor}"/>

      <!-- Face -->
      <ellipse cx="300" cy="370" rx="95" ry="125" fill="${skinColor}"/>

      <!-- Hair Back -->
      <path d="M195 380 C190 230 410 230 405 380 C380 200 220 200 195 380 Z" fill="url(#hairGrad)"/>
      <!-- Hair Top -->
      <path d="M190 340 Q300 190 410 340 Q350 240 300 250 Q240 240 190 340 Z" fill="url(#hairGrad)"/>

      <!-- Eyebrows -->
      <path d="M235 325 Q255 315 275 325" stroke="${hairColor}" stroke-width="4.5" stroke-linecap="round" fill="none"/>
      <path d="M325 325 Q345 315 365 325" stroke="${hairColor}" stroke-width="4.5" stroke-linecap="round" fill="none"/>

      <!-- Eyes -->
      <ellipse cx="255" cy="345" rx="14" ry="9" fill="#ffffff"/>
      <circle cx="255" cy="345" r="6" fill="#292524"/>
      <circle cx="253" cy="343" r="2" fill="#ffffff"/>

      <ellipse cx="345" cy="345" rx="14" ry="9" fill="#ffffff"/>
      <circle cx="345" cy="345" r="6" fill="#292524"/>
      <circle cx="343" cy="343" r="2" fill="#ffffff"/>

      <!-- Nose -->
      <path d="M295 345 L292 395 Q300 405 308 395" stroke="#000000" stroke-opacity="0.15" stroke-width="3" fill="none" stroke-linecap="round"/>

      <!-- Lips -->
      <path d="M275 425 Q300 435 325 425 Q300 445 275 425 Z" fill="#b91c1c" fill-opacity="0.6"/>
    </g>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

export interface SampleImage {
  id: string;
  name: string;
  category: 'portrait' | 'tilted' | 'formal' | 'landscape';
  description: string;
  dataUrl: string;
  width: number;
  height: number;
}

export const SAMPLE_IMAGES: SampleImage[] = [
  {
    id: 'sample-portrait-1',
    name: 'Classic Studio Portrait',
    category: 'portrait',
    description: 'Clean balanced lighting on neutral studio backdrop, ideal for passport and retouching tests.',
    dataUrl: createPortraitSvg('#e2e8f0', '#3b2f2f', '#f7d2b4', '#1e293b', 0),
    width: 600,
    height: 800,
  },
  {
    id: 'sample-tilted-head',
    name: 'Tilted Head Portrait (5° Tilt)',
    category: 'tilted',
    description: 'Portrait with 5-degree natural head tilt, ideal for testing the Head Straightener tool.',
    dataUrl: createPortraitSvg('#f1f5f9', '#262626', '#e0b89b', '#334155', 5.5),
    width: 600,
    height: 800,
  },
  {
    id: 'sample-formal-portrait',
    name: 'Executive Portrait',
    category: 'formal',
    description: 'Formal portrait with suit and tie, suitable for Outfit Studio and background replacement.',
    dataUrl: createPortraitSvg('#cbd5e1', '#1f2937', '#eec9a7', '#0f172a', 0),
    width: 600,
    height: 800,
  },
  {
    id: 'sample-passport-candidate',
    name: 'Nepal / Schengen Biometric Candidate',
    category: 'portrait',
    description: 'Frontal portrait with neutral lighting, ideal for 35x45mm and 2x2" crop framing checks.',
    dataUrl: createPortraitSvg('#ffffff', '#451a03', '#fed7aa', '#1e3a8a', 0),
    width: 600,
    height: 800,
  },
];
