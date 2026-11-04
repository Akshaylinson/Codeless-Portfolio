import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Target, 
  Compass, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  Terminal,
  Zap,
  Globe
} from 'lucide-react';
import { SiteConfig } from '../types/portfolio';

interface AboutPageProps {
  siteConfig: SiteConfig;
}

export const AboutPage: React.FC<AboutPageProps> = ({ siteConfig }) => {
  const expertise = [
    "Artificial Intelligence and Machine Learning",
    "AI Voice Agents and Conversational AI",
    "Text-to-Speech and Speech-to-Text technologies",
    "Custom Software Development",
    "SaaS Product Development",
    "Web Application Development",
    "Mobile Application Development",
    "Business Process Automation",
    "Pharmaceutical Software and Quality Management Systems",
    "Intelligent Data and Analytics Solutions",
  ];

  const coreValues = [
    {
      title: "AI-First Problem Formulation",
      description: "Rather than treating AI as a buzzword or superficial wrapper, we engineer solutions where neural models, streaming inference, and intelligent heuristics are fundamental architectural components.",
    },
    {
      title: "Product-Driven Engineering",
      description: "Codeless Technologies builds and maintains proprietary platforms and internal products. This gives our engineering team firsthand experience with scale, uptime, telemetry, and continuous deployment.",
    },
    {
      title: "Pragmatic Business Outcomes",
      description: "We evaluate every line of code and architectural decision against measurable client outcomes: operational latency reductions, elimination of manual data bottlenecks, and verifiable compliance.",
    },
    {
      title: "Data Integrity & Regulatory Discipline",
      description: "From life sciences to enterprise financial workflows, our systems adhere strictly to rigorous security protocols, audit verification (e.g. 21 CFR Part 11), and cryptographic data integrity.",
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 space-y-20">
      
      {/* Header */}
      <div className="space-y-4 border-b border-neutral-800 pb-10">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          ABOUT CODELESS TECHNOLOGIES
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Building Intelligent <br />
          Digital Solutions.
        </h1>
        <p className="text-lg text-neutral-300 max-w-3xl leading-relaxed">
          {siteConfig.company_description}
        </p>
      </div>

      {/* Mission & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Mission */}
        <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-neutral-800 text-white">
              <Target className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Our Mission</h2>
          </div>
          <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
            To make intelligent technology accessible and practical, helping businesses innovate, automate, and grow.
          </p>
        </div>

        {/* Vision */}
        <div className="p-8 bg-neutral-900/50 border border-neutral-800 rounded-xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded bg-neutral-800 text-white">
              <Compass className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">Our Vision</h2>
          </div>
          <p className="text-neutral-300 leading-relaxed text-sm sm:text-base">
            To become a technology partner for businesses worldwide, driving innovation through AI, software, and intelligent automation.
          </p>
        </div>

      </div>

      {/* Narrative Section */}
      <div className="space-y-6 text-neutral-300 leading-relaxed">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          PHILOSOPHY & POSITIONING
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          An AI-First Technology Partner
        </h2>
        <p>
          Codeless Technologies is not merely a conventional web development agency. We empower forward-thinking organizations to embrace digital transformation by combining Artificial Intelligence, Machine Learning, modern software engineering, and automated execution pipelines to solve real-world operational challenges.
        </p>
        <p>
          Unlike service vendors who subcontract or outsource their technical stack, Codeless Technologies develops and operates its own proprietary technology platforms. This dual identity—as both a product company and an engineering consultancy—ensures our clients receive battle-tested architectures built on modern runtimes and verified production standards.
        </p>
      </div>

      {/* Areas of Expertise */}
      <div className="space-y-6 border-t border-neutral-800 pt-12">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          CORE DOMAINS
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Areas of Technical Expertise
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {expertise.map((item, idx) => (
            <div
              key={idx}
              className="p-4 bg-neutral-900/30 border border-neutral-800/80 rounded-lg flex items-center gap-3 text-sm font-medium text-neutral-200"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-neutral-400 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Guiding Principles */}
      <div className="space-y-6 border-t border-neutral-800 pt-12">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          ARCHITECTURAL FOUNDATIONS
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          How We Build Software
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coreValues.map((val, idx) => (
            <div key={idx} className="p-6 bg-neutral-900/50 border border-neutral-800 rounded-lg space-y-2">
              <h3 className="text-base font-bold text-white tracking-tight">
                {val.title}
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="p-8 sm:p-12 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-white">
            Ready to Build Your Next Intelligent Solution?
          </h3>
          <p className="text-sm text-neutral-400">
            Let's discuss how Codeless Technologies can engineer custom software for your organization.
          </p>
        </div>
        <Link
          to="/contact"
          className="px-6 py-3 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors shrink-0 inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <span>Get in Touch</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
};
