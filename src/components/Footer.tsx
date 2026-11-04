import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageSquare, Linkedin, Globe, ArrowUpRight } from 'lucide-react';
import { SiteConfig } from '../types/portfolio';

interface FooterProps {
  siteConfig: SiteConfig;
  onOpenAdminModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ siteConfig, onOpenAdminModal }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-sm bg-neutral-100 flex items-center justify-center text-neutral-950 font-black text-sm tracking-tighter">
                CT
              </div>
              <span className="text-lg font-bold text-white tracking-tight">
                {siteConfig.company_name}
              </span>
            </div>
            
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              {siteConfig.company_description}
            </p>

            <div className="pt-2 text-xs text-neutral-300 font-mono">
              Tagline: <span className="text-neutral-400">{siteConfig.company_tagline}</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">
                  All Projects
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact & Inquiries
                </Link>
              </li>
              <li>
                <button
                  onClick={onOpenAdminModal}
                  className="hover:text-white transition-colors cursor-pointer text-left flex items-center gap-1 text-xs text-neutral-300"
                >
                  <span>Google Sheets Sync</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-neutral-300" />
                  <span className="truncate">{siteConfig.email}</span>
                </a>
              </li>
              <li>
                <a
                  href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`}
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Phone className="w-4 h-4 shrink-0 text-neutral-300" />
                  <span>{siteConfig.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <MessageSquare className="w-4 h-4 shrink-0 text-neutral-300" />
                  <span>WhatsApp Direct</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Linkedin className="w-4 h-4 shrink-0 text-neutral-300" />
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li>
                <a
                  href={siteConfig.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Globe className="w-4 h-4 shrink-0 text-neutral-300" />
                  <span>portfolio.codelessai.in</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-300">
          <div>
            © {currentYear} Codeless Technologies. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-neutral-300">
            <span>Production Host: GitHub Pages</span>
            <span>·</span>
            <span>Data: Google Sheets</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
