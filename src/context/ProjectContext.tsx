import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Project, Layer, Adjustments, DEFAULT_ADJUSTMENTS } from '../types/project';
import { HistoryItem } from '../types/editor';
import { saveProject, getProject } from '../utils/storage';
import { loadImage, createCanvasFromSource } from '../utils/imageProcessing';

interface ProjectContextType {
  project: Project | null;
  setProject: React.Dispatch<React.SetStateAction<Project | null>>;
  saveStatus: 'saved' | 'saving' | 'error' | 'idle';
  lastSavedAt: number | null;
  history: HistoryItem[];
  historyIndex: number;
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
  createNewProject: (imageSrc: string, name?: string) => Promise<Project>;
  loadProject: (id: string) => Promise<boolean>;
  updateProject: (updater: (prev: Project) => Project, historyDesc?: string) => void;
  updateAdjustments: (adjustments: Partial<Adjustments>) => void;
  resetAdjustments: () => void;
  addLayer: (layer: Omit<Layer, 'id'>) => string;
  updateLayer: (layerId: string, partial: Partial<Layer>) => void;
  deleteLayer: (layerId: string) => void;
  duplicateLayer: (layerId: string) => void;
  reorderLayers: (startIndex: number, endIndex: number) => void;
  selectLayer: (layerId: string | null) => void;
  applyImageAsNewBase: (newImageDataUrl: string, description?: string) => void;
  saveNow: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const AUTOSAVE_DEBOUNCE_MS = 1200;
const MAX_HISTORY_STEPS = 25;

export const ProjectProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error' | 'idle'>('idle');
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInternalHistoryStepRef = useRef<boolean>(false);

