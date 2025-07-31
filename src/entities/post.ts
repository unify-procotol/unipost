export interface I18nContent {
  title?: string;
  content?: string;
  desc?: string;
}

interface GhostTag {
  id: string;
  name: string;
  slug: string;
  description?: string;
}

export interface GhostDataType {
  id: string;
  url: string;
  html: string;
  slug: string;
  tags: GhostTag[];
  uuid: string;
  title: string;
  access: boolean;
  excerpt: string;
  comments: boolean;
  featured: boolean;
  og_image?: string | null;
  og_title?: string | null;
  comment_id: string;
  created_at: string;
  meta_title: string;
  updated_at: string;
  visibility: string;
  frontmatter?: string | null;
  primary_tag: Primarytag;
  published_at: string;
  reading_time: number;
  canonical_url?: string | null;
  email_subject?: string | null;
  feature_image: string;
  twitter_image?: string | null;
  twitter_title?: string | null;
  custom_excerpt: string;
  og_description?: string | null;
  custom_template?: string | null;
  meta_description: string;
  feature_image_alt?: string | null;
  codeinjection_foot?: string | null;
  codeinjection_head?: string | null;
  twitter_description?: string | null;
  feature_image_caption: string;
}

interface Primarytag {
  id: string;
  url: string;
  name: string;
  slug: string;
  og_image?: string | null;
  og_title?: string | null;
  meta_title?: string | null;
  visibility: string;
  description: string;
  accent_color?: string | null;
  canonical_url?: string | null;
  feature_image?: string | null;
  twitter_image?: string | null;
  twitter_title?: string | null;
  og_description?: string | null;
  meta_description?: string | null;
  codeinjection_foot?: string | null;
  codeinjection_head?: string | null;
  twitter_description?: string | null;
}

export class PostEntity implements Record<string, unknown> {
  id?: number;
  project_id = 0;
  title = "";
  content = ``;
  i18n?: Record<string, I18nContent>;
  status = "pending";
  data?: Partial<GhostDataType>;
  created_at?: string;
  updated_at?: string;
  slug?: string;

  [key: string]: unknown;
}