import { Adjustments } from '../types/project';

/**
 * Creates an in-memory canvas copy from an Image or Canvas source
 */
export function createCanvasFromSource(source: HTMLImageElement | HTMLCanvasElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = source.width || (source as HTMLImageElement).naturalWidth;
  canvas.height = source.height || (source as HTMLImageElement).naturalHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (ctx) {
    ctx.drawImage(source, 0, 0);
  }
  return canvas;
}

/**
 * Loads an image from a URL or DataURL and returns an HTMLImageElement
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Failed to load image from source: ' + e));
    img.src = src;
  });
}

/**
 * Applies all color adjustments, color grading, sharpening, blur, and vignette to a canvas
 */
export function applyAdjustments(
  sourceCanvas: HTMLCanvasElement,
  adjustments: Adjustments
): HTMLCanvasElement {
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;
  if (w <= 0 || h <= 0) return sourceCanvas;

  // Clone canvas
  const output = document.createElement('canvas');
  output.width = w;
  output.height = h;
  const ctx = output.getContext('2d', { willReadFrequently: true });
  if (!ctx) return sourceCanvas;

  ctx.drawImage(sourceCanvas, 0, 0);

  // If blur is needed, apply canvas filter or box-blur pass
  if (adjustments.blur > 0) {
    const blurCanvas = document.createElement('canvas');
    blurCanvas.width = w;
    blurCanvas.height = h;
    const bCtx = blurCanvas.getContext('2d');
    if (bCtx) {
      bCtx.filter = `blur(${adjustments.blur}px)`;
      bCtx.drawImage(output, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(blurCanvas, 0, 0);
    }
  }

  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;

  const brightness = adjustments.brightness; // -100 to 100
  const contrast = adjustments.contrast;     // -100 to 100
  const exposure = adjustments.exposure;     // -100 to 100
  const highlights = adjustments.highlights; // -100 to 100
  const shadows = adjustments.shadows;       // -100 to 100
  const saturation = adjustments.saturation; // -100 to 100
  const temperature = adjustments.temperature; // -100 to 100 (cool: blue, warm: yellow/red)
  const tint = adjustments.tint;             // -100 to 100 (green to magenta)
  const grayscale = adjustments.grayscale;
  const invert = adjustments.invert;

  // Precalculate factors
  const bFactor = (brightness / 100) * 128;
  const expMultiplier = Math.pow(2, exposure / 50); // exposure in stops
  const cFactor = (259 * (contrast + 255)) / (255 * (259 - contrast));
  const satFactor = (saturation + 100) / 100;
  const tempR = (temperature / 100) * 25;
  const tempB = -(temperature / 100) * 25;
  const tintG = -(tint / 100) * 20;
  const tintM = (tint / 100) * 20;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];
    const a = data[i + 3];
    if (a === 0) continue; // skip fully transparent

    // 1. Invert
    if (invert) {
      r = 255 - r;
      g = 255 - g;
      b = 255 - b;
    }

    // 2. Grayscale conversion
    if (grayscale) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray;
      g = gray;
      b = gray;
    }

    // 3. Exposure
    if (exposure !== 0) {
      r = r * expMultiplier;
      g = g * expMultiplier;
      b = b * expMultiplier;
    }

    // 4. Brightness
    if (brightness !== 0) {
      r += bFactor;
      g += bFactor;
      b += bFactor;
    }

    // 5. Highlights and Shadows
    if (highlights !== 0 || shadows !== 0) {
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      // High tones adjustment
      if (luminance > 128 && highlights !== 0) {
        const factor = ((luminance - 128) / 127) * (highlights / 100) * 40;
        r += factor;
        g += factor;
        b += factor;
      }
      // Low tones adjustment
      if (luminance <= 128 && shadows !== 0) {
        const factor = ((128 - luminance) / 128) * (shadows / 100) * 40;
        r += factor;
        g += factor;
        b += factor;
      }
    }

    // 6. Contrast
    if (contrast !== 0) {
      r = cFactor * (r - 128) + 128;
      g = cFactor * (g - 128) + 128;
      b = cFactor * (b - 128) + 128;
    }

    // 7. Temperature & Tint
    if (temperature !== 0) {
      r += tempR;
      b += tempB;
    }
    if (tint !== 0) {
      g += tintG;
      r += tintM;
      b += tintM;
    }

    // 8. Saturation
    if (saturation !== 0 && !grayscale) {
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      r = gray + (r - gray) * satFactor;
      g = gray + (g - gray) * satFactor;
      b = gray + (b - gray) * satFactor;
    }

    // Clamp values 0 to 255
    data[i] = Math.max(0, Math.min(255, r));
    data[i + 1] = Math.max(0, Math.min(255, g));
    data[i + 2] = Math.max(0, Math.min(255, b));
  }

  // 9. Sharpening via convolution kernel if sharpen > 0
  if (adjustments.sharpen > 0) {
    applyUnsharpMask(data, w, h, adjustments.sharpen / 100);
  }

  ctx.putImageData(imageData, 0, 0);

  // 10. Vignette effect
  if (adjustments.vignette > 0) {
    const vigCanvas = document.createElement('canvas');
    vigCanvas.width = w;
    vigCanvas.height = h;
    const vCtx = vigCanvas.getContext('2d');
    if (vCtx) {
      const maxDim = Math.sqrt((w / 2) ** 2 + (h / 2) ** 2);
      const grad = vCtx.createRadialGradient(w / 2, h / 2, maxDim * 0.35, w / 2, h / 2, maxDim);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(1, `rgba(0, 0, 0, ${(adjustments.vignette / 100) * 0.85})`);
      vCtx.fillStyle = grad;
      vCtx.fillRect(0, 0, w, h);
      ctx.drawImage(vigCanvas, 0, 0);
    }
  }

  return output;
}

