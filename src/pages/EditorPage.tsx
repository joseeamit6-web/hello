import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { ToolMode, BrushSettings, CropRect } from '../types/editor';
import { LeftToolbar } from '../components/editor/LeftToolbar';
import { TopNavbar } from '../components/editor/TopNavbar';
import { CanvasWorkspace } from '../components/editor/CanvasWorkspace';
import { RightPanel } from '../components/editor/RightPanel';
import { ExportModal } from '../components/editor/ExportModal';
import { ExperienceModal } from '../components/common/ExperienceModal';
import { SAMPLE_IMAGES } from '../utils/sampleImages';
import { Upload, Sparkles, Image as ImageIcon } from 'lucide-react';

interface EditorPageProps {
  navigate: (route: string) => void;
}

export const EditorPage: React.FC<EditorPageProps> = ({ navigate }) => {
  const { project, createNewProject } = useProject();

  const [currentTool, setCurrentTool] = useState<ToolMode>('move');
  const [brushSettings, setBrushSettings] = useState<BrushSettings>({
    size: 25,
    hardness: 80,
    opacity: 100,
    color: '#06b6d4',
  });
  const [zoom, setZoom] = useState<number>(1);
  const [activeRightTab, setActiveRightTab] = useState<'adjustments' | 'layers' | 'history'>('adjustments');
  const [isRightPanelOpenMobile, setIsRightPanelOpenMobile] = useState<boolean>(false);
  const [cropRect, setCropRect] = useState<CropRect | null>(null);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Experience choice modal state for empty upload
  const [choiceModalOpen, setChoiceModalOpen] = useState<boolean>(false);
  const [pendingImageSrc, setPendingImageSrc] = useState<string>('');
  const [pendingImageName, setPendingImageName] = useState<string>('');

  useEffect(() => {
    updatePageSeo({
      title: 'Online Photo Editor – Layers, Brushes, Crop & Retouch | AI Photo Studio',
      description: 'Professional web-based Photoshop-style photo editor with multiple image layers, blemish healing, tone adjustments, text tools, shapes, and high-resolution export.',
      canonicalPath: '/editor',
    });
  }, []);

  // Fit image to canvas screen
  const handleFitScreen = () => {
    if (!project) return;
    const isMobile = window.innerWidth < 1024;
    const viewportW = isMobile ? window.innerWidth - 30 : window.innerWidth - 380;
    const viewportH = window.innerHeight - 150;
    const scaleW = viewportW / project.width;
    const scaleH = viewportH / project.height;
    const fitScale = Math.min(1.2, Math.max(0.15, Math.min(scaleW, scaleH) * 0.85));
    setZoom(Number(fitScale.toFixed(2)));
  };

  const handleSelectTool = (tool: ToolMode) => {
    setCurrentTool(tool);
    if (tool === 'crop' && project) {
      setCropRect({
        x: Math.round(project.width * 0.1),
        y: Math.round(project.height * 0.1),
        width: Math.round(project.width * 0.8),
        height: Math.round(project.height * 0.8),
      });
    } else {
      setCropRect(null);
    }
  };

  const handleSelectRightTab = (tab: 'adjustments' | 'layers' | 'history') => {
    setActiveRightTab(tab);
    setIsRightPanelOpenMobile(true);
  };

  // Upload handler for empty editor state
  const handleInitialFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        if (src) {
          setPendingImageSrc(src);
          setPendingImageName(file.name.replace(/\.[^/.]+$/, ''));
          setChoiceModalOpen(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChoiceManual = async () => {
    setChoiceModalOpen(false);
    if (pendingImageSrc) {
      await createNewProject(pendingImageSrc, pendingImageName || 'Photo Project');
    }
  };

  const handleChoiceAI = async (route: string) => {
    setChoiceModalOpen(false);
    if (pendingImageSrc) {
      await createNewProject(pendingImageSrc, pendingImageName || 'Photo Project');
      navigate(route);
    }
  };

  // If user opens /editor without having uploaded an image yet
  if (!project) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-[#090d16] text-slate-100 min-h-[calc(100vh-56px)]">
        <div className="max-w-md w-full rounded-3xl border border-slate-800 bg-[#0d131f] p-6 sm:p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-4">
            <ImageIcon className="h-7 w-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white">No Photo Loaded in Studio</h2>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed">
            Open an image file from your device, or load an instant studio test portrait to start editing with layers and adjustments.
          </p>

          <div className="mt-6 space-y-3">
            <label className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 cursor-pointer transition">
              <Upload className="h-4 w-4" />
              <span>Open Photo from Device</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleInitialFileUpload}
                className="hidden"
              />
            </label>

            <button
              onClick={() => {
                setPendingImageSrc(SAMPLE_IMAGES[0].dataUrl);
                setPendingImageName(SAMPLE_IMAGES[0].name);
                setChoiceModalOpen(true);
              }}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Load Sample Portrait (Fast Test)</span>
            </button>
          </div>
        </div>

        {/* Choice Modal */}
        <ExperienceModal
          isOpen={choiceModalOpen}
          onClose={() => setChoiceModalOpen(false)}
          imageSrc={pendingImageSrc}
          imageName={pendingImageName}
          onSelectManual={handleChoiceManual}
          onSelectAI={handleChoiceAI}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 h-[calc(100vh-56px)] overflow-hidden bg-[#090d16] relative">
      {/* Top Navbar */}
      <TopNavbar
        currentTool={currentTool}
        brushSettings={brushSettings}
        onChangeBrushSettings={(partial) => setBrushSettings((prev) => ({ ...prev, ...partial }))}
        zoom={zoom}
        onZoomChange={setZoom}
        onFitScreen={handleFitScreen}
        onOpenExport={() => setIsExportOpen(true)}
        onNavigateToTool={navigate}
        activeRightTab={activeRightTab}
        onSelectRightTab={handleSelectRightTab}
        isRightPanelOpen={isRightPanelOpenMobile}
        onToggleRightPanel={() => setIsRightPanelOpenMobile(!isRightPanelOpenMobile)}
      />

      {/* Main Workspace Row */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Toolbar (Sidebar on desktop/tablet, bottom bar on mobile) */}
        <LeftToolbar
          currentTool={currentTool}
          onSelectTool={handleSelectTool}
          brushSettings={brushSettings}
          onChangeBrushSettings={(partial) => setBrushSettings((prev) => ({ ...prev, ...partial }))}
        />

        {/* Central Canvas Area */}
        <CanvasWorkspace
          currentTool={currentTool}
          brushSettings={brushSettings}
          zoom={zoom}
          onZoomChange={setZoom}
          cropRect={cropRect}
          setCropRect={setCropRect}
        />

        {/* Right Panel (Docked on lg: and up, Slide-over Drawer on mobile & tablet) */}
        <RightPanel
          activeTab={activeRightTab}
          onSelectTab={setActiveRightTab}
          isOpenOnMobile={isRightPanelOpenMobile}
          onCloseMobile={() => setIsRightPanelOpenMobile(false)}
        />
      </div>

      {/* Export Dialog */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />

      {/* Choice Modal */}
      <ExperienceModal
        isOpen={choiceModalOpen}
        onClose={() => setChoiceModalOpen(false)}
        imageSrc={pendingImageSrc}
        imageName={pendingImageName}
        onSelectManual={handleChoiceManual}
        onSelectAI={handleChoiceAI}
      />
    </div>
  );
};
