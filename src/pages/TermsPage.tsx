import React, { useEffect } from 'react';
import { updatePageSeo } from '../utils/seo';

interface TermsPageProps {
  navigate: (route: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ navigate }) => {
  useEffect(() => {
    updatePageSeo({
      title: 'Terms of Use – AI Photo Studio | pic.amitjoshi.info.np',
      description: 'Terms of Service for AI Photo Studio website and photo editing utilities.',
      canonicalPath: '/terms',
    });
  }, []);

  return (
    <div className="flex-1 bg-[#090d16] text-slate-100 py-10 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl space-y-8 text-xs sm:text-sm text-slate-300 leading-relaxed">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Terms of Use</h1>
          <p className="mt-1 text-xs text-slate-500 font-mono">Last updated: October 2026 • pic.amitjoshi.info.np</p>
        </div>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">1. Ownership &amp; User Content</h2>
          <p>
            You retain 100% intellectual property ownership of any images, graphics, portraits, or documents you load into AI Photo Studio. We claim no ownership, copyright, or licensing rights over your personal work.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">2. Passport &amp; Official Document Disclaimer</h2>
          <p>
            While our passport and visa photo presets are modeled directly after official guidelines (such as Nepal MRP/E-Passport 35×45mm, US Visa 2×2", Schengen 35×45mm, and ICAO standards), official document acceptance remains at the sole discretion of the issuing consular or government authority. You are advised to review current official consular specifications prior to formal submission.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">3. Acceptable Use</h2>
          <p>
            You agree not to utilize the service to generate defamatory, unlawful, deceptive, or non-consensual imagery.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-bold text-white">4. Contact Information</h2>
          <p>
            For legal inquiries, contact <a href="mailto:support@amitjoshi.info.np" className="text-cyan-400 underline">support@amitjoshi.info.np</a> or WhatsApp <a href="https://wa.me/9779746241860" className="text-emerald-400 underline">+977 9746241860</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
