import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Cpu, Mic, Workflow, MessageSquare } from 'lucide-react';
import { Project, SiteConfig } from '../types/portfolio';
import { portfolioApi } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';
import { SmartImage } from '../components/SmartImage';
const HERO_IMAGE = '/src/assets/images/hero_ai_platform_1793785173723.jpg';

interface HomePageProps {
  siteConfig: SiteConfig;
}

export const HomePage: React.FC<HomePageProps> = ({ siteConfig }) => {
  const [featuredProjects, setFeaturedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    portfolioApi.getFeaturedProjects().then((data) => {
      if (mounted) {
        setFeaturedProjects(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);



  return (
    <div className="space-y-24 sm:space-y-32 pb-24">
      
      {/* =========================================================================
          SECTION B: HERO SECTION
          Split layout: Left typographic statement, Right high-impact 16:9 visual
          ========================================================================= */}
      <section className="relative pt-12 sm:pt-20 lg:pt-24 border-b border-neutral-900 pb-16 sm:pb-24 overflow-hidden">
        
        {/* Subtle background tech grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#27272a_1px,transparent_1px)] [background-size:24px_24px] opacity-25 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Typographic Hierarchy */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Unboxed Kicker */}
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-neutral-400">
                <span className="text-white">CODELESS TECHNOLOGIES</span>
                <span aria-hidden="true">/</span>
                <span>ENGINEERING INTELLIGENCE</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
                Engineering Intelligence. <br />
                <span className="text-neutral-400">Building What's Next.</span>
              </h1>

              {/* Lead copy */}
              <p className="text-base sm:text-lg text-neutral-300 max-w-2xl leading-relaxed">
                Codeless Technologies builds intelligent software, AI-powered platforms, and automation solutions that help businesses simplify operations and accelerate innovation.
              </p>

              {/* CTAs */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/projects"
                  className="px-6 py-3.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Our Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/contact"
                  className="px-6 py-3.5 text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
                >
                  Start a Project
                </Link>
              </div>

              {/* Quick Tech Highlights */}
              <div className="pt-6 border-t border-neutral-900/80 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-400 font-mono">
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <Cpu className="w-3.5 h-3.5" /> AI & Machine Learning
                </span>
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <Mic className="w-3.5 h-3.5" /> Conversational Speech
                </span>
                <span className="flex items-center gap-1.5 text-neutral-300">
                  <Workflow className="w-3.5 h-3.5" /> Process Automation
                </span>
              </div>

            </div>

            {/* Right Column: Hero Visual Container */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
                <SmartImage
                  src={HERO_IMAGE}
                  alt="Codeless Technologies AI Computing Architecture"
                  fallbackTitle="AI Architecture"
                  aspectRatioClass="aspect-[16/11]"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/80 via-transparent to-transparent pointer-events-none" />
                
                {/* Visual Label */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-neutral-300 pointer-events-none">
                  <span>NEURAL COMPUTE PLATFORM</span>
                  <span className="text-neutral-500">v2.4 CORE</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION C: FEATURED PROJECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="border-b border-neutral-800 pb-6">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400 mb-1">
            PORTFOLIO SHOWCASE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Featured Projects
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-xl">
            Production systems and proprietary software platforms engineered by Codeless Technologies.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-6 space-y-4 animate-pulse">
                <div className="w-full aspect-[16/10] bg-neutral-800 rounded" />
                <div className="h-4 w-1/3 bg-neutral-800 rounded" />
                <div className="h-6 w-3/4 bg-neutral-800 rounded" />
                <div className="h-4 w-full bg-neutral-800 rounded" />
              </div>
            ))}
          </div>
        ) : featuredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProjects.slice(0, 3).map((project) => (
              <ProjectCard key={project.project_id} project={project} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center border border-neutral-800 rounded-lg bg-neutral-900/30">
            <p className="text-sm text-neutral-400">No featured projects found.</p>
          </div>
        )}

        <div className="flex justify-center pt-2">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors"
          >
            <span>View All Projects</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>



      {/* =========================================================================
          SECTION E: ABOUT CODELESS TECHNOLOGIES OVERVIEW
          ========================================================================= */}
      <section className="bg-neutral-900/40 border-y border-neutral-800/80 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                COMPANY OVERVIEW
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white tracking-tight leading-snug">
                Pioneering practical, production-grade intelligence for modern enterprise.
              </h2>
              <p className="text-base text-neutral-300 leading-relaxed">
                Codeless Technologies is an AI-driven technology company developing intelligent applications, SaaS platforms, and custom software solutions. We combine modern engineering with practical AI to help businesses automate operations, solve complex challenges, and build scalable digital products.
              </p>
              <div>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-xs font-semibold text-white hover:text-neutral-300 transition-colors py-2 border-b border-white"
                >
                  <span>Learn More About Our Mission & Vision</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 bg-neutral-950 border border-neutral-800 rounded-lg space-y-4">
              <div className="text-xs font-mono uppercase text-neutral-400">Core Identity</div>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-neutral-400 block text-xs">Primary Industry:</span>
                  <span className="font-medium text-white">Artificial Intelligence, SaaS & Automation</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-xs">Engineering Model:</span>
                  <span className="font-medium text-white">Proprietary Products & Custom Software</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-xs">Global Domain:</span>
                  <a
                    href="https://codelessai.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-neutral-300 hover:text-white underline underline-offset-2 transition-colors"
                  >
                    codelessai.in
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>



      {/* =========================================================================
          SECTION G: PROJECT INQUIRY CTA
          ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl bg-neutral-900 border border-neutral-800 p-8 sm:p-12 lg:p-16 overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              INITIATE COLLABORATION
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Have an Idea? Let's Build It Together.
            </h2>
            
            <p className="text-base text-neutral-300 leading-relaxed">
              Looking to develop an AI-powered application, automate your business processes, or build a custom software solution? Let's discuss your requirements.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to="/contact"
                className="px-6 py-3.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors"
              >
                Start a Project
              </Link>

              <Link
                to="/contact?type=consultation"
                className="px-6 py-3.5 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
              >
                Request a Consultation
              </Link>

              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-600 rounded-md transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Connect on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
