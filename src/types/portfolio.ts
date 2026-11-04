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
  image_1?: string;
  image_1_caption?: string;
  image_2?: string;
  image_2_caption?: string;
  image_3?: string;
  image_3_caption?: string;
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
  hero_image: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  projects?: Project[];
  project?: Project;
  site?: Partial<SiteConfig>;
  error?: string;
}
