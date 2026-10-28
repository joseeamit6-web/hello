import React from 'react';
import { Camera, Mail, MessageCircle, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

interface FooterProps {
  navigate?: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  const handleNav = (path: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (navigate) {
      navigate(path);
    } else {
      window.history.pushState(null, '', path);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <footer className="mt-auto border-t border-slate-800/80 bg-[#070b14] py-12 text-slate-400 no-print">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-cyan-500 to-violet-600 p-0.5">
                <div className="flex h-full w-full items-center justify-center rounded-[6px] bg-slate-950">
                  <Camera className="h-4 w-4 text-cyan-400" />
                </div>
              </div>
              <span className="text-base font-bold text-white tracking-tight">AI Photo Studio</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Complete professional photo editing, portrait retouching, AI enhancement, head alignment, biometric passport photo sizing, and deterministic print layouts in your browser.
            </p>
            <div className="pt-1 flex items-center gap-1.5 text-xs text-slate-500 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>Client-side local processing</span>
            </div>
          </div>

          {/* Creative Tools */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Creative Tools</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a href="/editor" onClick={(e) => handleNav('/editor', e)} className="hover:text-cyan-400 transition">
                  Full Photo Editor (Layers &amp; History)
                </a>
              </li>
              <li>
                <a href="/enhance" onClick={(e) => handleNav('/enhance', e)} className="hover:text-cyan-400 transition">
                  AI Photo Enhancer &amp; Sharpener
                </a>
              </li>
              <li>
                <a href="/retouch" onClick={(e) => handleNav('/retouch', e)} className="hover:text-cyan-400 transition">
                  Portrait &amp; Blemish Retouch
                </a>
              </li>
              <li>
                <a href="/head-straightener" onClick={(e) => handleNav('/head-straightener', e)} className="hover:text-cyan-400 transition">
                  Head Straightener &amp; Tilt Correction
                </a>
              </li>
              <li>
                <a href="/outfit-studio" onClick={(e) => handleNav('/outfit-studio', e)} className="hover:text-cyan-400 transition">
                  AI Outfit &amp; Formal Attire Studio
                </a>
              </li>
              <li>
                <a href="/background" onClick={(e) => handleNav('/background', e)} className="hover:text-cyan-400 transition">
                  Background Remover &amp; Replacer
                </a>
              </li>
            </ul>
          </div>

          {/* Document & Print */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Print &amp; Identity</h3>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <a href="/passport-photo" onClick={(e) => handleNav('/passport-photo', e)} className="hover:text-cyan-400 transition">
                  Nepal MRP &amp; E-Passport Photos
                </a>
              </li>
              <li>
                <a href="/passport-photo" onClick={(e) => handleNav('/passport-photo', e)} className="hover:text-cyan-400 transition">
                  US Visa (2×2 in) &amp; Schengen Specs
                </a>
              </li>
              <li>
                <a href="/print-studio" onClick={(e) => handleNav('/print-studio', e)} className="hover:text-cyan-400 transition">
                  Custom Sizing &amp; A4 Print Studio
                </a>
              </li>
              <li>
                <a href="/projects" onClick={(e) => handleNav('/projects', e)} className="hover:text-cyan-400 transition">
                  Saved Local Projects (IndexedDB)
                </a>
              </li>
              <li>
                <a href="/privacy" onClick={(e) => handleNav('/privacy', e)} className="hover:text-cyan-400 transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/terms" onClick={(e) => handleNav('/terms', e)} className="hover:text-cyan-400 transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          {/* Official Support & Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Official Support</h3>
            <div className="mt-3 space-y-2.5 text-xs">
              <a
                href="mailto:support@amitjoshi.info.np"
                className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition group"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 border border-slate-800 group-hover:border-cyan-500/50">
                  <Mail className="h-3.5 w-3.5 text-cyan-400" />
                </div>
                <span>support@amitjoshi.info.np</span>
              </a>

              <a
                href="https://wa.me/9779746241860"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-slate-300 hover:text-emerald-400 transition group"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded bg-slate-900 border border-slate-800 group-hover:border-emerald-500/50">
                  <MessageCircle className="h-3.5 w-3.5 text-emerald-400" />
                </div>
                <span>WhatsApp: +977 9746241860</span>
                <ExternalLink className="h-2.5 w-2.5 text-slate-600" />
              </a>

              <div className="pt-2 text-[11px] text-slate-500">
                Official domain: <a href="https://pic.amitjoshi.info.np" className="text-slate-400 underline underline-offset-2">pic.amitjoshi.info.np</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} AI Photo Studio. Built with high-precision browser imaging.</p>
          <div className="flex items-center gap-4 text-xs">
            <a href="/help" onClick={(e) => handleNav('/help', e)} className="hover:text-slate-300">Help Center</a>
            <span>•</span>
            <a href="/privacy" onClick={(e) => handleNav('/privacy', e)} className="hover:text-slate-300">Privacy</a>
            <span>•</span>
            <a href="/terms" onClick={(e) => handleNav('/terms', e)} className="hover:text-slate-300">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
