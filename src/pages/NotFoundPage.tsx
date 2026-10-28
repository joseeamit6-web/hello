import React, { useEffect } from 'react';
import { updatePageSeo } from '../utils/seo';
import { 
  Camera, 
  Home, 
  Layers, 
  ArrowLeft, 
  Sparkles, 
  CreditCard, 
  Printer, 
  Scissors, 
  Mail, 
  MessageCircle 
} from 'lucide-react';

interface NotFoundPageProps {
  navigate: (route: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ navigate }) => {
  useEffect(() => {
    updatePageSeo({
      title: '404 – Page Out of Frame | AI Photo Studio',
      description: 'The requested page could not be found. Return to AI Photo Studio homepage or explore our editing tools.',
      canonicalPath: '/404',
    });
  }, []);

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex-1 bg-[#090d16] text-slate-100 flex flex-col items-center justify-center p-6 text-center min-h-[calc(100vh-120px)]">
      <div className="max-w-xl w-full rounded-3xl border border-slate-800 bg-[#0d131f] p-8 sm:p-12 shadow-2xl relative overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Camera crop frame illustration */}
        <div className="mx-auto relative flex h-24 w-24 items-center justify-center rounded-2xl bg-slate-900 border-2 border-dashed border-cyan-500/50 mb-6">
          <Camera className="h-10 w-10 text-cyan-400 opacity-80" />
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />
        </div>

        <div className="inline-block rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-0.5 text-xs font-mono text-cyan-400 mb-3">
          Error 404
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Oops! This page went out of frame.
        </h1>

        <p className="mt-3 text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md mx-auto">
          The page you're looking for may have moved, expired, or never existed. Let's get your photo editing back on track.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-cyan-500/20 hover:from-cyan-500 hover:to-blue-500 transition"
          >
            <Home className="h-4 w-4" />
            <span>Return Home</span>
          </button>

          <button
            onClick={() => navigate('/editor')}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-medium text-slate-200 hover:bg-slate-700 hover:text-white transition"
          >
            <Layers className="h-4 w-4 text-cyan-400" />
            <span>Open Photo Editor</span>
          </button>

          <button
            onClick={handleBack}
            className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3.5 py-2.5 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Popular Tools Shortcuts */}
        <div className="mt-8 pt-6 border-t border-slate-800/80">
          <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 mb-3">Popular Studio Tools</div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
            <button
              onClick={() => navigate('/enhance')}
              className="flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition"
            >
              <Sparkles className="h-3 w-3 text-cyan-400" />
              <span>AI Enhance</span>
            </button>
            <button
              onClick={() => navigate('/passport-photo')}
              className="flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition"
            >
              <CreditCard className="h-3 w-3 text-violet-400" />
              <span>Passport Photo</span>
            </button>
            <button
              onClick={() => navigate('/print-studio')}
              className="flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition"
            >
              <Printer className="h-3 w-3 text-emerald-400" />
              <span>Print Studio</span>
            </button>
            <button
              onClick={() => navigate('/background')}
              className="flex items-center gap-1 rounded-lg bg-slate-900 border border-slate-800 px-2.5 py-1 text-slate-300 hover:border-cyan-500/50 hover:text-cyan-300 transition"
            >
              <Scissors className="h-3 w-3 text-amber-400" />
              <span>Background Cutout</span>
            </button>
          </div>
        </div>

        {/* Official contact */}
        <div className="mt-6 pt-4 border-t border-slate-800/50 text-[11px] text-slate-500 flex items-center justify-center gap-4">
          <a href="mailto:support@amitjoshi.info.np" className="hover:text-cyan-400 flex items-center gap-1">
            <Mail className="h-3 w-3" />
            <span>support@amitjoshi.info.np</span>
          </a>
          <span>•</span>
          <a href="https://wa.me/9779746241860" className="hover:text-emerald-400 flex items-center gap-1">
            <MessageCircle className="h-3 w-3" />
            <span>WhatsApp Support</span>
          </a>
        </div>
      </div>
    </div>
  );
};
