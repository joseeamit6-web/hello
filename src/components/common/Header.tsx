import React, { useState, useRef } from 'react';
import { useProject } from '../../context/ProjectContext';
import { ExperienceModal } from './ExperienceModal';
import { loadImage } from '../../utils/imageProcessing';
import { 
  Camera, 
  Layers, 
  Sparkles, 
  UserCheck, 
  RotateCw, 
  Shirt, 
  Scissors, 
  CreditCard, 
  Printer, 
  FolderArchive, 
  HelpCircle, 
  Upload, 
  Menu, 
  X,
  CheckCircle2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';

interface HeaderProps {
  currentRoute?: string;
  navigate?: (route: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentRoute = '/', navigate }) => {
  const { project, saveStatus, createNewProject } = useProject();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Choice modal state
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [pendingImageSrc, setPendingImageSrc] = useState('');
  const [pendingImageName, setPendingImageName] = useState('');
  const [pendingDimensions, setPendingDimensions] = useState<{ width: number; height: number } | undefined>(undefined);

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    if (navigate) {
      navigate(path);
    } else {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const result = event.target?.result as string;
        if (result) {
          setPendingImageSrc(result);
          const cleanName = file.name.replace(/\.[^/.]+$/, '');
          setPendingImageName(cleanName);

          try {
            const img = await loadImage(result);
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
    }
  };

  const handleSelectManual = async () => {
    setChoiceModalOpen(false);
    if (pendingImageSrc) {
      await createNewProject(pendingImageSrc, pendingImageName || 'Photo Project');
      handleNav('/editor');
    }
  };

  const handleSelectAI = async (route: string) => {
    setChoiceModalOpen(false);
    if (pendingImageSrc) {
      await createNewProject(pendingImageSrc, pendingImageName || 'Photo Project');
      handleNav(route);
    }
  };

  const navLinks = [
    { name: 'Passport Maker', path: '/passport-photo', icon: CreditCard, primary: true },
    { name: 'Print Studio', path: '/print-studio', icon: Printer },
    { name: 'Formal Suits', path: '/outfit-studio', icon: Shirt },
    { name: 'Straighten', path: '/head-straightener', icon: RotateCw },
    { name: 'Background', path: '/background', icon: Scissors },
    { name: 'Pro Editor', path: '/editor', icon: Layers },
    { name: 'Enhance', path: '/enhance', icon: Sparkles },
    { name: 'Projects', path: '/projects', icon: FolderArchive },
    { name: 'Help', path: '/help', icon: HelpCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-[#090d16]/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-6">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('/')}
            className="flex items-center gap-2 sm:gap-2.5 text-left transition hover:opacity-90 flex-shrink-0"
            aria-label="AI Passport Photo Studio Homepage"
          >
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-violet-600 p-0.5 shadow-md shadow-cyan-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <CreditCard className="h-4 w-4 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-sm font-bold tracking-tight text-transparent sm:text-base flex items-center gap-1.5">
                AI Passport Studio
              </span>
              <span className="hidden md:block text-[10px] font-mono tracking-wider text-cyan-400">
                pic.amitjoshi.info.np
              </span>
            </div>
          </button>

          {/* Desktop & Laptop Navigation Links (lg: and up) */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`flex items-center gap-1.5 rounded-lg px-2 xl:px-2.5 py-1.5 text-xs font-medium transition ${
                    isActive
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700/80 shadow-sm'
                      : item.primary
                      ? 'text-cyan-300 hover:bg-cyan-500/10 font-semibold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-cyan-400' : item.primary ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Actions & Status */}
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
            {/* Active project save indicator */}
            {project && (
              <div className="hidden sm:flex items-center gap-1.5 rounded-full bg-slate-900/90 px-2.5 py-1 text-[11px] font-mono border border-slate-800">
                {saveStatus === 'saving' && (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin text-amber-400" />
                    <span className="text-amber-300">Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                    <span className="text-slate-300">Saved</span>
                  </>
                )}
                {saveStatus === 'error' && (
                  <>
                    <AlertCircle className="h-3 w-3 text-rose-400" />
                    <span className="text-rose-300">Alert</span>
                  </>
                )}
              </div>
            )}

            {/* Quick Upload Button */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/png,image/jpeg,image/webp,image/avif"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm shadow-cyan-500/20 transition hover:from-cyan-500 hover:to-blue-500 hover:shadow-cyan-500/30"
            >
              <Upload className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Open Photo</span>
              <span className="sm:hidden">Open</span>
            </button>

            {/* Mobile/Tablet menu toggle (< lg) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden flex h-8 w-8 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-white"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / Tablet Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-b border-slate-800 bg-slate-950/95 px-4 py-3 backdrop-blur-xl">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pb-2">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = currentRoute === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item.path)}
                    className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-medium text-left transition ${
                      isActive
                        ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                        : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </div>
            {project && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span className="truncate max-w-[200px]">Active: {project.name}</span>
                <span className="text-[11px] font-mono text-cyan-400">{project.width} × {project.height} px</span>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Choice Modal for Upload from Header */}
      <ExperienceModal
        isOpen={choiceModalOpen}
        onClose={() => setChoiceModalOpen(false)}
        imageSrc={pendingImageSrc}
        imageName={pendingImageName}
        imageDimensions={pendingDimensions}
        onSelectManual={handleSelectManual}
        onSelectAI={handleSelectAI}
      />
    </>
  );
};