  // Debounced auto-save to IndexedDB whenever project changes
  useEffect(() => {
    if (!project) return;

    setSaveStatus('saving');
    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current);
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        await saveProject(project);
        setSaveStatus('saved');
        setLastSavedAt(Date.now());
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('error');
      }
    }, AUTOSAVE_DEBOUNCE_MS);

    return () => {
      if (autosaveTimerRef.current) {
        clearTimeout(autosaveTimerRef.current);
      }
    };
  }, [project]);

  // Push new state to history stack
  const pushHistory = useCallback((currentProj: Project, description: string) => {
    if (isInternalHistoryStepRef.current) {
      isInternalHistoryStepRef.current = false;
      return;
    }

    const newItem: HistoryItem = {
      id: 'hist_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
      description,
      timestamp: Date.now(),
      layers: JSON.stringify(currentProj.layers),
      adjustments: JSON.stringify(currentProj.adjustments),
      width: currentProj.width,
      height: currentProj.height,
    };

    setHistory((prev) => {
      // Discard any redos beyond current index
      const truncated = prev.slice(0, historyIndex + 1);
      const updated = [...truncated, newItem];
      if (updated.length > MAX_HISTORY_STEPS) {
        return updated.slice(updated.length - MAX_HISTORY_STEPS);
      }
      return updated;
    });

    setHistoryIndex((prev) => Math.min(prev + 1, MAX_HISTORY_STEPS - 1));
  }, [historyIndex]);

  // Create brand new project from uploaded or sample image
  const createNewProject = useCallback(async (imageSrc: string, name?: string): Promise<Project> => {
    const img = await loadImage(imageSrc);
    const canvas = createCanvasFromSource(img);
    const w = canvas.width;
    const h = canvas.height;

    // Generate lightweight thumbnail
    const thumbCanvas = document.createElement('canvas');
    const thumbW = 180;
    const thumbH = Math.round((h / w) * 180);
    thumbCanvas.width = thumbW;
    thumbCanvas.height = thumbH;
    const tCtx = thumbCanvas.getContext('2d');
    if (tCtx) tCtx.drawImage(canvas, 0, 0, thumbW, thumbH);
    const thumbnail = thumbCanvas.toDataURL('image/jpeg', 0.85);

    const baseLayerId = 'layer_base_' + Date.now();
    const baseLayer: Layer = {
      id: baseLayerId,
      name: 'Background Photo',
      type: 'image',
      visible: true,
      locked: false,
      opacity: 1,
      blendMode: 'source-over',
      x: 0,
      y: 0,
      width: w,
      height: h,
      rotation: 0,
      imageData: {
        src: imageSrc,
        naturalWidth: w,
        naturalHeight: h,
      },
    };

    const newProj: Project = {
      id: 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      name: name || 'Photo Project ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      thumbnail,
      width: w,
      height: h,
      layers: [baseLayer],
      selectedLayerId: baseLayerId,
      adjustments: { ...DEFAULT_ADJUSTMENTS },
      sourceOriginalUrl: imageSrc,
    };

    setProject(newProj);
    setHistory([{
      id: 'hist_init',
      description: 'Initial Image Upload',
      timestamp: Date.now(),
      layers: JSON.stringify(newProj.layers),
      adjustments: JSON.stringify(newProj.adjustments),
      width: w,
      height: h,
    }]);
    setHistoryIndex(0);

    await saveProject(newProj);
    setSaveStatus('saved');
    setLastSavedAt(Date.now());
    return newProj;
  }, []);

  // Load existing project by ID from IndexedDB
  const loadProject = useCallback(async (id: string): Promise<boolean> => {
    try {
      const proj = await getProject(id);
      if (proj) {
        setProject(proj);
        setHistory([{
          id: 'hist_loaded',
          description: 'Loaded Project',
          timestamp: Date.now(),
          layers: JSON.stringify(proj.layers),
          adjustments: JSON.stringify(proj.adjustments),
          width: proj.width,
          height: proj.height,
        }]);
        setHistoryIndex(0);
        setSaveStatus('saved');
        return true;
      }
      return false;
    } catch (err) {
      console.error('Failed to load project from IndexedDB:', err);
      return false;
    }
  }, []);

  // Update project state with optional history description
  const updateProject = useCallback((updater: (prev: Project) => Project, historyDesc?: string) => {
    setProject((prev) => {
      if (!prev) return null;
      const updated = updater(prev);
      if (historyDesc) {
        pushHistory(updated, historyDesc);
      }
      return updated;
    });
  }, [pushHistory]);

  // Adjustments updater
  const updateAdjustments = useCallback((partial: Partial<Adjustments>) => {
    setProject((prev) => {
      if (!prev) return null;
      const newAdj = { ...prev.adjustments, ...partial };
      return { ...prev, adjustments: newAdj };
    });
  }, []);

  const resetAdjustments = useCallback(() => {
    setProject((prev) => {
      if (!prev) return null;
      const updated = { ...prev, adjustments: { ...DEFAULT_ADJUSTMENTS } };
      pushHistory(updated, 'Reset Adjustments');
      return updated;
    });
  }, [pushHistory]);

  // Layer Operations
  const addLayer = useCallback((layerData: Omit<Layer, 'id'>): string => {
    const id = 'layer_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
    const newLayer: Layer = { ...layerData, id };

    setProject((prev) => {
      if (!prev) return null;
      const updatedLayers = [...prev.layers, newLayer];
      const updated = {
        ...prev,
        layers: updatedLayers,
        selectedLayerId: id,
      };
      pushHistory(updated, `Add ${newLayer.name}`);
      return updated;
    });
    return id;
  }, [pushHistory]);

  const updateLayer = useCallback((layerId: string, partial: Partial<Layer>) => {
    setProject((prev) => {
      if (!prev) return null;
      const updatedLayers = prev.layers.map((l) => (l.id === layerId ? { ...l, ...partial } : l));
      return { ...prev, layers: updatedLayers };
    });
  }, []);

  const deleteLayer = useCallback((layerId: string) => {
    setProject((prev) => {
      if (!prev) return null;
      if (prev.layers.length <= 1) return prev; // Keep at least one base layer

      const targetLayer = prev.layers.find((l) => l.id === layerId);
      const updatedLayers = prev.layers.filter((l) => l.id !== layerId);
      const nextSelected = prev.selectedLayerId === layerId
        ? updatedLayers[updatedLayers.length - 1].id
        : prev.selectedLayerId;

      const updated = {
        ...prev,
        layers: updatedLayers,
        selectedLayerId: nextSelected,
      };
      pushHistory(updated, `Delete ${targetLayer?.name || 'Layer'}`);
      return updated;
    });
  }, [pushHistory]);

  const duplicateLayer = useCallback((layerId: string) => {
    setProject((prev) => {
      if (!prev) return null;
      const target = prev.layers.find((l) => l.id === layerId);
      if (!target) return prev;

      const newId = 'layer_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6);
      const copy: Layer = {
        ...target,
        id: newId,
        name: `${target.name} Copy`,
        x: target.x + 15,
        y: target.y + 15,
      };

      const updated = {
        ...prev,
        layers: [...prev.layers, copy],
        selectedLayerId: newId,
      };
      pushHistory(updated, `Duplicate ${target.name}`);
      return updated;
    });
  }, [pushHistory]);

  const reorderLayers = useCallback((startIndex: number, endIndex: number) => {
    setProject((prev) => {
      if (!prev) return null;
      const result = Array.from(prev.layers);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      const updated = { ...prev, layers: result };
      pushHistory(updated, 'Reorder Layers');
      return updated;
    });
  }, [pushHistory]);

  const selectLayer = useCallback((layerId: string | null) => {
    setProject((prev) => (prev ? { ...prev, selectedLayerId: layerId } : null));
  }, []);

  // Replaces the active image base layer with a processed result (e.g. from Enhance, Background, or Head Straightener)
  const applyImageAsNewBase = useCallback((newImageDataUrl: string, description: string = 'Apply Edits') => {
    setProject((prev) => {
      if (!prev) return null;
      const baseLayer = prev.layers[0];
      const updatedBase: Layer = {
        ...baseLayer,
        imageData: {
          src: newImageDataUrl,
          naturalWidth: prev.width,
          naturalHeight: prev.height,
        },
      };
      const updated = {
        ...prev,
        layers: [updatedBase, ...prev.layers.slice(1)],
      };
      pushHistory(updated, description);
      return updated;
    });
  }, [pushHistory]);

  // Undo / Redo
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const undo = useCallback(() => {
    if (!canUndo) return;
    const targetIndex = historyIndex - 1;
    const item = history[targetIndex];
    if (!item) return;

    isInternalHistoryStepRef.current = true;
    setHistoryIndex(targetIndex);
    setProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        layers: JSON.parse(item.layers),
        adjustments: JSON.parse(item.adjustments),
        width: item.width,
        height: item.height,
      };
    });
  }, [canUndo, history, historyIndex]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const targetIndex = historyIndex + 1;
    const item = history[targetIndex];
    if (!item) return;

    isInternalHistoryStepRef.current = true;
    setHistoryIndex(targetIndex);
    setProject((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        layers: JSON.parse(item.layers),
        adjustments: JSON.parse(item.adjustments),
        width: item.width,
        height: item.height,
      };
    });
  }, [canRedo, history, historyIndex]);

  const saveNow = useCallback(async () => {
    if (!project) return;
    setSaveStatus('saving');
    try {
      await saveProject(project);
      setSaveStatus('saved');
      setLastSavedAt(Date.now());
    } catch (e) {
      console.error(e);
      setSaveStatus('error');
    }
  }, [project]);

  return (
    <ProjectContext.Provider
      value={{
        project,
        setProject,
        saveStatus,
        lastSavedAt,
        history,
        historyIndex,
        canUndo,
        canRedo,
        undo,
        redo,
        createNewProject,
        loadProject,
        updateProject,
        updateAdjustments,
        resetAdjustments,
        addLayer,
        updateLayer,
        deleteLayer,
        duplicateLayer,
        reorderLayers,
        selectLayer,
        applyImageAsNewBase,
        saveNow,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export function useProject() {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProject must be used within a ProjectProvider');
  }
  return context;
}
