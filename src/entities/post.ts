export interface I18nContent {
  title?: string;
  content?: string;
}

export interface GhostDataType {
  id: string;
  url: string;
  html: string;
  slug: string;
  tags: any[];
  uuid: string;
  title: string;
  access: boolean;
  excerpt: string;
  comments: boolean;
  featured: boolean;
  og_image?: any;
  og_title?: any;
  comment_id: string;
  created_at: string;
  meta_title: string;
  updated_at: string;
  visibility: string;
  frontmatter?: any;
  primary_tag: Primarytag;
  published_at: string;
  reading_time: number;
  canonical_url?: any;
  email_subject?: any;
  feature_image: string;
  twitter_image?: any;
  twitter_title?: any;
  custom_excerpt: string;
  og_description?: any;
  custom_template?: any;
  meta_description: string;
  feature_image_alt?: any;
  codeinjection_foot?: any;
  codeinjection_head?: any;
  twitter_description?: any;
  feature_image_caption: string;
}

interface Primarytag {
  id: string;
  url: string;
  name: string;
  slug: string;
  og_image?: any;
  og_title?: any;
  meta_title?: any;
  visibility: string;
  description: string;
  accent_color?: any;
  canonical_url?: any;
  feature_image?: any;
  twitter_image?: any;
  twitter_title?: any;
  og_description?: any;
  meta_description?: any;
  codeinjection_foot?: any;
  codeinjection_head?: any;
  twitter_description?: any;
}

export class PostEntity {
  id = 0;
  project_id = 0;
  title = "";
  slug = "";
  content = ``;
  i18n: Record<string, I18nContent> = {};
  status = "pending";
  data: Partial<GhostDataType> = {
    "feature_image": "",
  };
  created_at = "";
  updated_at = "";
}