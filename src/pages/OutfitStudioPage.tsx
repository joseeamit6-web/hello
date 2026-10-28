import React, { useState, useEffect, useRef } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { loadImage } from '../utils/imageProcessing';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { AdSlot } from '../components/common/AdSlot';
import { 
  Shirt, 
  Check, 
  ArrowLeft, 
  Sparkles, 
  Download, 
  Sliders, 
  RefreshCw,
  Move,
  CreditCard
} from 'lucide-react';

interface OutfitTemplate {
  id: string;
  name: string;
  category: 'formal' | 'business' | 'traditional' | 'academic';
  description: string;
  suitColor: string;
  tieColor: string;
  shirtColor: string;
}

const OUTFIT_TEMPLATES: OutfitTemplate[] = [
  {
    id: 'formal-black-suit',
    name: 'Executive Black Suit',
    category: 'formal',
    description: 'Crisp black tailored two-piece suit with white collared shirt and silk black tie.',
    suitColor: '#0f172a',
    tieColor: '#1e293b',
    shirtColor: '#ffffff',
  },
  {
    id: 'formal-navy-suit',
    name: 'Royal Navy Business Suit',
    category: 'business',
    description: 'Modern corporate navy blazer with structured shoulders and burgundy tie.',
    suitColor: '#1e3a8a',
    tieColor: '#881337',
    shirtColor: '#f8fafc',
  },
  {
    id: 'charcoal-grey-suit',
    name: 'Charcoal Grey Executive',
    category: 'business',
    description: 'Deep charcoal tailored suit jacket with patterned blue tie.',
    suitColor: '#334155',
    tieColor: '#0369a1',
    shirtColor: '#ffffff',
  },
  {
    id: 'nepali-daura-suruwal',
    name: 'Nepali Daura Suruwal & Coat',
    category: 'traditional',
    description: 'Traditional Nepali formal coat with crossed Daura ties, ideal for official events and citizenship photos.',
    suitColor: '#18181b',
    tieColor: '#991b1b', // traditional red inner collar accent
    shirtColor: '#f4f4f5',
  },
  {
    id: 'white-formal-shirt',
    name: 'Clean White Collared Shirt',
    category: 'formal',
    description: 'Crisp pressed button-down white dress shirt with firm spread collar.',
    suitColor: '#ffffff',
    tieColor: '#0f172a',
    shirtColor: '#ffffff',
  },
  {
    id: 'academic-graduation-gown',
    name: 'Academic Graduation Gown',
    category: 'academic',
    description: 'Formal black academic gown with pleated shoulder yoke.',
    suitColor: '#090d16',
    tieColor: '#d97706',
    shirtColor: '#ffffff',
  },
];

interface OutfitStudioPageProps {
  navigate: (route: string) => void;
}

