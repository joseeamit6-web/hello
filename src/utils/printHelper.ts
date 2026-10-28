import { PrintStudioConfig } from '../types/print';
import { calculatePrintGrid } from './pdfGenerator';

/**
 * Prepares the DOM for browser printing by injecting the rendered print canvas/sheet
 * into the isolated #print-sheet-root, injecting the dynamic @page size style,
 * verifying all images are loaded, and invoking window.print().
 *
 * This completely isolates print content from the React app DOM, preventing
 * extra blank pages caused by 100vh containers, sticky bars, or flex layouts.
 */
export async function triggerBrowserPrint(
  imageSource: HTMLCanvasElement | string,
  config: PrintStudioConfig
): Promise<void> {
  const printRoot = document.getElementById('print-sheet-root');
  if (!printRoot) {
    throw new Error('Print root element #print-sheet-root not found in document.');
  }

  // 1. Calculate dimensions
  const grid = calculatePrintGrid(config);

  // 2. Prepare high-res image data
  let dataUrl: string;
  if (typeof imageSource === 'string') {
    dataUrl = imageSource;
  } else {
    dataUrl = imageSource.toDataURL('image/jpeg', 0.98);
  }

  // Pre-load image to verify dimensions before printing
  await new Promise<void>((resolve, reject) => {
    const testImg = new Image();
    testImg.onload = () => resolve();
    testImg.onerror = () => reject(new Error('Failed to load image for printing.'));
    testImg.src = dataUrl;
  });

  // 3. Inject dynamic @page style matching the selected paper and orientation
  const styleId = 'dynamic-print-page-style';
  let existingStyle = document.getElementById(styleId);
  if (!existingStyle) {
    existingStyle = document.createElement('style');
    existingStyle.id = styleId;
    document.head.appendChild(existingStyle);
  }

  // Explicit @page size definition in mm
  existingStyle.textContent = `
    @page {
      size: ${grid.paperWidthMm}mm ${grid.paperHeightMm}mm;
      margin: 0mm !important;
    }
  `;

  // 4. Construct print DOM sheets
  printRoot.innerHTML = '';
  let remaining = grid.totalCopies;

  for (let s = 0; s < grid.totalSheetsNeeded; s++) {
    const pageDiv = document.createElement('div');
    pageDiv.className = 'print-page';
    pageDiv.style.cssText = `
      position: relative;
      width: ${grid.paperWidthMm}mm;
      height: ${grid.paperHeightMm}mm;
      max-height: ${grid.paperHeightMm}mm;
      overflow: hidden;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      background: #ffffff;
      color: #000000;
    `;

    for (let r = 0; r < grid.rows; r++) {
      for (let c = 0; c < grid.cols; c++) {
        if (remaining <= 0) break;

        const leftMm = config.marginLeftMm + c * (grid.photoWidthMm + config.spacingMm);
        const topMm = config.marginTopMm + r * (grid.photoHeightMm + config.spacingMm);

        const container = document.createElement('div');
        container.style.cssText = `
          position: absolute;
          left: ${leftMm}mm;
          top: ${topMm}mm;
          width: ${grid.photoWidthMm}mm;
          height: ${grid.photoHeightMm}mm;
          overflow: hidden;
          box-sizing: border-box;
          ${config.showCuttingGuides ? `outline: 0.2mm dashed ${config.cuttingGuideColor || '#94a3b8'};` : ''}
        `;

        const img = document.createElement('img');
        img.src = dataUrl;
        img.style.cssText = `
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        `;

        container.appendChild(img);
        pageDiv.appendChild(container);
        remaining--;
      }
      if (remaining <= 0) break;
    }

    printRoot.appendChild(pageDiv);
  }

  // 5. Trigger print after layout settles
  return new Promise((resolve) => {
    // Small timeout to allow browser layout engine to paint
    setTimeout(() => {
      window.print();
      // Clean up after print dialog finishes
      setTimeout(() => {
        printRoot.innerHTML = '';
        resolve();
      }, 500);
    }, 150);
  });
}
