import { Project, ProjectDetail, ProjectMedia, SiteConfig, ApiResponse } from '../types/portfolio';
import { 
  INITIAL_PROJECTS, 
  INITIAL_PROJECT_DETAILS, 
  INITIAL_PROJECT_MEDIA, 
  INITIAL_SITE_CONFIG 
} from './mockData';

const CACHE_KEY_PROJECTS = 'codeless_cache_projects_v1';
const CACHE_KEY_SITE = 'codeless_cache_site_v1';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes cache

const STORAGE_KEY_API_URL = 'codeless_google_script_api_url';

interface CacheEnvelope<T> {
  timestamp: number;
  data: T;
}

class PortfolioApiService {
  private inMemoryProjects: Project[] | null = null;
  private inMemoryDetails: Map<string, ProjectDetail[]> = new Map();
  private inMemoryMedia: Map<string, ProjectMedia[]> = new Map();
  private inMemorySite: SiteConfig | null = null;
  private lastFetchTimestamp: number = 0;
  private activeSource: 'live' | 'fallback' = 'fallback';

  public getApiUrl(): string {
    const customUrl = localStorage.getItem(STORAGE_KEY_API_URL);
    if (customUrl && customUrl.trim()) {
      return customUrl.trim();
    }
    const envUrl = (import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string) || '';
    return envUrl.trim();
  }

  public setCustomApiUrl(url: string): void {
    if (!url || !url.trim()) {
      localStorage.removeItem(STORAGE_KEY_API_URL);
    } else {
      localStorage.setItem(STORAGE_KEY_API_URL, url.trim());
    }
    this.clearCache();
  }

  public clearCache(): void {
    this.inMemoryProjects = null;
    this.inMemoryDetails.clear();
    this.inMemoryMedia.clear();
    this.inMemorySite = null;
    this.lastFetchTimestamp = 0;
    try {
      localStorage.removeItem(CACHE_KEY_PROJECTS);
      localStorage.removeItem(CACHE_KEY_SITE);
    } catch {
      // ignore
    }
  }

  public getStatus() {
    const url = this.getApiUrl();
    return {
      isConfigured: Boolean(url),
      url,
      lastFetched: this.lastFetchTimestamp ? new Date(this.lastFetchTimestamp) : null,
      source: this.activeSource,
    };
  }

  /**
   * Fetch site configuration
   */
  public async getSiteConfig(forceRefresh: boolean = false): Promise<SiteConfig> {
    if (!forceRefresh && this.inMemorySite) {
      return this.inMemorySite;
    }

    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      this.inMemorySite = INITIAL_SITE_CONFIG;
      this.activeSource = 'fallback';
      return INITIAL_SITE_CONFIG;
    }

