import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageSquare, Linkedin } from 'lucide-react';
import { SiteConfig } from '../types/portfolio';

interface FooterProps {
  siteConfig: SiteConfig;
}

export const Footer: React.FC<FooterProps> = ({ siteConfig }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 border-t border-neutral-800 text-neutral-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">

          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="text-lg font-bold text-white tracking-tight">
              Codeless
            </span>
            <p className="text-sm text-neutral-400 max-w-md leading-relaxed">
              {siteConfig.company_description}
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-white transition-colors">All Projects</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact & Inquiries</Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold tracking-wider uppercase text-neutral-200">
              Connect
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:hello@codelessai.in"
                  className="flex items-center gap-2 hover:text-white transition-colors"
                >
                  <Mail className="w-4 h-4 shrink-0 text-neutral-300" />
                  <span>hello@codelessai.in</span>
                </a>
              </li>
              {siteConfig.phone && (
                <li>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`}
                    className="flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 shrink-0 text-neutral-300" />
                    <span>{siteConfig.phone}</span>
                  </a>
                </li>
              )}
              {siteConfig.whatsapp && (
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
              )}
              {siteConfig.linkedin && (
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
              )}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900 text-xs text-neutral-500">
          © {currentYear} Codeless Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