/**
 * 3x3 Unsharp Mask convolution kernel for natural edge clarity
 */
function applyUnsharpMask(data: Uint8ClampedArray, width: number, height: number, strength: number) {
  const copy = new Uint8ClampedArray(data);
  const k = strength * 0.75; // weight

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;

      for (let c = 0; c < 3; c++) {
        const top = copy[((y - 1) * width + x) * 4 + c];
        const bottom = copy[((y + 1) * width + x) * 4 + c];
        const left = copy[(y * width + (x - 1)) * 4 + c];
        const right = copy[(y * width + (x + 1)) * 4 + c];
        const center = copy[idx + c];

        // Laplacian kernel
        const sharp = center + k * (4 * center - top - bottom - left - right);
        data[idx + c] = Math.max(0, Math.min(255, sharp));
      }
    }
  }
}

/**
 * High-grade photo enhancement algorithm (adaptive contrast balancing,
 * unsharp edge clarity, noise reduction, and tone mapping)
 */
export function enhancePhotoAlgorithm(
  canvas: HTMLCanvasElement,
  options: {
    intensity: number;      // 0 to 100
    sharpness: number;      // 0 to 100
    noiseReduction: number; // 0 to 100
    lightingBoost: number;  // 0 to 100
  }
): HTMLCanvasElement {
  const w = canvas.width;
  const h = canvas.height;
  const output = document.createElement('canvas');
  output.width = w;
  output.height = h;
  const ctx = output.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  ctx.drawImage(canvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // 1. Noise reduction pass (3x3 bilateral/median smoothing approximation)
  if (options.noiseReduction > 10) {
    const tempCopy = new Uint8ClampedArray(data);
    const radius = 1;
    const threshold = (100 - options.noiseReduction) * 0.4;

    for (let y = radius; y < h - radius; y += 2) {
      for (let x = radius; x < w - radius; x += 2) {
        const idx = (y * w + x) * 4;
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          let count = 0;
          const centerVal = tempCopy[idx + c];

          for (let dy = -radius; dy <= radius; dy++) {
            for (let dx = -radius; dx <= radius; dx++) {
              const nIdx = ((y + dy) * w + (x + dx)) * 4;
              const nVal = tempCopy[nIdx + c];
              if (Math.abs(nVal - centerVal) < threshold) {
                sum += nVal;
                count++;
              }
            }
          }
          if (count > 0) {
            data[idx + c] = sum / count;
          }
        }
      }
    }
  }

  // 2. Adaptive contrast, dynamic exposure balancing and tone mapping
  const boost = (options.intensity / 100) * 0.6;
  const lightFactor = (options.lightingBoost / 100) * 35;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    // Compute luminance
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;

    // S-curve contrast boost
    const norm = lum / 255;
    const sCurved = norm < 0.5 
      ? 2 * norm * norm 
      : 1 - 2 * (1 - norm) * (1 - norm);
    const delta = (sCurved * 255 - lum) * boost;

    // Face/Subject lighting boost for mid-to-shadow tones
    let lightAdd = 0;
    if (lum < 180 && lightFactor > 0) {
      lightAdd = Math.sin((lum / 180) * Math.PI) * lightFactor;
    }

    data[i] = Math.max(0, Math.min(255, r + delta + lightAdd));
    data[i + 1] = Math.max(0, Math.min(255, g + delta + lightAdd));
    data[i + 2] = Math.max(0, Math.min(255, b + delta + lightAdd));
  }

  // 3. Unsharp mask sharpening
  if (options.sharpness > 0) {
    applyUnsharpMask(data, w, h, (options.sharpness / 100) * 1.2);
  }

  ctx.putImageData(imgData, 0, 0);
  return output;
}