    try {
      const separator = apiUrl.includes('?') ? '&' : '?';
      const targetUrl = `${apiUrl}${separator}action=site&t=${Date.now()}`;
      const res = await fetch(targetUrl, { method: 'GET' });

      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: ApiResponse<SiteConfig> = await res.json();

      if (json.success && json.site) {
        const merged: SiteConfig = {
          ...INITIAL_SITE_CONFIG,
          ...json.site,
        };
        this.inMemorySite = merged;
        this.activeSource = 'live';
        return merged;
      }
      throw new Error(json.error || 'Invalid site config response');
    } catch (err) {
      console.warn('[Portfolio API] Failed to fetch live site config from Google Sheets, using seed data:', err);
      this.inMemorySite = INITIAL_SITE_CONFIG;
      this.activeSource = 'fallback';
      return INITIAL_SITE_CONFIG;
    }
  }

  /**
   * Fetch all published projects
   */
  public async getProjects(forceRefresh: boolean = false): Promise<Project[]> {
    const now = Date.now();
    if (!forceRefresh && this.inMemoryProjects && (now - this.lastFetchTimestamp < CACHE_TTL_MS)) {
      return this.inMemoryProjects;
    }

    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      this.inMemoryProjects = INITIAL_PROJECTS.filter(p => p.published);
      this.lastFetchTimestamp = now;
      this.activeSource = 'fallback';
      return this.inMemoryProjects;
    }

    try {
      const separator = apiUrl.includes('?') ? '&' : '?';
      const targetUrl = `${apiUrl}${separator}action=projects&t=${now}`;
      const res = await fetch(targetUrl, { method: 'GET' });

      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const json: ApiResponse<Project[]> = await res.json();

      if (json.success && Array.isArray(json.projects)) {
        // Normalize projects
        const cleaned: Project[] = json.projects
          .filter(p => p.published !== false && String(p.published).toLowerCase() !== 'false')
          .map(p => ({
            ...p,
            technologies: Array.isArray(p.technologies) 
              ? p.technologies 
              : String(p.technologies || '').split(',').map(t => t.trim()).filter(Boolean),
            featured: p.featured === true || String(p.featured).toLowerCase() === 'true',
            published: true,
            sort_order: Number(p.sort_order) || 999,
          }))
          .sort((a, b) => a.sort_order - b.sort_order);

        this.inMemoryProjects = cleaned;
        this.lastFetchTimestamp = now;
        this.activeSource = 'live';
        return cleaned;
      }

      throw new Error(json.error || 'Invalid projects payload structure');
    } catch (err) {
      console.warn('[Portfolio API] Failed to fetch live projects from Google Sheets, using bundled seed data:', err);
      this.inMemoryProjects = INITIAL_PROJECTS.filter(p => p.published);
      this.lastFetchTimestamp = now;
      this.activeSource = 'fallback';
      return this.inMemoryProjects;
    }
  }

  /**
   * Fetch featured projects for Homepage
   */
  public async getFeaturedProjects(forceRefresh: boolean = false): Promise<Project[]> {
    const all = await this.getProjects(forceRefresh);
    const featured = all.filter(p => p.featured && p.published);
    return featured.length > 0 ? featured : all.slice(0, 3);
  }

  /**
   * Fetch project by slug with associated details and media
   */
  public async getProjectBySlug(slug: string, forceRefresh: boolean = false): Promise<{
    project: Project;
    details: ProjectDetail[];
    media: ProjectMedia[];
  } | null> {
    const projects = await this.getProjects(forceRefresh);
    const matched = projects.find(p => p.slug.toLowerCase() === slug.toLowerCase());

    if (!matched) {
      return null;
    }

    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      const details = INITIAL_PROJECT_DETAILS
        .filter(d => d.project_id === matched.project_id)
        .sort((a, b) => a.sort_order - b.sort_order);

      const media = INITIAL_PROJECT_MEDIA
        .filter(m => m.project_id === matched.project_id)
        .sort((a, b) => a.sort_order - b.sort_order);

      return {
        project: matched,
        details,
        media,
      };
    }

    try {
      const separator = apiUrl.includes('?') ? '&' : '?';
      const targetUrl = `${apiUrl}${separator}action=project&slug=${encodeURIComponent(slug)}&t=${Date.now()}`;
      const res = await fetch(targetUrl, { method: 'GET' });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json: ApiResponse<any> = await res.json();

      if (json.success && json.project) {
        const details = Array.isArray(json.details) 
          ? json.details.sort((a: ProjectDetail, b: ProjectDetail) => a.sort_order - b.sort_order)
          : [];
        const media = Array.isArray(json.media)
          ? json.media.sort((a: ProjectMedia, b: ProjectMedia) => a.sort_order - b.sort_order)
          : [];

        return {
          project: {
            ...json.project,
            technologies: Array.isArray(json.project.technologies)
              ? json.project.technologies
              : String(json.project.technologies || '').split(',').map((t: string) => t.trim()).filter(Boolean),
          },
          details,
          media,
        };
      }
      throw new Error('Project details not returned from script');
    } catch (err) {
      console.warn(`[Portfolio API] Failed to fetch dynamic details for ${slug}, falling back to initial data:`, err);
      const details = INITIAL_PROJECT_DETAILS
        .filter(d => d.project_id === matched.project_id)
        .sort((a, b) => a.sort_order - b.sort_order);

      const media = INITIAL_PROJECT_MEDIA
        .filter(m => m.project_id === matched.project_id)
        .sort((a, b) => a.sort_order - b.sort_order);

      return {
        project: matched,
        details,
        media,
      };
    }
  }

  public async getProjectDetails(projectId: string): Promise<ProjectDetail[]> {
    return INITIAL_PROJECT_DETAILS
      .filter(d => d.project_id === projectId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }

  public async getProjectMedia(projectId: string): Promise<ProjectMedia[]> {
    return INITIAL_PROJECT_MEDIA
      .filter(m => m.project_id === projectId)
      .sort((a, b) => a.sort_order - b.sort_order);
  }
}

export const portfolioApi = new PortfolioApiService();
