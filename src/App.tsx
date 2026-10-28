/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ProjectProvider } from './context/ProjectContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { EditorPage } from './pages/EditorPage';
import { EnhancePage } from './pages/EnhancePage';
import { RetouchPage } from './pages/RetouchPage';
import { HeadStraightenerPage } from './pages/HeadStraightenerPage';
import { OutfitStudioPage } from './pages/OutfitStudioPage';
import { BackgroundPage } from './pages/BackgroundPage';
import { PassportPhotoPage } from './pages/PassportPhotoPage';
import { PrintStudioPage } from './pages/PrintStudioPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { HelpPage } from './pages/HelpPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { NotFoundPage } from './pages/NotFoundPage';

const KNOWN_ROUTES = [
  '/editor',
  '/enhance',
  '/retouch',
  '/head-straightener',
  '/outfit-studio',
  '/background',
  '/passport-photo',
  '/print-studio',
  '/projects',
  '/help',
  '/privacy',
  '/terms',
];

function getNormalizedRoute(): string {
  // 1. Check hash first: e.g. "#/passport-photo"
  if (window.location.hash) {
    const rawHash = window.location.hash.replace(/^#/, '');
    const cleanHash = rawHash.startsWith('/') ? rawHash : '/' + rawHash;
    const matched = KNOWN_ROUTES.find((r) => cleanHash === r || cleanHash.startsWith(r + '/'));
    if (matched) return matched;
    if (cleanHash === '/' || cleanHash === '') return '/';
  }

  // 2. Check query param ?p= (from GitHub Pages 404.html redirect)
  const params = new URLSearchParams(window.location.search);
  const p = params.get('p');
  if (p) {
    const matched = KNOWN_ROUTES.find((r) => p.endsWith(r) || p.startsWith(r));
    if (matched) return matched;
  }

  // 3. Check window.location.pathname (strip any repo prefix)
  const path = window.location.pathname || '/';
  for (const r of KNOWN_ROUTES) {
    if (path.endsWith(r)) return r;
  }

  return '/';
}

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return getNormalizedRoute();
  });

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(getNormalizedRoute());
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigate = (path: string) => {
    // Sync hash for GitHub Pages compatibility and trigger update
    window.location.hash = path;
    setCurrentPath(path);
    window.scrollTo(0, 0);
  };

  const renderCurrentPage = () => {
    const cleanPath = currentPath.replace(/\/+$/, '') || '/';

    switch (cleanPath) {
      case '/':
        return <HomePage navigate={navigate} />;
      case '/editor':
        return <EditorPage navigate={navigate} />;
      case '/enhance':
        return <EnhancePage navigate={navigate} />;
      case '/retouch':
        return <RetouchPage navigate={navigate} />;
      case '/head-straightener':
        return <HeadStraightenerPage navigate={navigate} />;
      case '/outfit-studio':
        return <OutfitStudioPage navigate={navigate} />;
      case '/background':
        return <BackgroundPage navigate={navigate} />;
      case '/passport-photo':
        return <PassportPhotoPage navigate={navigate} />;
      case '/print-studio':
        return <PrintStudioPage navigate={navigate} />;
      case '/projects':
        return <ProjectsPage navigate={navigate} />;
      case '/help':
        return <HelpPage navigate={navigate} />;
      case '/privacy':
        return <PrivacyPage navigate={navigate} />;
      case '/terms':
        return <TermsPage navigate={navigate} />;
      default:
        return <NotFoundPage navigate={navigate} />;
    }
  };

  return (
    <ProjectProvider>
      <div className="min-h-screen flex flex-col bg-[#090d16] text-slate-100">
        <Header currentRoute={currentPath} navigate={navigate} />
        <main className="flex-1 flex flex-col">
          {renderCurrentPage()}
        </main>
        {/* Do not show standard footer on the full editor screen to maximize canvas space */}
        {currentPath !== '/editor' && <Footer navigate={navigate} />}
      </div>
    </ProjectProvider>
  );
}
