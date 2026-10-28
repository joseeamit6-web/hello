import React, { useRef, useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { getAllProjects } from '../utils/storage';
import { ProjectSummary } from '../types/project';
import { AdSlot } from '../components/common/AdSlot';
import { ExperienceModal } from '../components/common/ExperienceModal';
import { loadImage } from '../utils/imageProcessing';
import { 
  Sparkles, 
  Layers, 
  UserCheck, 
  RotateCw, 
  Shirt, 
  Scissors, 
  CreditCard, 
  Printer, 
  Upload, 
  Camera, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  CheckCircle, 
  HelpCircle,
  FileCheck,
  ChevronDown
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

  // Experience Choice Modal State
  const [choiceModalOpen, setChoiceModalOpen] = useState<boolean>(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string>('');
  const [pendingImageName, setPendingImageName] = useState<string>('');
  const [pendingDimensions, setPendingDimensions] = useState<{ width: number; height: number } | undefined>(undefined);

  useEffect(() => {
    updatePageSeo({
      title: 'AI Photo Studio – Free Online Photo Editor & Passport Photo Maker',
      description: 'Enhance photos, retouch portraits, straighten tilted heads, edit backgrounds, create formal portraits, and prepare custom-size passport photos and print-ready sheets online.',
      canonicalPath: '/',
    });

    getAllProjects().then((projs) => {
      setRecentProjects(projs.slice(0, 4));
    });
  }, []);

  const handleFile = (file: File) => {
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

        setChoiceModalOpen(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = async (sampleDataUrl: string, sampleName: string) => {
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
    setChoiceModalOpen(true);
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

  const faqs = [
    {
      q: 'Are my private photos uploaded to a remote server?',
      a: 'No. AI Photo Studio runs directly in your browser using high-performance Canvas algorithms and local IndexedDB storage. Your photos never leave your device unless you explicitly invoke remote generative models.',
    },
    {
      q: 'Does printing create an extra blank page?',
      a: 'No. We engineered a dedicated print architecture with zero-margin @page styling and deterministic jsPDF generation to guarantee that a 1-page document produces exactly 1 page with no accidental trailing blank sheets.',
    },
    {
      q: 'Can I prepare official passport photos for Nepal and other countries?',
      a: 'Yes. We support Nepal MRP & E-Passport (35×45mm), US Visa (2×2 in / 51×51mm), Schengen Visa (35×45mm), India, UK, Canada, and custom dimensions with biometric 70-80% face framing guides.',
    },
    {
      q: 'Can I use the manual editor without paying or signing in?',
      a: 'Yes. The full Photoshop-style editor with layers, blend modes, blemish healing, tone adjustments, text, shapes, and export is 100% free and requires no account or subscription.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-14 sm:pt-20 sm:pb-24 border-b border-slate-800/80">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[600px] h-[250px] sm:h-[350px] bg-gradient-to-tr from-cyan-600/15 via-blue-600/10 to-violet-600/15 blur-[90px] sm:blur-[120px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-300 mb-6 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            <span>Complete Photo Studio &amp; High-Precision Print Engine</span>
          </div>

          {/* Headline */}
          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Professional Photo Studio. <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              Automatic AI &amp; Full Manual Control.
            </span>
          </h1>

          <p className="mt-4 sm:mt-5 max-w-2xl mx-auto text-xs sm:text-base text-slate-400 leading-relaxed px-2">
            Enhance clarity, retouch portraits, straighten tilted heads, remove backgrounds, fit official biometric passport dimensions, and generate print-ready sheets with zero blank pages.
          </p>

          {/* Upload Drop Zone Card */}
          <div className="mt-8 sm:mt-10 max-w-2xl mx-auto">
            <div
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`relative rounded-2xl sm:rounded-3xl border-2 border-dashed p-6 sm:p-10 transition-all backdrop-blur-xl ${
                isDragging
                  ? 'border-cyan-400 bg-cyan-500/10 scale-[1.01]'
                  : 'border-slate-700 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900/80'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                accept="image/png,image/jpeg,image/webp,image/avif"
                className="hidden"
              />

              <div className="flex flex-col items-center justify-center gap-3">
                <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 shadow-inner">
                  <Upload className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <div className="text-center">
                  <p className="text-xs sm:text-sm font-semibold text-slate-200">
                    Drag and drop your photo here, or
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                    Supports high-resolution PNG, JPG, WebP (up to 50MB)
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-3 mt-2 w-full sm:w-auto">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-5 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500 transition"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    Browse Photo
                  </button>
                  <button
                    onClick={() => handleSampleClick(SAMPLE_IMAGES[0].dataUrl, SAMPLE_IMAGES[0].name)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
                  >
                    Try Sample Photo
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Sample Selector */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-400">
              <span className="text-[10px] sm:text-[11px] font-mono uppercase text-slate-500">Test immediately:</span>
              {SAMPLE_IMAGES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => handleSampleClick(sample.dataUrl, sample.name)}
                  className="rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:border-cyan-500/50 hover:text-cyan-400 transition"
                >
                  {sample.name}
                </button>
              ))}
            </div>
          </div>

          {/* Recent projects resume bar */}
          {recentProjects.length > 0 && (
            <div className="mt-8 max-w-2xl mx-auto rounded-2xl border border-slate-800 bg-slate-900/80 p-3 text-left">
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
                      navigate('/editor');
                    }}
                    className="flex items-center gap-2 rounded-xl bg-slate-950 p-2 border border-slate-800/80 hover:border-cyan-500/50 text-left transition group"
                  >
                    <img src={proj.thumbnail} alt="" className="h-8 w-8 rounded-lg object-cover flex-shrink-0" />
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

      {/* Ad placement below hero */}
      <div className="mx-auto max-w-4xl px-4">
        <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_HOMEPAGE} label="Advertisement" />
      </div>

      {/* Tool Showcase Grid */}
      <section className="py-12 sm:py-16 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <h2 className="text-xl sm:text-3xl font-bold text-white tracking-tight">
            Specialized Photo Studio Suites
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-400">
            Switch smoothly between tools without losing your layers or editing history.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Full Editor */}
          <div
            onClick={() => navigate('/editor')}
            className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                Full Photoshop-Style Editor
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Layers, blend modes, marquee transforms, blemish healing, brush, clone stamp, vector shapes, typography, and 12+ color adjustments.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-cyan-400">
              <span>Open Studio Editor</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: AI Enhancer */}
          <div
            onClick={() => navigate('/enhance')}
            className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-105 transition">
                <Sparkles className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                AI Photo Enhancement
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Convolution unsharp masking, dynamic contrast balancing, facial illumination recovery, and bilateral noise reduction.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-blue-400">
              <span>Enhance Photo</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Passport Photo Maker */}
          <div
            onClick={() => navigate('/passport-photo')}
            className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400 mb-4 group-hover:scale-105 transition">
                <CreditCard className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                Passport &amp; Visa Photo Maker
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Official Nepal MRP &amp; E-Passport (35×45mm), US Visa 2×2", Schengen, India, and UK presets with 70-80% biometric guides.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-violet-400">
              <span>Create Passport Photo</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Custom Print Studio */}
          <div
            onClick={() => navigate('/print-studio')}
            className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition">
                <Printer className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                Custom Print &amp; A4 Layout Studio
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Exact physical millimetre sizing, 300 DPI calculations, cutting lines, and zero-blank-page guaranteed PDF printing.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <span>Open Print Studio</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 5: Background Remover */}
          <div
            onClick={() => navigate('/background')}
            className="group rounded-2xl border border-slate-800 bg-[#0d131f] p-5 sm:p-6 hover:border-cyan-500/40 hover:bg-slate-900/60 transition cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition">
                <Scissors className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition">
                Background Remover &amp; Replacer
              </h3>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Automated subject matting, transparent cutout PNG, solid studio backdrops, and soft background blur effects.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <span>Edit Background</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Card 6: Head Straightener */}
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
                Algorithmic tilt estimation, fine-degree rotation slider, auto-crop to fill, and precision horizontal alignment guides.
              </p>
            </div>
            <div className="mt-5 flex items-center gap-1.5 text-xs font-semibold text-rose-400">
              <span>Straighten Head</span>
              <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition" />
            </div>
          </div>
        </div>
      </section>

      {/* Ad slot between sections */}
      <div className="mx-auto max-w-4xl px-4">
        <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_HOMEPAGE} label="Sponsored Content" />
      </div>

      {/* FAQ Section */}
      <section className="py-12 sm:py-16 border-t border-slate-800/80 bg-slate-950/40">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-1 text-xs text-slate-400">Honest answers about technology, privacy, and printing accuracy.</p>
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
