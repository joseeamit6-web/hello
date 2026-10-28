import React, { useEffect } from 'react';
import { updatePageSeo } from '../utils/seo';
import { ShieldCheck, Mail, MessageCircle } from 'lucide-react';

interface PrivacyPageProps {
  navigate: (route: string) => void;
}

export const PrivacyPage: React.FC<PrivacyPageProps> = ({ navigate }) => {
  useEffect(() => {
    updatePageSeo({
      title: 'Privacy Policy – AI Photo Studio | pic.amitjoshi.info.np',
      description: 'Privacy Policy for AI Photo Studio. Read how photos are processed locally on your device and how data is handled securely.',
      canonicalPath: '/privacy',
    });
  }, []);

  return (
    <div className="flex-1 bg-[#090d16] text-slate-100 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Privacy Policy</h1>
          <p className="mt-1 text-xs text-slate-500 font-mono">Last updated: October 2026 • pic.amitjoshi.info.np</p>
        </div>

        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-start gap-3 text-emerald-300">
          <ShieldCheck className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="block text-emerald-200">Local-First Processing Guarantee:</strong>
            Your uploaded photographs, layers, blemish brush strokes, and passport crops are processed directly in your device's browser memory. We do not store or inspect your private photos on central servers.
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">1. Local Storage &amp; IndexedDB</h2>
          <p>
            When you create projects, adjust lighting, or edit layers, project data is saved in your browser's private local IndexedDB. This data remains on your physical device. It is never automatically transmitted to third-party databases or marketing aggregators. Clearing your browser cache or site storage will remove this local data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">2. External AI &amp; Generative Services</h2>
          <p>
            Standard manual editing, cropping, sharpening, background removal, passport framing, and printing do not transmit your images to any external AI provider. If you explicitly choose to utilize remote generative AI tools (such as server-side Gemini image analysis), only the selected image part is transmitted securely over HTTPS for the sole purpose of generating your requested result, and is not used for unauthorized public model training.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">3. Google AdSense &amp; Advertising Disclosures</h2>
          <p>
            This website displays non-intrusive advertisements served by Google AdSense to sustain free editing access. Third-party vendors, including Google, use cookies to serve ads based on prior visits. Personal photographs, project names, and edited images are <strong>strictly quarantined</strong> and never shared with advertising partners.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">4. Contact &amp; Data Rights</h2>
          <p>
            For privacy inquiries or technical questions regarding data handling on <code>pic.amitjoshi.info.np</code>, contact:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-slate-400">
            <li>Email: <a href="mailto:support@amitjoshi.info.np" className="text-cyan-400 underline">support@amitjoshi.info.np</a></li>
            <li>WhatsApp: <a href="https://wa.me/9779746241860" target="_blank" rel="noopener noreferrer" className="text-emerald-400 underline">+977 9746241860</a></li>
          </ul>
        </section>
      </div>
    </div>
  );
};
