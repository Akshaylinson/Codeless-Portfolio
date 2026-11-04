import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { SiteConfig } from './types/portfolio';
import { portfolioApi } from './services/api';
import { INITIAL_SITE_CONFIG } from './services/mockData';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminApiModal } from './components/AdminApiModal';
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Helper component to scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [siteConfig, setSiteConfig] = useState<SiteConfig>(INITIAL_SITE_CONFIG);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [apiStatus, setApiStatus] = useState(portfolioApi.getStatus());

  const refreshSiteData = async () => {
    const config = await portfolioApi.getSiteConfig();
    setSiteConfig(config);
    setApiStatus(portfolioApi.getStatus());
  };

  useEffect(() => {
    refreshSiteData();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen flex flex-col bg-neutral-950 text-neutral-100 selection:bg-neutral-800 selection:text-white">
        
        {/* Navigation Bar */}
        <Navbar
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
          isLiveApiConnected={apiStatus.isConfigured}
        />

        {/* Main Content Area */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage siteConfig={siteConfig} />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailPage siteConfig={siteConfig} />} />
            <Route path="/about" element={<AboutPage siteConfig={siteConfig} />} />
            <Route path="/contact" element={<ContactPage siteConfig={siteConfig} />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer
          siteConfig={siteConfig}
          onOpenAdminModal={() => setIsAdminModalOpen(true)}
        />

        {/* Admin API & Google Sheets Configuration Modal */}
        <AdminApiModal
          isOpen={isAdminModalOpen}
          onClose={() => setIsAdminModalOpen(false)}
          onDataRefreshed={refreshSiteData}
        />

      </div>
    </BrowserRouter>
  );
}
