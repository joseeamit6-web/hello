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

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
      setCurrentPath(path);
      window.scrollTo(0, 0);
    }
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
