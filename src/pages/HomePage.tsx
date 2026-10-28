import React, { useRef, useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { getAllProjects } from '../utils/storage';
import { ProjectSummary } from '../types/project';
import { PASSPORT_PRESETS, PassportPreset } from '../types/print';
import { AdSlot } from '../components/common/AdSlot';
import { ExperienceModal } from '../components/common/ExperienceModal';
import { loadImage } from '../utils/imageProcessing';
import { 
  Sparkles, 
  Layers, 
  CreditCard, 
  Printer, 
  Upload, 
  Camera, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  ChevronDown,
  Shirt,
  RotateCw,
  Scissors,
  Check,
  FileCheck2,
  SlidersHorizontal,
  Eye,
  Award
} from 'lucide-react';

interface HomePageProps {
  navigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const { createNewProject, loadProject } = useProject();
  const [recentProjects, setRecentProjects] = useState<ProjectSummary[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [faqOpenIndex, setFaqOpenIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Selected Country / Preset for Instant Wizard
  const [selectedPresetId, setSelectedPresetId] = useState<string>('nepal-mrp');
  const [selectedBgColor, setSelectedBgColor] = useState<string>('#ffffff');
  const [autoStraighten, setAutoStraighten] = useState<boolean>(true);
  const [autoSuit, setAutoSuit] = useState<boolean>(false);

  // Experience Choice Modal State
  const [choiceModalOpen, setChoiceModalOpen] = useState<boolean>(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string>('');
  const [pendingImageName, setPendingImageName] = useState<string>('');
  const [pendingDimensions, setPendingDimensions] = useState<{ width: number; height: number } | undefined>(undefined);

  useEffect(() => {
    updatePageSeo({
      title: 'AI Passport Photo Studio – Instant Biometric ID & Visa Photo Maker',
      description: 'Make official biometric Nepal passport, US visa, Schengen 35x45mm, India, and UK passport photos online with 1-click AI straightening, white background, formal suits, and printable 4x6 sheets.',
      canonicalPath: '/',
    });

    getAllProjects().then((projs) => {
      setRecentProjects(projs.slice(0, 4));
    });
  }, []);

  const handleFile = (file: File, directToPassport = false) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const src = e.target?.result as string;
      if (src) {
        setPendingImageSrc(src);
        const cleanName = file.name.replace(/\.[^/.]+$/, '');
        setPendingImageName(cleanName);

        try {
          const img = await loadImage(src);
          setPendingDimensions({
            width: img.naturalWidth || img.width,
            height: img.naturalHeight || img.height,
          });
        } catch {
          // ignore
        }

        if (directToPassport) {
          await createNewProject(src, cleanName || 'Passport Photo');
          navigate('/passport-photo');
        } else {
          setChoiceModalOpen(true);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0], false);
    }
  };

  const handleSampleClick = async (sampleDataUrl: string, sampleName: string, directToPassport = false) => {
    setPendingImageSrc(sampleDataUrl);
    setPendingImageName(sampleName);
    try {
      const img = await loadImage(sampleDataUrl);
      setPendingDimensions({
        width: img.naturalWidth || img.width,
        height: img.naturalHeight || img.height,
      });
    } catch {
      // ignore
    }

    if (directToPassport) {
      await createNewProject(sampleDataUrl, sampleName || 'Passport Photo');
      navigate('/passport-photo');
    } else {
      setChoiceModalOpen(true);
    }
  };

  const handleSelectManual = async () => {
    setChoiceModalOpen(false);
    if (pendingImageSrc) {
      await createNewProject(pendingImageSrc, pendingImageName || 'Photo Project');
      navigate('/editor');
    }
  };

  const handleSelectAI = async (route: string) => {
    setChoiceModalOpen(false);
    if (pendingImageSrc) {
      await createNewProject(pendingImageSrc, pendingImageName || 'Photo Project');
      navigate(route);
    }
  };

  const quickPresets = [
    { id: 'nepal-mrp', flag: '🇳🇵', name: 'Nepal MRP & E-Passport', size: '35×45 mm', note: 'Standard light background' },
    { id: 'us-visa', flag: '🇺🇸', name: 'US Visa & Passport', size: '2×2 in (51×51 mm)', note: 'Pure white background' },
    { id: 'schengen', flag: '🇪🇺', name: 'Schengen Visa', size: '35×45 mm', note: 'ICAO 9303 compliant' },
    { id: 'india-passport', flag: '🇮🇳', name: 'India Passport', size: '35×45 mm', note: 'White background' },
    { id: 'uk-passport', flag: '🇬🇧', name: 'UK Passport', size: '35×45 mm', note: 'Light grey / off-white' },
  ];

  const faqs = [
    {
      q: 'Is this website mainly for passport and visa size photos?',
      a: 'Yes! AI Photo Studio is specifically optimized for instant passport, visa, and ID photos with 1-click biometric face alignment, official background color replacement, formal suit overlay, and printable 4×6" / A4 sheets.',
    },
    {
      q: 'Are my personal photos uploaded to any external server?',
      a: 'No. All image processing, facial alignment, background recoloring, and PDF sheet rendering run directly in your web browser using HTML5 Canvas and local IndexedDB. Your photos stay completely private on your device.',
    },
    {
      q: 'Will printing my photo sheet produce an extra blank page?',
      a: 'No. We designed a precision zero-margin print engine and high-resolution jsPDF export that guarantees exactly 1 page output with no accidental blank trailing sheets.',
    },
    {
      q: 'Does it support official Nepal MRP & E-Passport specifications?',
      a: 'Yes. Our Nepal preset adheres strictly to the Department of Passports (DoP) 35×45mm guidelines with 70–80% face coverage, light background, and 300 DPI high-definition resolution.',
    },
    {
      q: 'Can I also use a full Photoshop-style manual editor?',
      a: 'Yes. Alongside our automated AI tools, you have access to a full Photoshop-style manual editor with multi-layer support, blend modes, blemish healing brush, clone stamp, tone adjustments, text, and vector shapes.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Top Banner / Announcement */}
      <div className="bg-gradient-to-r from-cyan-950/60 via-blue-950/40 to-slate-900 border-b border-cyan-500/20 py-2 px-4 text-center text-xs text-cyan-300 flex items-center justify-center gap-2">
        <Zap className="h-3.5 w-3.5 text-cyan-400 fill-cyan-400 flex-shrink-0" />
        <span>
          <strong>Fast AI Passport Photo Maker:</strong> Upload any selfie or portrait to instantly get biometric compliance, white background &amp; 4×6" print sheet!
        </span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-20 border-b border-slate-800/80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[700px] h-[250px] sm:h-[400px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-violet-600/15 blur-[90px] sm:blur-[130px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-medium text-cyan-300 mb-5 backdrop-blur shadow-sm">
            <CreditCard className="h-3.5 w-3.5 text-cyan-400" />
            <span>AI Passport, Visa &amp; ID Photo Studio</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Make Official Passport Photos in Seconds. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              1-Click AI Straightening &amp; Print Sheet.
            </span>
          </h1>

          <p className="mt-3 sm:mt-4 max-w-2xl mx-auto text-xs sm:text-base text-slate-400 leading-relaxed px-2">
            No studio needed. Turn casual selfies into official biometric passport and visa photos with auto head leveling, uniform background, formal suit overlay, and ready-to-print 4×6" / A4 layouts.
          </p>

          {/* INTERACTIVE 1-CLICK PASSPORT WIZARD CARD */}
          <div className="mt-8 max-w-3xl mx-auto rounded-3xl border-2 border-slate-700/80 bg-slate-900/80 p-5 sm:p-8 backdrop-blur-xl shadow-2xl text-left relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5" />
                  Step 1: Choose Country Standard
                </span>
                <p className="text-xs text-slate-400 mt-0.5">Select your passport or visa requirements</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 self-start sm:self-auto flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Guaranteed 300 DPI
              </span>
            </div>

            {/* Country Presets Selector */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {quickPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => setSelectedPresetId(preset.id)}
                    className={`p-2.5 rounded-xl border text-left transition flex flex-col justify-between ${
                      isSelected
                        ? 'border-cyan-400 bg-cyan-500/15 shadow-md shadow-cyan-500/10'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-800/50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-lg">{preset.flag}</span>
                        {isSelected && <Check className="h-3.5 w-3.5 text-cyan-400" />}
                      </div>
                      <div className="text-xs font-semibold text-slate-200 truncate">{preset.name}</div>
                      <div className="text-[10px] font-mono text-cyan-300 mt-0.5">{preset.size}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Step 2: Upload or Snap Photo */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold flex items-center gap-1.5 mb-2">
                <Upload className="h-3.5 w-3.5" />
                Step 2: Upload or Snap Your Photo
              </span>

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`rounded-2xl border-2 border-dashed p-6 sm:p-8 transition text-center ${
                  isDragging
                    ? 'border-cyan-400 bg-cyan-500/10'
                    : 'border-slate-700 bg-slate-950/70 hover:border-slate-600'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], true)}
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                />
                <input
                  type="file"
                  ref={cameraInputRef}
                  capture="user"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0], true)}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400">
                    <CreditCard className="h-6 w-6" />
                  </div>

                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-slate-200">
                      Drag &amp; drop any portrait or selfie here
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      JPG, PNG, WebP up to 50MB. AI will automatically straighten and format it.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex flex-wrap items-center justify-center gap-2.5 mt-1 w-full sm:w-auto">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-400 hover:to-blue-500 transition"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Browse Photo
                    </button>
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-700 transition"
                    >
                      <Camera className="h-3.5 w-3.5 text-cyan-400" />
                      Take Selfie
                    </button>
                    <button
                      onClick={() => handleSampleClick(SAMPLE_IMAGES[3].dataUrl, 'Sample Passport Portrait', true)}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2.5 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
                    >
                      <Zap className="h-3.5 w-3.5 text-cyan-400" />
                      Test with Sample
                    </button>
                  </div>
                </div>
              </div>

              {/* Instant Samples */}
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="text-[11px] text-slate-500 font-mono">Quick test photos:</span>
                  {SAMPLE_IMAGES.map((sample) => (
                    <button
                      key={sample.id}
                      onClick={() => handleSampleClick(sample.dataUrl, sample.name, true)}
                      className="text-[11px] rounded-lg bg-slate-900 border border-slate-800 px-2 py-0.5 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition"
                    >
                      {sample.name}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-[11px] text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition"
                >
                  <SlidersHorizontal className="h-3 w-3" />
                  <span>Or choose Manual Mode</span>
                </button>
              </div>
            </div>

            {/* Quick AI Features Checklist */}
            <div className="mt-5 pt-4 border-t border-slate-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                <span>Auto Head Straightener</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                <span>White / Grey Background</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                <span>Biometric Face 70-80%</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                <span>4×6" Print Sheet (6-8 photos)</span>
              </div>
            </div>
          </div>

          {/* Recent projects resume bar */}
          {recentProjects.length > 0 && (
            <div className="mt-6 max-w-3xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-left">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-slate-300">Resume Recent Project</span>
                <button onClick={() => navigate('/projects')} className="text-[11px] text-cyan-400 hover:underline">
                  View All ({recentProjects.length})
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {recentProjects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={async () => {
                      await loadProject(proj.id);
                      navigate('/passport-photo');
                    }}
                    className="flex items-center gap-2 rounded-xl bg-slate-950 p-2 border border-slate-800/80 hover:border-cyan-500/50 text-left transition group"
                  >
                    {proj.thumbnail ? (
                      <img src={proj.thumbnail} alt="" className="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
                    ) : (
                      <div className="h-8 w-8 rounded-lg bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-500 text-[10px]">
                        ID
                      </div>
                    )}
                    <div className="truncate">
                      <div className="text-[11px] font-medium text-slate-200 group-hover:text-cyan-300 truncate">
                        {proj.name}
                      </div>
                      <div className="text-[9px] font-mono text-slate-500">{proj.width}×{proj.height}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Ad slot below hero */}
      <div className="mx-auto max-w-4xl px-4 my-2">
        <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_HOMEPAGE} label="Advertisement" />
      </div>

      {/* PASSPORT STANDARDS REFERENCE SECTION */}
      <section className="py-12 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400 mb-2 border border-cyan-500/20">
            <Award className="h-3.5 w-3.5" />
            <span>Official Government Guidelines</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Supported Passport &amp; Visa Specifications
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Pre-configured with precise biometric margin ratios and high-resolution 300 DPI physical measurements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🇳🇵</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                35 × 45 mm
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Nepal MRP &amp; E-Passport</h3>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-400">
              <li>• Size: 35mm width × 45mm height</li>
              <li>• Face coverage: 70% – 80% (32mm–36mm)</li>
              <li>• Background: Plain white or off-white</li>
              <li>• Neutral expression, ears clearly visible</li>
            </ul>
            <button
              onClick={() => {
                setSelectedPresetId('nepal-mrp');
                handleSampleClick(SAMPLE_IMAGES[3].dataUrl, 'Nepal Passport', true);
              }}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span>Create Nepal Passport Photo</span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🇺🇸</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                2 × 2 in (51×51 mm)
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">US Visa &amp; US Passport</h3>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-400">
              <li>• Size: 2 × 2 inches (600×600 px minimum)</li>
              <li>• Head height: 1 inch to 1 3/8 inches (50-69%)</li>
              <li>• Background: Pure white background only</li>
              <li>• DS-160 &amp; CEAC portal verified dimensions</li>
            </ul>
            <button
              onClick={() => {
                setSelectedPresetId('us-visa');
                handleSampleClick(SAMPLE_IMAGES[3].dataUrl, 'US Visa', true);
              }}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span>Create US Visa Photo</span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">🇪🇺</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                35 × 45 mm
              </span>
            </div>
            <h3 className="text-sm font-bold text-white">Schengen &amp; European Visa</h3>
            <ul className="mt-2.5 space-y-1.5 text-xs text-slate-400">
              <li>• Size: 35mm width × 45mm height</li>
              <li>• ICAO Doc 9303 international standard</li>
              <li>• Background: Uniform light grey or cream</li>
              <li>• Germany, France, Italy, Spain accepted</li>
            </ul>
            <button
              onClick={() => {
                setSelectedPresetId('schengen');
                handleSampleClick(SAMPLE_IMAGES[3].dataUrl, 'Schengen Visa', true);
              }}
              className="mt-4 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-semibold transition flex items-center justify-center gap-1.5"
            >
              <span>Create Schengen Photo</span>
              <ArrowRight className="h-3.5 w-3.5 text-cyan-400" />
            </button>
          </div>
        </div>
      </section>

      {/* SPECIALIZED AI & MANUAL SUITES GRID */}
      <section className="py-12 border-t border-slate-800/80 bg-slate-950/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
              All Photo Studio Capabilities
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-400">
              Seamlessly jump between automatic AI tools or switch into full manual editing.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Card 1: Passport Maker (Featured) */}
            <div
              onClick={() => navigate('/passport-photo')}
              className="group rounded-2xl border-2 border-cyan-500/50 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-400 hover:bg-slate-900/80 transition cursor-pointer flex flex-col justify-between shadow-lg shadow-cyan-500/5"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition">
                    <CreditCard className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-mono uppercase bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20 font-bold">
                    Primary Tool
                  </span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  Passport &amp; Visa Maker
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Official proportions for Nepal, USA, Schengen, and India. Interactive 70-80% face overlays, crown/chin alignment, and 300 DPI export.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
                <span>Open Passport Studio</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 2: Print Studio (Zero Blank Page Engine) */}
            <div
              onClick={() => navigate('/print-studio')}
              className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-emerald-500/50 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition">
                  <Printer className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition">
                  4×6" &amp; A4 Print Sheet Studio
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Arrange 4, 6, 8, or 32 photos on photographic paper with cutting marks. Engineered with zero trailing blank page guarantee.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                <span>Create Print Sheet</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 3: Head Straightener */}
            <div
              onClick={() => navigate('/head-straightener')}
              className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-105 transition">
                  <RotateCw className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  Head Straightener &amp; Tilt Fix
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Correct tilted selfies into perfectly upright, consular-compliant portraits with eye-axis alignment and edge filling.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-rose-400">
                <span>Straighten Portrait</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 4: Formal Outfit Studio */}
            <div
              onClick={() => navigate('/outfit-studio')}
              className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition">
                  <Shirt className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  Formal Suit &amp; Outfit Studio
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Dress in black suits, navy blazers, formal shirts, or traditional attire over casual clothing for job applications and visa forms.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                <span>Apply Formal Suit</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 5: Background Cutout */}
            <div
              onClick={() => navigate('/background')}
              className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition">
                  <Scissors className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  Background Remover &amp; Replacer
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Isolate portraits from cluttered rooms. Replace backgrounds with studio solid colors, soft gradients, or transparent PNG.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                <span>Edit Background</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>

            {/* Card 6: Manual Photoshop-Style Editor */}
            <div
              onClick={() => navigate('/editor')}
              className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-105 transition">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                  Full Manual Layer Workspace
                </h3>
                <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                  Layer composition, blend modes, blemish healing, brush, clone stamp, text, crop, and 12+ manual color/exposure sliders.
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-violet-400">
                <span>Open Manual Studio</span>
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 border-t border-slate-800/80 bg-slate-950/60">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-1 text-xs text-slate-400">Clear information on compliance, privacy, and printing precision.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = faqOpenIndex === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden transition"
                >
                  <button
                    onClick={() => setFaqOpenIndex(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-400"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Choice Modal */}
      <ExperienceModal
        isOpen={choiceModalOpen}
        onClose={() => setChoiceModalOpen(false)}
        imageSrc={pendingImageSrc}
        imageName={pendingImageName}
        imageDimensions={pendingDimensions}
        onSelectManual={handleSelectManual}
        onSelectAI={handleSelectAI}
      />
    </div>
  );
};