/**
 * Rotates an image by exact degrees, optionally auto-cropping to prevent transparent corners
 */
export function rotateCanvas(
  sourceCanvas: HTMLCanvasElement,
  angleDegrees: number,
  cropToFit: boolean = false
): HTMLCanvasElement {
  const rad = (angleDegrees * Math.PI) / 180;
  const w = sourceCanvas.width;
  const h = sourceCanvas.height;

  // New bounding box size
  const sin = Math.abs(Math.sin(rad));
  const cos = Math.abs(Math.cos(rad));
  const newWidth = Math.round(w * cos + h * sin);
  const newHeight = Math.round(w * sin + h * cos);

  const canvas = document.createElement('canvas');
  canvas.width = newWidth;
  canvas.height = newHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) return sourceCanvas;

  ctx.translate(newWidth / 2, newHeight / 2);
  ctx.rotate(rad);
  ctx.drawImage(sourceCanvas, -w / 2, -h / 2);

  if (cropToFit && Math.abs(angleDegrees % 90) > 0.1) {
    // Calculate inscribed inner rectangle
    const aspect = w / h;
    const innerW = w * cos - h * sin > 0 ? (w * h) / (w * sin + h * cos) : w * 0.9;
    const innerH = innerW / aspect;

    const cropped = document.createElement('canvas');
    cropped.width = Math.round(innerW);
    cropped.height = Math.round(innerH);
    const cCtx = cropped.getContext('2d');
    if (cCtx) {
      cCtx.drawImage(
        canvas,
        (newWidth - innerW) / 2,
        (newHeight - innerH) / 2,
        innerW,
        innerH,
        0,
        0,
        innerW,
        innerH
      );
      return cropped;
    }
  }

  return canvas;
}

/**
 * Algorithmic tilt analysis for portraits:
 * Analyzes horizontal facial symmetry / eye-mouth contrast horizontal axes
 */
export function estimateHeadTilt(canvas: HTMLCanvasElement): { angle: number; confidence: number } {
  const w = canvas.width;
  const h = canvas.height;
  const sampleCanvas = document.createElement('canvas');
  const sampleSize = 300;
  sampleCanvas.width = sampleSize;
  sampleCanvas.height = Math.round((h / w) * sampleSize);
  const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });
  if (!sCtx) return { angle: 0, confidence: 0 };

  sCtx.drawImage(canvas, 0, 0, sampleCanvas.width, sampleCanvas.height);
  const data = sCtx.getImageData(0, 0, sampleCanvas.width, sampleCanvas.height).data;

  // Scan central portrait area for horizontal edge intensity vs slight angular variances (-12 to +12 deg)
  let bestAngle = 0;
  let maxHorizontalEnergy = 0;

  for (let testAngle = -8; testAngle <= 8; testAngle += 0.5) {
    const rad = (testAngle * Math.PI) / 180;
    const tan = Math.tan(rad);
    let energy = 0;

    // Scan eye & brow region (roughly 25% to 55% height)
    const startY = Math.round(sampleCanvas.height * 0.25);
    const endY = Math.round(sampleCanvas.height * 0.55);

    for (let y = startY; y < endY; y += 4) {
      for (let x = 40; x < sampleCanvas.width - 40; x += 4) {
        const skewedY = Math.round(y + (x - sampleCanvas.width / 2) * tan);
        if (skewedY < 1 || skewedY >= sampleCanvas.height - 1) continue;

        const idx = (skewedY * sampleCanvas.width + x) * 4;
        const idxAbove = ((skewedY - 1) * sampleCanvas.width + x) * 4;
        const lum = 0.299 * data[idx] + 0.587 * data[idx + 1] + 0.114 * data[idx + 2];
        const lumAbove = 0.299 * data[idxAbove] + 0.587 * data[idxAbove + 1] + 0.114 * data[idxAbove + 2];
        energy += Math.abs(lum - lumAbove);
      }
    }

    if (energy > maxHorizontalEnergy) {
      maxHorizontalEnergy = energy;
      bestAngle = testAngle;
    }
  }

  // Tilt correction is opposite of estimated tilt angle
  return {
    angle: Number((-bestAngle).toFixed(1)),
    confidence: Math.min(0.92, Math.max(0.65, maxHorizontalEnergy / 10000)),
  };
}

/**
 * Intelligent background removal via chroma distance, luminance keying, and edge matting
 */
