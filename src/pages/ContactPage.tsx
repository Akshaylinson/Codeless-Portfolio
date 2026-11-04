import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Mail, Phone, MessageSquare, Linkedin, Globe, CheckCircle2, Send, ArrowRight } from 'lucide-react';
import { SiteConfig } from '../types/portfolio';

interface ContactPageProps {
  siteConfig: SiteConfig;
}

export const ContactPage: React.FC<ContactPageProps> = ({ siteConfig }) => {
  const [searchParams] = useSearchParams();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [projectType, setProjectType] = useState('AI & Machine Learning');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const subjectParam = searchParams.get('subject');
    const typeParam = searchParams.get('type');
    if (subjectParam) {
      setMessage(`Hello Codeless Technologies,\n\nI am reaching out regarding: ${subjectParam}.\n\nProject Requirements: `);
    } else if (typeParam === 'consultation') {
      setMessage(`Hello Codeless Technologies,\n\nI would like to request an engineering consultation regarding our architecture.`);
    }
  }, [searchParams]);

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!fullName.trim()) errs.fullName = 'Please enter your name.';
    if (!email.trim()) {
      errs.email = 'Please provide your email address.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Please provide a valid email format (e.g. name@domain.com).';
    }
    if (!message.trim()) errs.message = 'Please provide brief details about your inquiry.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    // Simulate real submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-16">
      
      {/* Page Header */}
      <div className="space-y-4 border-b border-neutral-800 pb-10">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          INITIATE DIALOGUE
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Let's Build Something <br />
          Intelligent Together.
        </h1>
        <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
          {siteConfig.contact_cta_text || "Looking to develop an AI-powered application, automate your business processes, or build a custom software solution? Let's discuss your requirements."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* Left Column: Inquiry Form */}
        <div className="lg:col-span-7 bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 sm:p-8">
          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 bg-neutral-800 text-white rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Inquiry Received</h2>
              <p className="text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                Thank you for contacting Codeless Technologies. Our engineering team has received your message and will follow up at <span className="font-semibold text-white">{email}</span> within 24 hours.
              </p>
              <div className="pt-4">
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setMessage('');
                  }}
                  className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-xl font-bold text-white tracking-tight">Project Inquiry Form</h2>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jane Doe"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                  {errors.fullName && <p className="text-xs text-rose-400">{errors.fullName}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Business Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="jane@company.com"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                  {errors.email && <p className="text-xs text-rose-400">{errors.email}</p>}
                </div>
              </div>

              {/* Organization & Project Type */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Organization / Company
                  </label>
                  <input
                    type="text"
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    placeholder="Acme Corp"
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                    Project Type
                  </label>
                  <select
                    value={projectType}
                    onChange={(e) => setProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-white focus:outline-none focus:border-neutral-600"
                  >
                    <option value="AI & Machine Learning">AI & Machine Learning</option>
                    <option value="AI Voice Agents & TTS">AI Voice Agents & TTS</option>
                    <option value="Custom Software Development">Custom Software Development</option>
                    <option value="SaaS Product Engineering">SaaS Product Engineering</option>
                    <option value="Business Process Automation">Business Process Automation</option>
                    <option value="Pharmaceutical Software / QMS">Pharmaceutical Software / QMS</option>
                    <option value="Other Technology Architecture">Other Technology Architecture</option>
                  </select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Project Description & Goals <span className="text-rose-400">*</span>
                </label>
                <textarea
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Outline your technical requirements, expected timelines, and system integration needs..."
                  className="w-full px-3.5 py-2.5 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
                />
                {errors.message && <p className="text-xs text-rose-400">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-3 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Submitting...' : 'Submit Inquiry'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Right Column: Direct Channels */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="p-6 bg-neutral-900/30 border border-neutral-800 rounded-xl space-y-6">
            <h3 className="text-lg font-bold text-white tracking-tight">Direct Channels</h3>
            
            <div className="space-y-4 text-sm">
              <a
                href={`mailto:${siteConfig.email}`}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-850 transition-colors border border-transparent hover:border-neutral-800"
              >
                <Mail className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono uppercase text-neutral-400">Email Inquiries</div>
                  <div className="font-semibold text-white">{siteConfig.email}</div>
                </div>
              </a>

              <a
                href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-850 transition-colors border border-transparent hover:border-neutral-800"
              >
                <Phone className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono uppercase text-neutral-400">Telephone</div>
                  <div className="font-semibold text-white">{siteConfig.phone}</div>
                </div>
              </a>

              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent("Hello Codeless Technologies, I would like to inquire about an engineering project.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/40 hover:border-emerald-800/80 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono uppercase text-emerald-400">WhatsApp Direct</div>
                  <div className="font-semibold text-white">Instant Chat with Engineering</div>
                </div>
              </a>

              <a
                href={siteConfig.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-850 transition-colors border border-transparent hover:border-neutral-800"
              >
                <Linkedin className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono uppercase text-neutral-400">LinkedIn</div>
                  <div className="font-semibold text-white">Codeless Technologies</div>
                </div>
              </a>

              <a
                href={siteConfig.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-850 transition-colors border border-transparent hover:border-neutral-800"
              >
                <Globe className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-mono uppercase text-neutral-400">Official Production Domain</div>
                  <div className="font-semibold text-white font-mono text-xs">https://portfolio.codelessai.in</div>
                </div>
              </a>
            </div>
          </div>

          <div className="p-6 bg-neutral-950 border border-neutral-800 rounded-xl space-y-3 text-xs text-neutral-400">
            <h4 className="font-semibold text-neutral-200">Response Guarantee:</h4>
            <p className="leading-relaxed">
              Every inbound inquiry is reviewed by technical leadership, ensuring immediate, actionable architectural feedback without bureaucratic sales friction.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
