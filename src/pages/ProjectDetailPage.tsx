import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  MessageSquare,
  Maximize2,
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Project, SiteConfig } from '../types/portfolio';
import { portfolioApi } from '../services/api';
import { SmartImage } from '../components/SmartImage';
import { Lightbox, LightboxItem } from '../components/Lightbox';
import { ProjectCard } from '../components/ProjectCard';

interface ProjectDetailPageProps {
  siteConfig: SiteConfig;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ siteConfig }) => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<Project | null>(null);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeMediaIndex, setActiveMediaIndex] = useState(0);

  useEffect(() => {
    if (!slug) {
      navigate('/404', { replace: true });
      return;
    }

    setLoading(true);
    let mounted = true;

    portfolioApi.getProjectBySlug(slug).then(async (result) => {
      if (!mounted) return;

      if (!result) {
        setProject(null);
        setLoading(false);
        return;
      }

      setProject(result);

      const allProjects = await portfolioApi.getProjects();
      if (mounted) {
        const related = allProjects
          .filter(p => p.slug !== result.slug && p.published)
          .filter(p => p.category === result.category || p.technologies?.some(t => result.technologies?.includes(t)))
          .slice(0, 3);
        setRelatedProjects(related);
        setLoading(false);
      }
    });

    return () => { mounted = false; };
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-8 animate-pulse">
        <div className="h-6 w-32 bg-neutral-800 rounded" />
        <div className="h-12 w-3/4 bg-neutral-800 rounded" />
        <div className="aspect-[16/9] w-full bg-neutral-800 rounded-lg" />
        <div className="space-y-4">
          <div className="h-4 w-full bg-neutral-800 rounded" />
          <div className="h-4 w-5/6 bg-neutral-800 rounded" />
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          RECORD NOT FOUND
        </div>
        <h1 className="text-3xl font-bold text-white">Project Not Found</h1>
        <p className="text-sm text-neutral-400">
          The requested project is unpublished or does not exist in the Google Sheets database.
        </p>
        <div className="pt-4">
          <Link
            to="/projects"
            className="px-6 py-2.5 text-xs font-semibold text-neutral-950 bg-white rounded-md hover:bg-neutral-200 transition-colors inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  // Build gallery from image_1/2/3 — only include non-empty URLs
  const galleryItems: LightboxItem[] = [
    project.image_1 ? { url: project.image_1, caption: project.image_1_caption } : null,
    project.image_2 ? { url: project.image_2, caption: project.image_2_caption } : null,
    project.image_3 ? { url: project.image_3, caption: project.image_3_caption } : null,
  ].filter((item): item is LightboxItem => item !== null && item.url.trim() !== '');

  const openLightbox = (index: number) => {
    setActiveMediaIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="space-y-16 sm:space-y-24 pb-24">

      {/* Top Back Navigation Bar */}
      <div className="border-b border-neutral-900 bg-neutral-950/50 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-xs font-mono text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Projects Directory</span>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-20">

        {/* SECTION A: PROJECT HERO */}
        <section className="space-y-8">

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-neutral-400">
            <span className="text-white uppercase tracking-wider">{project.category}</span>
            <span aria-hidden="true">·</span>
            <span>Status: {project.status}</span>
            {project.created_date && (
              <>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {project.created_date}
                </span>
              </>
            )}
            {project.featured && (
              <>
                <span aria-hidden="true">·</span>
                <span className="text-white">Featured Project</span>
              </>
            )}
          </div>

          {/* Title and Tagline */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              {project.project_name}
            </h1>
            <p className="text-lg sm:text-xl text-neutral-300 font-medium leading-relaxed max-w-3xl">
              {project.tagline}
            </p>
          </div>

          {/* Short Description */}
          <p className="text-base text-neutral-400 max-w-3xl leading-relaxed">
            {project.short_description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.live_url && project.live_url.trim() !== '' && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors inline-flex items-center gap-2"
              >
                <span>Live Demo</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {project.github_url && project.github_url.trim() !== '' && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800 rounded-md transition-colors inline-flex items-center gap-2"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            )}
            <Link
              to="/contact"
              className="px-4 py-2.5 text-xs text-neutral-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Inquire About Similar Architecture</span>
            </Link>
          </div>

          {/* Cover Image */}
          <div className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl">
            <SmartImage
              src={project.cover_image || project.thumbnail_image}
              alt={project.project_name}
              fallbackTitle={project.project_name}
              aspectRatioClass="aspect-[16/9]"
              className="w-full h-full object-cover"
            />
          </div>
        </section>

        {/* SECTION B: TECHNOLOGY STACK */}
        <section className="space-y-4 border-t border-neutral-800 pt-8">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            TECHNOLOGY STACK
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {project.technologies?.map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 rounded text-xs font-mono text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* SECTION C: PROJECT OVERVIEW */}
        <section className="space-y-4 border-t border-neutral-800 pt-8">
          <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
            01. PROJECT OVERVIEW
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            System Architecture & Scope
          </h2>
          <p className="text-base text-neutral-300 leading-relaxed">
            {project.full_description}
          </p>
        </section>

        {/* SECTION D: SCREENSHOTS & GALLERY */}
        {galleryItems.length > 0 && (
          <section className="space-y-6 border-t border-neutral-800 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  02. MEDIA & INTERFACES
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Screenshots & Media Gallery
                </h2>
              </div>
              <span className="text-xs font-mono text-neutral-500">
                Click any image to expand
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {galleryItems.map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightbox(idx)}
                  className="group relative cursor-pointer overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 hover:border-neutral-600 transition-all duration-300"
                >
                  <SmartImage
                    src={item.url}
                    alt={item.caption || `${project.project_name} screenshot ${idx + 1}`}
                    fallbackTitle={item.caption || project.project_name}
                    aspectRatioClass="aspect-[16/10]"
                    className="group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="p-3 bg-neutral-950/80 rounded-full text-white border border-neutral-700">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                  {item.caption && (
                    <div className="p-3 border-t border-neutral-800/80 bg-neutral-950 text-xs text-neutral-300">
                      {item.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION E: RELATED PROJECTS */}
        {relatedProjects.length > 0 && (
          <section className="space-y-6 border-t border-neutral-800 pt-12">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
                  SYSTEM DIRECTORY
                </div>
                <h2 className="text-2xl font-bold text-white tracking-tight">
                  Related Projects
                </h2>
              </div>
              <Link
                to="/projects"
                className="text-xs font-semibold text-white hover:text-neutral-300 inline-flex items-center gap-1"
              >
                <span>View All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((rel) => (
                <ProjectCard key={rel.project_id} project={rel} />
              ))}
            </div>
          </section>
        )}

        {/* SECTION F: INQUIRY CTA */}
        <section className="pt-8">
          <div className="p-8 sm:p-12 rounded-xl bg-neutral-900 border border-neutral-800 space-y-6">
            <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
              COLLABORATIVE ENGINEERING
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Interested in Building Something Similar?
            </h3>
            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl leading-relaxed">
              {siteConfig.contact_cta_text || "Let's discuss how Codeless Technologies can help bring your next technology project to life."}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={`/contact?subject=Inquiry%20regarding%20${encodeURIComponent(project.project_name)}`}
                className="px-6 py-3 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors"
              >
                Discuss Your Project
              </Link>
              <Link
                to="/contact?type=consultation"
                className="px-6 py-3 text-xs font-semibold text-white bg-neutral-800 hover:bg-neutral-700 rounded-md transition-colors"
              >
                Request Consultation
              </Link>
              <a
                href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hi Codeless Technologies, I saw ${project.project_name} on your portfolio and would like to discuss a similar project.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 text-xs font-semibold text-neutral-300 hover:text-white border border-neutral-700 hover:border-neutral-600 rounded-md transition-colors inline-flex items-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </section>

      </div>

      <Lightbox
        items={galleryItems}
        currentIndex={activeMediaIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onIndexChange={setActiveMediaIndex}
      />

    </div>
  );
};
