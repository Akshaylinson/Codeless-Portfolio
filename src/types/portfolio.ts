export type ProjectStatus = 'Development' | 'Production' | 'Live' | 'Beta' | 'Completed' | string;

export interface Project {
  project_id: string;
  slug: string;
  project_name: string;
  tagline: string;
  short_description: string;
  full_description: string;
  category: string;
  technologies: string[];
  thumbnail_image: string;
  cover_image: string;
  live_url?: string;
  github_url?: string;
  status: ProjectStatus;
  featured: boolean;
  published: boolean;
  created_date: string;
  sort_order: number;
}

export type SectionType = 
  | 'overview' 
  | 'problem' 
  | 'solution' 
  | 'features' 
  | 'architecture' 
  | 'outcomes' 
  | 'additional';

export interface ProjectDetail {
  project_id: string;
  section_type: SectionType;
  heading: string;
  content: string; // Plain text, markdown, or JSON string
  sort_order: number;
}

export type MediaType = 'thumbnail' | 'cover' | 'screenshot' | 'gallery';

export interface ProjectMedia {
  media_id: string;
  project_id: string;
  image_url: string;
  caption: string;
  media_type: MediaType;
  sort_order: number;
}

export interface SiteConfig {
  company_name: string;
  company_tagline: string;
  company_description: string;
  website: string;
  email: string;
  phone: string;
  whatsapp: string;
  linkedin: string;
  logo_url: string;
  portfolio_title: string;
  contact_cta_text: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  projects?: Project[];
  project?: Project;
  details?: ProjectDetail[];
  media?: ProjectMedia[];
  site?: Partial<SiteConfig>;
  error?: string;
}
