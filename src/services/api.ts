import { Project, SiteConfig, ApiResponse } from '../types/portfolio';
import { INITIAL_PROJECTS, INITIAL_SITE_CONFIG } from './mockData';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const STORAGE_KEY_API_URL = 'codeless_google_script_api_url';
const CACHE_KEY_PROJECTS = 'codeless_cache_projects_v1';
const CACHE_KEY_SITE = 'codeless_cache_site_v1';

class PortfolioApiService {
  private inMemoryProjects: Project[] | null = null;
  private inMemorySite: SiteConfig | null = null;
  private lastFetchTimestamp: number = 0;
  private activeSource: 'live' | 'fallback' = 'fallback';

  public getApiUrl(): string {
    const customUrl = localStorage.getItem(STORAGE_KEY_API_URL);
    if (customUrl && customUrl.trim()) return customUrl.trim();
    return ((import.meta.env.VITE_GOOGLE_APPS_SCRIPT_URL as string) || '').trim();
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
    this.inMemorySite = null;
    this.lastFetchTimestamp = 0;
    try {
      localStorage.removeItem(CACHE_KEY_PROJECTS);
      localStorage.removeItem(CACHE_KEY_SITE);
    } catch { /* ignore */ }
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

  public async getSiteConfig(forceRefresh = false): Promise<SiteConfig> {
    if (!forceRefresh && this.inMemorySite) return this.inMemorySite;

    const apiUrl = this.getApiUrl();
    if (!apiUrl) {
      this.inMemorySite = INITIAL_SITE_CONFIG;
      this.activeSource = 'fallback';
      return INITIAL_SITE_CONFIG;
    }

    try {
      const sep = apiUrl.includes('?') ? '&' : '?';
      const res = await fetch(`${apiUrl}${sep}action=site&t=${Date.now()}`, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const json: ApiResponse<SiteConfig> = await res.json();
      if (json.success && json.site) {
        const merged: SiteConfig = { ...INITIAL_SITE_CONFIG, ...json.site };
        this.inMemorySite = merged;
        this.activeSource = 'live';
        return merged;
      }
      throw new Error(json.error || 'Invalid site config response');
    } catch (err) {
      console.warn('[Portfolio API] Failed to fetch site config, using seed data:', err);
      this.inMemorySite = INITIAL_SITE_CONFIG;
      this.activeSource = 'fallback';
      return INITIAL_SITE_CONFIG;
    }
  }

  public async getProjects(forceRefresh = false): Promise<Project[]> {
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
      const sep = apiUrl.includes('?') ? '&' : '?';
      const res = await fetch(`${apiUrl}${sep}action=projects&t=${now}`, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP status ${res.status}`);
      const json: ApiResponse<Project[]> = await res.json();

      if (json.success && Array.isArray(json.projects)) {
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
      throw new Error(json.error || 'Invalid projects payload');
    } catch (err) {
      console.warn('[Portfolio API] Failed to fetch live projects, using seed data:', err);
      this.inMemoryProjects = INITIAL_PROJECTS.filter(p => p.published);
      this.lastFetchTimestamp = now;
      this.activeSource = 'fallback';
      return this.inMemoryProjects;
    }
  }

  public async getFeaturedProjects(forceRefresh = false): Promise<Project[]> {
    const all = await this.getProjects(forceRefresh);
    const featured = all.filter(p => p.featured && p.published);
    return featured.length > 0 ? featured : all.slice(0, 3);
  }

  public async getProjectBySlug(slug: string, forceRefresh = false): Promise<Project | null> {
    const projects = await this.getProjects(forceRefresh);
    return projects.find(p => p.slug.toLowerCase() === slug.toLowerCase()) ?? null;
  }
}

export const portfolioApi = new PortfolioApiService();
