import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { updatePageSeo } from '../utils/seo';
import { 
  getAllProjects, 
  deleteProject, 
  duplicateProject, 
  clearAllProjects, 
  getStorageUsage 
} from '../utils/storage';
import { ProjectSummary } from '../types/project';
import { AdSlot } from '../components/common/AdSlot';
import { 
  FolderArchive, 
  Trash2, 
  Copy, 
  Edit3, 
  HardDrive, 
  ArrowLeft, 
  Layers, 
  AlertTriangle,
  FolderOpen,
  Calendar
} from 'lucide-react';

interface ProjectsPageProps {
  navigate: (route: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ navigate }) => {
  const { loadProject, setProject } = useProject();
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [storageInfo, setStorageInfo] = useState<{ usedFormatted: string; quotaFormatted: string; percentage: number }>({
    usedFormatted: '0 B',
    quotaFormatted: '0 B',
    percentage: 0,
  });
  const [confirmClearAll, setConfirmClearAll] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    updatePageSeo({
      title: 'Saved Photo Projects – IndexedDB Storage | AI Photo Studio',
      description: 'Manage locally saved photo studio projects, layers, and edit histories stored securely inside your browser.',
      canonicalPath: '/projects',
    });

    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    const list = await getAllProjects();
    setProjects(list);
    const storage = await getStorageUsage();
    setStorageInfo(storage);
    setIsLoading(false);
  };

  const handleOpen = async (id: string) => {
    const success = await loadProject(id);
    if (success) {
      navigate('/editor');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Delete this project permanently from local storage?')) {
      await deleteProject(id);
      loadAll();
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await duplicateProject(id);
    loadAll();
  };

  const handleClearAll = async () => {
    await clearAllProjects();
    setProject(null);
    setConfirmClearAll(false);
    loadAll();
  };

  return (
    <div className="flex-1 bg-[#090d16] text-slate-100 py-8 px-4 sm:px-6">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <button
              onClick={() => navigate('/editor')}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-cyan-400 transition mb-1"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Back to Editor Workspace</span>
            </button>
            <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <FolderArchive className="h-6 w-6 text-cyan-400" />
              Saved Local Projects
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Your edits, layers, and adjustment recipes are preserved privately in your browser's IndexedDB.
            </p>
          </div>

          {projects.length > 0 && (
            <button
              onClick={() => setConfirmClearAll(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-900/60 bg-rose-950/40 text-rose-300 hover:bg-rose-900/60 text-xs transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear All Projects</span>
            </button>
          )}
        </div>

        {/* Local Storage Quota Info Bar */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0d131f] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400">
              <HardDrive className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-200">Device Browser Storage</div>
              <div className="text-[11px] text-slate-400">
                Using {storageInfo.usedFormatted} of {storageInfo.quotaFormatted} allocated browser quota ({storageInfo.percentage}%)
              </div>
            </div>
          </div>
          <div className="text-[11px] text-slate-500 max-w-sm text-right">
            Stored locally on this device. Not synchronized across cloud devices or external servers.
          </div>
        </div>

        {/* Projects Grid */}
        <div className="mt-8">
          {isLoading ? (
            <div className="py-20 text-center text-xs text-slate-500 animate-pulse">
              Reading IndexedDB projects...
            </div>
          ) : projects.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-12 text-center max-w-md mx-auto">
              <FolderOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Saved Projects Found</h3>
              <p className="mt-1 text-xs text-slate-500">
                Open a photograph in the Photo Editor or try any of our specialized tools. Your work will be automatically saved here!
              </p>
              <button
                onClick={() => navigate('/editor')}
                className="mt-5 px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition shadow-md shadow-cyan-500/20"
              >
                Open Studio Editor
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => handleOpen(proj.id)}
                  className="group rounded-2xl border border-slate-800 bg-[#0d131f] overflow-hidden hover:border-cyan-500/50 hover:bg-slate-900/80 transition cursor-pointer flex flex-col justify-between shadow-lg"
                >
                  {/* Thumbnail */}
                  <div className="h-44 w-full bg-slate-950 flex items-center justify-center overflow-hidden border-b border-slate-800 relative bg-transparency-grid">
                    <img
                      src={proj.thumbnail}
                      alt={proj.name}
                      className="h-full w-full object-contain group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute bottom-2 left-2 rounded bg-slate-900/90 backdrop-blur px-2 py-0.5 text-[10px] font-mono text-cyan-400 border border-slate-800">
                      {proj.width} × {proj.height} px
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-semibold text-sm text-slate-200 group-hover:text-cyan-300 transition truncate">
                        {proj.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <Layers className="h-3 w-3" />
                          {proj.layerCount} layers
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(proj.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-xs font-semibold text-cyan-400">Open in Editor →</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => handleDuplicate(proj.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                          title="Duplicate Project"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(proj.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition"
                          title="Delete Project"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Clear All Confirmation Modal */}
        {confirmClearAll && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-[#0d131f] p-6 text-slate-200 shadow-2xl">
              <div className="flex items-center gap-3 text-rose-400 mb-3">
                <AlertTriangle className="h-6 w-6" />
                <h3 className="text-lg font-bold text-white">Clear All Local Projects?</h3>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                This will delete all saved layers, images, and history from your browser's IndexedDB. This action cannot be reversed.
              </p>
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => setConfirmClearAll(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearAll}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow"
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="mt-12">
          <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_TOOLS} />
        </div>
      </div>
    </div>
  );
};
