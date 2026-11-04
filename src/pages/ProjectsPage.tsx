import React, { useEffect, useState, useMemo } from 'react';
import { Search, Filter, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Project } from '../types/portfolio';
import { portfolioApi } from '../services/api';
import { ProjectCard } from '../components/ProjectCard';

type SortOption = 'newest' | 'oldest' | 'featured' | 'alpha';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedTech, setSelectedTech] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    let mounted = true;
    portfolioApi.getProjects().then((data) => {
      if (mounted) {
        setProjects(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Dynamically extract distinct categories from fetched published projects
  const availableCategories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  // Dynamically extract distinct technologies from fetched published projects
  const availableTechnologies = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      p.technologies?.forEach((t) => {
        if (t) set.add(t.trim());
      });
    });
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  // Dynamically extract distinct statuses from fetched published projects
  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => {
      if (p.status) set.add(p.status.trim());
    });
    return ['All', ...Array.from(set).sort()];
  }, [projects]);

  // Filter and Sort projects
  const filteredProjects = useMemo(() => {
    let list = [...projects];

    // Search query across name, short desc, full desc, category, technologies
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((p) => {
        const nameMatch = p.project_name?.toLowerCase().includes(q);
        const taglineMatch = p.tagline?.toLowerCase().includes(q);
        const shortMatch = p.short_description?.toLowerCase().includes(q);
        const fullMatch = p.full_description?.toLowerCase().includes(q);
        const catMatch = p.category?.toLowerCase().includes(q);
        const techMatch = p.technologies?.some((t) => t.toLowerCase().includes(q));
        return nameMatch || taglineMatch || shortMatch || fullMatch || catMatch || techMatch;
      });
    }

    // Category filter
    if (selectedCategory !== 'All') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    // Technology filter
    if (selectedTech !== 'All') {
      list = list.filter((p) => p.technologies?.includes(selectedTech));
    }

    // Status filter
    if (selectedStatus !== 'All') {
      list = list.filter((p) => p.status === selectedStatus);
    }

    // Sorting
    switch (sortBy) {
      case 'newest':
        list.sort((a, b) => new Date(b.created_date).getTime() - new Date(a.created_date).getTime());
        break;
      case 'oldest':
        list.sort((a, b) => new Date(a.created_date).getTime() - new Date(b.created_date).getTime());
        break;
      case 'alpha':
        list.sort((a, b) => a.project_name.localeCompare(b.project_name));
        break;
      case 'featured':
      default:
        list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return (a.sort_order || 999) - (b.sort_order || 999);
        });
        break;
    }

    return list;
  }, [projects, searchQuery, selectedCategory, selectedTech, selectedStatus, sortBy]);

  const hasActiveFilters = 
    searchQuery.trim() !== '' || 
    selectedCategory !== 'All' || 
    selectedTech !== 'All' || 
    selectedStatus !== 'All' ||
    sortBy !== 'featured';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedTech('All');
    setSelectedStatus('All');
    setSortBy('featured');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-neutral-800 pb-8">
        <div className="text-xs font-mono uppercase tracking-widest text-neutral-400">
          SYSTEM REPOSITORY
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Our Projects
        </h1>
        <p className="text-base text-neutral-400 max-w-2xl">
          Explore the products, platforms, and intelligent solutions engineered by Codeless Technologies.
        </p>
      </div>

      {/* Control Bar: Search & Mobile Filter Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects, categories, or technologies..."
            className="w-full pl-10 pr-10 py-2.5 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Desktop Sorting & Filter Count */}
        <div className="flex items-center gap-3">
          
          {/* Sorting */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-400 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-neutral-900 border border-neutral-800 rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-neutral-600"
            >
              <option value="featured">Featured First</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="alpha">Alphabetical</option>
            </select>
          </div>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-xs text-white"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters</span>
          </button>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1.5 px-3 py-2 text-xs text-neutral-400 hover:text-white bg-neutral-900/60 border border-neutral-800 rounded-md transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          )}

        </div>

      </div>

      {/* Filter Options (Desktop and Toggleable Mobile) */}
      <div className={`space-y-4 pt-2 border-t border-neutral-800/60 ${showMobileFilters ? 'block' : 'hidden md:block'}`}>
        
        {/* Category Segmented Buttons */}
        <div className="space-y-2">
          <div className="text-xs font-mono uppercase text-neutral-400">Category:</div>
          <div className="flex flex-wrap items-center gap-1.5">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  selectedCategory === cat
                    ? 'bg-white text-neutral-950 font-semibold shadow-sm'
                    : 'bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Technology & Status Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-4 pt-2 text-xs">
          
          {/* Tech Filter */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-mono">Tech:</span>
            <select
              value={selectedTech}
              onChange={(e) => setSelectedTech(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
            >
              {availableTechnologies.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 font-mono">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-neutral-900 border border-neutral-800 rounded-md px-3 py-1.5 text-xs text-white focus:outline-none focus:border-neutral-600"
            >
              {availableStatuses.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Project count indicator */}
          <div className="ml-auto text-xs font-mono text-neutral-400 tabular-nums">
            Showing {filteredProjects.length} of {projects.length} published project{projects.length !== 1 ? 's' : ''}
          </div>

        </div>

      </div>

      {/* Grid of Projects */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-neutral-900/60 border border-neutral-800 rounded-lg p-6 space-y-4 animate-pulse">
              <div className="w-full aspect-[16/10] bg-neutral-800 rounded" />
              <div className="h-4 w-1/3 bg-neutral-800 rounded" />
              <div className="h-6 w-3/4 bg-neutral-800 rounded" />
              <div className="h-4 w-full bg-neutral-800 rounded" />
            </div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.project_id} project={project} />
          ))}
        </div>
      ) : (
        <div className="p-16 text-center border border-neutral-800 rounded-lg bg-neutral-900/30 space-y-4">
          <p className="text-base text-neutral-300 font-medium">No projects match the selected filters.</p>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search query, or clear active category and technology filters.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-white hover:bg-neutral-200 rounded-md transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}

    </div>
  );
};
