import React from 'react';
import { updatePageSeo } from '../utils/seo';
import { AdSlot } from '../components/common/AdSlot';
import { 
  HelpCircle, 
  Mail, 
  MessageCircle, 
  Printer, 
  CreditCard, 
  Layers, 
  ShieldCheck, 
  RotateCw, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface HelpPageProps {
  navigate: (route: string) => void;
}

export const HelpPage: React.FC<HelpPageProps> = ({ navigate }) => {
  React.useEffect(() => {
    updatePageSeo({
      title: 'AI Photo Studio Help, Troubleshooting & Support | Amit Joshi',
      description: 'Comprehensive user guide, printing troubleshooting, passport photo instructions, and direct support contact for AI Photo Studio.',
      canonicalPath: '/help',
    });
  }, []);

  return (
    <div className="flex-1 bg-[#090d16] text-slate-100 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-4xl space-y-10">
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3 py-1 text-xs font-medium text-cyan-400">
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Help Center &amp; Documentation</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            How can we assist your photo editing?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Learn how to use manual layers, prepare official biometric passport sheets, and print without trailing blank pages.
          </p>
        </div>

        {/* Official Contact Card */}
        <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-6 sm:p-8 shadow-xl">
          <h2 className="text-lg font-bold text-white mb-2">Direct Official Support</h2>
          <p className="text-xs text-slate-400 mb-6">
            Need assistance, feature requests, or have questions about passport standards? Reach out directly via our official channels:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Email Support */}
            <a
              href="mailto:support@amitjoshi.info.np"
              className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-cyan-500/50 hover:bg-slate-900 transition group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 group-hover:scale-105 transition">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400">Official Support Email</div>
                <div className="text-sm font-semibold text-white group-hover:text-cyan-300 transition">
                  support@amitjoshi.info.np
                </div>
              </div>
            </a>

            {/* WhatsApp Support */}
            <a
              href="https://wa.me/9779746241860"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 hover:border-emerald-500/50 hover:bg-slate-900 transition group"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-105 transition">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <span>Official WhatsApp</span>
                  <ExternalLink className="h-2.5 w-2.5 text-slate-500" />
                </div>
                <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition">
                  +977 9746241860
                </div>
              </div>
            </a>
          </div>
        </div>

        {/* AdSlot */}
        <AdSlot slotId={import.meta.env.VITE_ADSENSE_SLOT_TOOLS} />

        {/* Guides Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-white">Essential User Guides</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Guide 1 */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-semibold text-sm">
                <Printer className="h-4 w-4" />
                <span>Zero Blank Page Printing</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                When printing multi-copy photo sheets from the Custom Print Studio, our dedicated layout isolates the document inside an exact-dimension container, preventing the trailing blank page bug common in browser print dialogs.
              </p>
            </div>

            {/* Guide 2 */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 space-y-2">
              <div className="flex items-center gap-2 text-violet-400 font-semibold text-sm">
                <CreditCard className="h-4 w-4" />
                <span>Nepal &amp; Schengen Passport Photos</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nepal MRP and Schengen require 35×45mm photos where the head occupies between 70% and 80% of the total frame height. Use our on-screen biometric lines to align chin and crown limits before export.
              </p>
            </div>

            {/* Guide 3 */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-sm">
                <RotateCw className="h-4 w-4" />
                <span>Head Straightener &amp; Auto-Crop</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                If the subject tilted their head slightly during capture, the Head Straightener analyzes horizontal eye contrast to estimate the tilt angle and applies fine rotation with automatic boundary crop to avoid transparent wedges.
              </p>
            </div>

            {/* Guide 4 */}
            <div className="rounded-2xl border border-slate-800 bg-[#0d131f] p-5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
                <ShieldCheck className="h-4 w-4" />
                <span>Local IndexedDB Security</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Projects and editing recipes are saved locally in your browser's IndexedDB. Your photographs are not sent to any advertising networks or third-party servers during manual editing.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
