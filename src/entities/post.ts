export interface I18nContent {
  title?: string;
  content?: string;
}

export class PostEntity {
  id = 0;
  project_id = 0;
  title = "";
  slug = "";
  content = ``;
  i18n: Record<string, I18nContent> = {};
  status = "pending";
  created_at = "";
  updated_at = "";
}