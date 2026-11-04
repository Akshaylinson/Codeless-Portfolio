import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Database } from 'lucide-react';

interface NavbarProps {
  onOpenAdminModal: () => void;
  isLiveApiConnected?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdminModal, isLiveApiConnected = false }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Projects', path: '/projects' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-neutral-950/85 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-18">
          
          {/* Zone 1: Single text element wordmark */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-white hover:text-neutral-200 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-400"
          >
            <div className="w-7 h-7 rounded-sm bg-neutral-100 flex items-center justify-center text-neutral-950 font-black text-sm tracking-tighter">
              CT
            </div>
            <span>Codeless Technologies</span>
          </Link>

          {/* Zone 2: 4–5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-300">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 ${
                  isActive(link.path)
                    ? 'text-white font-semibold border-b border-white'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            <button
              onClick={onOpenAdminModal}
              title="Google Sheets API & Admin Settings"
              className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer py-1 px-2 rounded border border-neutral-800 hover:border-neutral-700 whitespace-nowrap shrink-0"
            >
              <Database className="w-3.5 h-3.5" />
              <span>{isLiveApiConnected ? 'Sheets Live' : 'Sheet Sync'}</span>
            </button>
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-xs font-semibold text-neutral-950 bg-white rounded-md hover:bg-neutral-200 transition-colors whitespace-nowrap shrink-0"
            >
              Start a Project
            </Link>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-400 hover:text-white rounded focus:outline-none focus:ring-1 focus:ring-neutral-400"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-neutral-800 bg-neutral-950 px-4 pt-3 pb-6 space-y-3">
          <nav className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 text-sm rounded-md transition-colors ${
                  isActive(link.path)
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-300 hover:bg-neutral-900/50 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminModal();
              }}
              className="flex items-center justify-between px-3 py-2 text-sm text-neutral-400 hover:text-white hover:bg-neutral-900/50 rounded-md text-left"
            >
              <span className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Google Sheets Connection
              </span>
              <span className="text-xs text-neutral-400">{isLiveApiConnected ? 'Live' : 'Config'}</span>
            </button>
          </nav>

          <div className="pt-2">
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 text-xs font-semibold text-neutral-950 bg-white rounded-md hover:bg-neutral-200"
            >
              Start a Project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