export const OutfitStudioPage: React.FC<OutfitStudioPageProps> = ({ navigate }) => {
  const { project, applyImageAsNewBase, createNewProject } = useProject();

  const [selectedOutfit, setSelectedOutfit] = useState<OutfitTemplate>(OUTFIT_TEMPLATES[0]);
  const [collarY, setCollarY] = useState<number>(65); // percentage down the image
  const [outfitScale, setOutfitScale] = useState<number>(100); // 80% to 130%
  const [shoulderWidth, setShoulderWidth] = useState<number>(100);

  const [originalSrc, setOriginalSrc] = useState<string>(() => project?.layers[0]?.imageData?.src || SAMPLE_IMAGES[2]?.dataUrl || '');
  const [compositeSrc, setCompositeSrc] = useState<string>('');
  const [isRendering, setIsRendering] = useState<boolean>(false);

  useEffect(() => {
    updatePageSeo({
      title: 'AI Outfit Studio – Create Formal Portraits | AI Photo Studio',
      description: 'Dress portraits in executive suits, corporate blazers, clean shirts, and Nepali Daura Suruwal with tailored collar fit and alignment.',
      canonicalPath: '/outfit-studio',
    });
  }, []);

  useEffect(() => {
    const src = project?.layers[0]?.imageData?.src || SAMPLE_IMAGES[2].dataUrl;
    setOriginalSrc(src);
  }, [project]);

  // Render composite portrait with tailored garment overlay
  useEffect(() => {
    if (!originalSrc) return;

    let isMounted = true;
    setIsRendering(true);

    loadImage(originalSrc).then((img) => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;

      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Draw original base portrait
      ctx.drawImage(img, 0, 0);

      // 2. Draw tailored vector garment overlay below chin line
      const garmentTopY = (collarY / 100) * h;
      const scaleMultiplier = outfitScale / 100;
      const shoulderMultiplier = shoulderWidth / 100;

      const garmentW = w * 0.9 * scaleMultiplier * shoulderMultiplier;
      const garmentH = h - garmentTopY;
      const startX = (w - garmentW) / 2;

      ctx.save();
      // Suit Coat Body
      ctx.fillStyle = selectedOutfit.suitColor;
      ctx.beginPath();
      ctx.moveTo(startX, h);
      ctx.bezierCurveTo(
        startX,
        garmentTopY + 80,
        startX + garmentW * 0.15,
        garmentTopY,
        w / 2,
        garmentTopY + 20
      );
      ctx.bezierCurveTo(
        startX + garmentW * 0.85,
        garmentTopY,
        startX + garmentW,
        garmentTopY + 80,
        startX + garmentW,
        h
      );
      ctx.closePath();
      ctx.fill();

      // Shirt Lapel V-Neck area
      ctx.fillStyle = selectedOutfit.shirtColor;
      ctx.beginPath();
      ctx.moveTo(w / 2 - 40 * scaleMultiplier, garmentTopY);
      ctx.lineTo(w / 2 + 40 * scaleMultiplier, garmentTopY);
      ctx.lineTo(w / 2, garmentTopY + 140 * scaleMultiplier);
      ctx.closePath();
      ctx.fill();

      // Necktie if not pure white shirt
      if (selectedOutfit.id !== 'white-formal-shirt') {
        ctx.fillStyle = selectedOutfit.tieColor;
        // Tie knot
        ctx.beginPath();
        ctx.moveTo(w / 2 - 16 * scaleMultiplier, garmentTopY + 15 * scaleMultiplier);
        ctx.lineTo(w / 2 + 16 * scaleMultiplier, garmentTopY + 15 * scaleMultiplier);
        ctx.lineTo(w / 2 + 10 * scaleMultiplier, garmentTopY + 45 * scaleMultiplier);
        ctx.lineTo(w / 2 - 10 * scaleMultiplier, garmentTopY + 45 * scaleMultiplier);
        ctx.closePath();
        ctx.fill();

        // Tie body
        ctx.beginPath();
        ctx.moveTo(w / 2 - 10 * scaleMultiplier, garmentTopY + 45 * scaleMultiplier);
        ctx.lineTo(w / 2 + 10 * scaleMultiplier, garmentTopY + 45 * scaleMultiplier);
        ctx.lineTo(w / 2 + 20 * scaleMultiplier, h);
        ctx.lineTo(w / 2 - 20 * scaleMultiplier, h);
        ctx.closePath();
        ctx.fill();
      }

      // Suit Lapel Collars Left & Right
      ctx.fillStyle = selectedOutfit.suitColor;
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ffffff20';

      // Left Lapel
      ctx.beginPath();
      ctx.moveTo(w / 2 - 45 * scaleMultiplier, garmentTopY);
      ctx.lineTo(w / 2 - 80 * scaleMultiplier, garmentTopY + 70 * scaleMultiplier);
      ctx.lineTo(w / 2 - 5 * scaleMultiplier, garmentTopY + 150 * scaleMultiplier);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Right Lapel
      ctx.beginPath();
      ctx.moveTo(w / 2 + 45 * scaleMultiplier, garmentTopY);
      ctx.lineTo(w / 2 + 80 * scaleMultiplier, garmentTopY + 70 * scaleMultiplier);
      ctx.lineTo(w / 2 + 5 * scaleMultiplier, garmentTopY + 150 * scaleMultiplier);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.restore();

      if (isMounted) {
        setCompositeSrc(canvas.toDataURL('image/jpeg', 0.95));
        setIsRendering(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [originalSrc, selectedOutfit, collarY, outfitScale, shoulderWidth]);

  const handleApply = () => {
    if (!compositeSrc) return;
    if (project) {
      applyImageAsNewBase(compositeSrc, `Apply Outfit: ${selectedOutfit.name}`);
      navigate('/editor');
    } else {
      createNewProject(compositeSrc, 'Formal Portrait').then(() => navigate('/editor'));
    }
  };

  const handleApplyToPassport = async () => {
    if (!compositeSrc) return;
    if (project) {
      await applyImageAsNewBase(compositeSrc, `Formal: ${selectedOutfit.name}`);
    } else {
      await createNewProject(compositeSrc, 'Passport Portrait');
    }
    navigate('/passport-photo');
  };

  return (
    <div className="flex-1 bg-[#090d16] text-slate-100 py-6 px-4 sm:px-6 flex flex-col">
      <div className="mx-auto max-w-6xl w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <button
              onClick={() => navigate('/passport-photo')}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Passport Studio</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <Shirt className="h-5 w-5 text-cyan-400" />
              AI Outfit &amp; Formal Attire Studio
            </h1>
            <p className="text-xs text-slate-400">
              Transform casual portraits into executive formal wear, business suits, or traditional Nepali citizenship attire.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApplyToPassport}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-teal-500 transition"
            >
              <CreditCard className="h-4 w-4" />
              <span>Create Passport Photo</span>
            </button>
            <button
              onClick={handleApply}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-3.5 py-2 text-xs font-medium text-slate-200 hover:text-white transition"
            >
              <Check className="h-4 w-4" />
              <span>Apply to Editor</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-start">
          {/* Left: Composite Live Preview */}
          <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-[#070b12] p-2 sm:p-4 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[500px] relative shadow-2xl overflow-hidden">
            {compositeSrc ? (
              <img
                src={compositeSrc}
                alt="Outfit Preview"
                className="max-h-[340px] sm:max-h-[500px] max-w-full object-contain rounded shadow-lg block"
              />
            ) : (
              <div className="text-xs text-slate-400 animate-pulse">Rendering formal portrait composite...</div>
            )}
            <div className="absolute bottom-3 left-4 rounded-md bg-slate-900/90 px-2.5 py-1 text-[11px] font-mono text-cyan-400 border border-slate-800 backdrop-blur">
              {selectedOutfit.name}
            </div>
          </div>

          {/* Right: Outfit Selector & Fine Alignment */}
          <div className="space-y-5 text-xs">
            {/* Outfits Grid */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-3">
              <div className="font-bold uppercase tracking-wider text-slate-300">Select Attire Template</div>
              <div className="space-y-2">
                {OUTFIT_TEMPLATES.map((outfit) => {
                  const isSelected = selectedOutfit.id === outfit.id;
                  return (
                    <button
                      key={outfit.id}
                      onClick={() => setSelectedOutfit(outfit)}
                      className={`w-full p-2.5 rounded-xl border text-left transition flex items-start gap-3 ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-500 text-cyan-300 shadow-sm'
                          : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div
                        className="h-7 w-7 rounded-lg border border-slate-700 flex-shrink-0 flex items-center justify-center"
                        style={{ backgroundColor: outfit.suitColor }}
                      >
                        <Shirt className="h-3.5 w-3.5 text-white/90" />
                      </div>
                      <div className="truncate">
                        <div className="font-semibold text-xs text-white truncate">{outfit.name}</div>
                        <div className="text-[10px] text-slate-400 truncate">{outfit.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Collar & Shoulder Alignment */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 shadow-xl space-y-3">
              <div className="font-bold uppercase tracking-wider text-slate-300">Collar &amp; Shoulder Fit</div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Collar Height Level</span>
                  <span className="font-mono text-cyan-400">{collarY}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="85"
                  value={collarY}
                  onChange={(e) => setCollarY(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-slate-300 font-medium mb-1">
                  <span>Shoulder Width</span>
                  <span className="font-mono text-cyan-400">{shoulderWidth}%</span>
                </div>
                <input
                  type="range"
                  min="70"
                  max="130"
                  value={shoulderWidth}
                  onChange={(e) => setShoulderWidth(Number(e.target.value))}
                  className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_TOOLS} />
          </div>
        </div>
      </div>
    </div>
  );
};
