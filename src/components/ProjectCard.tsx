import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, ExternalLink, Github } from 'lucide-react';
import { Project } from '../types/portfolio';
import { SmartImage } from './SmartImage';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="group flex flex-col bg-neutral-900/60 border border-neutral-800/80 rounded-lg overflow-hidden hover:border-neutral-700 transition-all duration-300">
      
      {/* Thumbnail */}
      <Link 
        to={`/projects/${project.slug}`} 
        className="block relative overflow-hidden focus:outline-none"
        tabIndex={-1}
      >
        <SmartImage
          src={project.thumbnail_image}
          alt={project.project_name}
          fallbackTitle={project.project_name}
          aspectRatioClass="aspect-[16/10]"
          className="group-hover:scale-[1.02] transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-neutral-950/20 group-hover:bg-transparent transition-colors duration-300" />
      </Link>

      {/* Card Content */}
      <div className="flex flex-col flex-1 p-6 space-y-4">
        
        {/* Unboxed Metadata Line (Anti-Slop Zero Pill Discipline) */}
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-400">
          <span className="text-neutral-300 uppercase tracking-wider">{project.category}</span>
          <span aria-hidden="true">·</span>
          <span>{project.status}</span>
          {project.featured && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-neutral-200">Featured</span>
            </>
          )}
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-bold text-white group-hover:text-neutral-200 transition-colors">
            <Link 
              to={`/projects/${project.slug}`}
              className="focus-visible:outline-none focus-visible:underline flex items-center justify-between"
            >
              <span>{project.project_name}</span>
              <ArrowUpRight className="w-4 h-4 text-neutral-500 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </Link>
          </h3>
          <p className="text-xs font-medium text-neutral-400 line-clamp-1">
            {project.tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-neutral-300 line-clamp-2 leading-relaxed flex-1">
          {project.short_description}
        </p>

        {/* Technology tags: unboxed text with separators */}
        <div className="pt-2 border-t border-neutral-800/80">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-400 font-mono">
            {project.technologies.slice(0, 5).map((tech, idx) => (
              <React.Fragment key={tech}>
                <span>{tech}</span>
                {idx < Math.min(project.technologies.length, 5) - 1 && (
                  <span className="text-neutral-600" aria-hidden="true">/</span>
                )}
              </React.Fragment>
            ))}
            {project.technologies.length > 5 && (
              <span className="text-neutral-500">+{project.technologies.length - 5}</span>
            )}
          </div>
        </div>

        {/* Actions bar */}
        <div className="pt-2 flex items-center justify-between">
          <Link
            to={`/projects/${project.slug}`}
            className="text-xs font-semibold text-white hover:text-neutral-300 transition-colors inline-flex items-center gap-1"
          >
            <span>View Details</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                title="Live Demo"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label={`Live demo for ${project.project_name}`}
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub Repository"
                className="text-neutral-400 hover:text-white transition-colors"
                aria-label={`GitHub repository for ${project.project_name}`}
              >
                <Github className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

      </div>
    </article>
  );
};