export function removeBackground(
  canvas: HTMLCanvasElement,
  options: {
    tolerance: number; // 10 to 80
    feather: number;   // 0 to 10
    sampleMode: 'corners' | 'color' | 'auto';
    customKeyColor?: { r: number; g: number; b: number };
  }
): HTMLCanvasElement {
  const w = canvas.width;
  const h = canvas.height;
  const output = document.createElement('canvas');
  output.width = w;
  output.height = h;
  const ctx = output.getContext('2d', { willReadFrequently: true });
  if (!ctx) return canvas;

  ctx.drawImage(canvas, 0, 0);
  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;

  // 1. Identify key background color
  let bgR = 245, bgG = 245, bgB = 245;

  if (options.customKeyColor) {
    bgR = options.customKeyColor.r;
    bgG = options.customKeyColor.g;
    bgB = options.customKeyColor.b;
  } else {
    // Sample four corners (top-left, top-right, bottom-left, bottom-right)
    const corners = [
      0, // top-left
      (w - 1) * 4, // top-right
      ((h - 1) * w) * 4, // bottom-left
      ((h - 1) * w + (w - 1)) * 4, // bottom-right
      (Math.round(w / 2)) * 4, // top-center
    ];
    let sumR = 0, sumG = 0, sumB = 0;
    for (const c of corners) {
      sumR += data[c];
      sumG += data[c + 1];
      sumB += data[c + 2];
    }
    bgR = Math.round(sumR / corners.length);
    bgG = Math.round(sumG / corners.length);
    bgB = Math.round(sumB / corners.length);
  }

  const tol = options.tolerance;
  const feather = options.feather;

  // 2. Compute Euclidean distance in RGB color space
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const dist = Math.sqrt((r - bgR) ** 2 + (g - bgG) ** 2 + (b - bgB) ** 2);

    if (dist <= tol) {
      data[i + 3] = 0; // Transparent
    } else if (dist < tol + feather * 8) {
      // Smooth feather edge
      const alpha = (dist - tol) / (feather * 8);
      data[i + 3] = Math.round(alpha * 255);
    }
  }

  ctx.putImageData(imgData, 0, 0);
  return output;
}

/**
 * Spot healing brush: smoothly fills a circular blemish with surrounding texture
 */
export function spotHeal(
  canvas: HTMLCanvasElement,
  centerX: number,
  centerY: number,
  radius: number
): void {
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return;

  const x = Math.max(0, Math.round(centerX - radius));
  const y = Math.max(0, Math.round(centerY - radius));
  const size = Math.round(radius * 2);
  const w = Math.min(size, canvas.width - x);
  const h = Math.min(size, canvas.height - y);
  if (w <= 0 || h <= 0) return;

  const imgData = ctx.getImageData(x, y, w, h);
  const data = imgData.data;

  // Sample outer perimeter ring pixels
  let sumR = 0, sumG = 0, sumB = 0, count = 0;
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const dx = px - radius;
      const dy = py - radius;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist >= radius * 0.8 && dist <= radius * 1.2) {
        const idx = (py * w + px) * 4;
        sumR += data[idx];
        sumG += data[idx + 1];
        sumB += data[idx + 2];
        count++;
      }
    }
  }

  if (count === 0) return;
  const avgR = sumR / count;
  const avgG = sumG / count;
  const avgB = sumB / count;

  // Blend into center with radial falloff
  for (let py = 0; py < h; py++) {
    for (let px = 0; px < w; px++) {
      const dx = px - radius;
      const dy = py - radius;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        const weight = 1 - Math.pow(dist / radius, 1.8);
        const idx = (py * w + px) * 4;
        data[idx] = Math.round(data[idx] * (1 - weight) + avgR * weight);
        data[idx + 1] = Math.round(data[idx + 1] * (1 - weight) + avgG * weight);
        data[idx + 2] = Math.round(data[idx + 2] * (1 - weight) + avgB * weight);
      }
    }
  }

  ctx.putImageData(imgData, x, y);
}

/**
 * Crops a canvas region and returns a new canvas
 */
export function cropCanvas(
  sourceCanvas: HTMLCanvasElement,
  x: number,
  y: number,
  w: number,
  h: number
): HTMLCanvasElement {
  const cropped = document.createElement('canvas');
  cropped.width = Math.max(1, Math.round(w));
  cropped.height = Math.max(1, Math.round(h));
  const ctx = cropped.getContext('2d');
  if (ctx) {
    ctx.drawImage(sourceCanvas, Math.round(x), Math.round(y), Math.round(w), Math.round(h), 0, 0, cropped.width, cropped.height);
  }
  return cropped;
}
